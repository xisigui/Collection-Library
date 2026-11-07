const assert = require("node:assert/strict");
const { mkdtempSync } = require("node:fs");
const { tmpdir } = require("node:os");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { setTimeout: delay } = require("node:timers/promises");
const { app, BrowserWindow } = require("electron");

// Use an isolated profile and an in-memory database, never the user's library.
app.setPath("userData", mkdtempSync(path.join(tmpdir(), "collection-library-desktop-")));
const root = path.resolve(__dirname, "..");
const rendererFile = path.join(root, "dist-react/index.html");
const preload = path.join(root, "dist-electron/electron/preload.cjs");
let database;
let closeDatabase;
let window;
let failCreate = false;
let failDelete = false;
let loads = 0;
const timeout = setTimeout(() => { console.error("Desktop smoke test timed out."); app.exit(1); }, 45_000);

function evaluate(source) { return window.webContents.executeJavaScript(source); }

async function waitFor(expression) {
  const deadline = Date.now() + 5_000;
  while (Date.now() < deadline) {
    if (await evaluate(expression)) return;
    await delay(50);
  }
  throw new Error(`Timed out waiting for: ${expression}`);
}

async function clickButton(text) {
  await evaluate(`(() => {
    const button = [...document.querySelectorAll('button')].find((item) => item.textContent === ${JSON.stringify(text)});
    if (!button) throw new Error('Button not found');
    button.click();
  })()`);
}

async function fill(label, value) {
  await evaluate(`(() => {
    const label = [...document.querySelectorAll('label')].find((item) => item.textContent === ${JSON.stringify(label)});
    const input = document.getElementById(label.htmlFor);
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, ${JSON.stringify(value)});
    input.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
}

async function selectAction(label) {
  await evaluate(`document.querySelector('button[aria-label^="Actions for"]').dispatchEvent(
    new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerType: 'mouse', isPrimary: true })
  )`);
  await waitFor("Boolean(document.querySelector('[role=menuitem]'))");
  await evaluate(`[...document.querySelectorAll('[role=menuitem]')].find((item) => item.textContent === ${JSON.stringify(label)}).click()`);
  await waitFor("Boolean(document.querySelector('[role=dialog]'))");
}

app.whenReady().then(async () => {
  const databaseModule = await import("../dist-electron/electron/database/database.js");
  closeDatabase = databaseModule.closeDatabase;
  const { createCollectionRepository } = await import("../dist-electron/electron/database/collection-repository.js");
  const { registerCollectionHandlers } = await import("../dist-electron/electron/ipc/collection-handlers.js");
  database = await databaseModule.openDatabase(":memory:");
  const repository = createCollectionRepository(database);
  registerCollectionHandlers({
    ...repository,
    create: (input) => failCreate ? Promise.reject(new Error("Test save failure")) : repository.create(input),
    delete: (id) => failDelete ? Promise.reject(new Error("Test delete failure")) : repository.delete(id),
  }, pathToFileURL(rendererFile).href);

  window = new BrowserWindow({
    show: false,
    webPreferences: { preload, sandbox: true, contextIsolation: true, nodeIntegration: false, backgroundThrottling: false },
  });
  window.webContents.session.webRequest.onBeforeRequest({ urls: ["https://*/*", "http://*/*"] }, (_details, callback) => callback({ cancel: true }));
  window.webContents.on("did-finish-load", () => { loads++; });
  await window.loadFile(rendererFile);
  await waitFor("document.body.textContent.includes('No Data Available')");
  assert.equal(await evaluate("typeof window.collections.list"), "function");
  assert.equal(await evaluate("typeof window.require"), "undefined");

  await evaluate("document.querySelector('button[aria-label=\"Add item\"]').click()");
  await waitFor("Boolean(document.querySelector('[role=dialog]'))");
  await fill("Title", "Smoke test item");
  await fill("Description", "Created through React and IPC");
  failCreate = true;
  await clickButton("Add Item");
  await waitFor("document.querySelector('[role=alert]')?.textContent.includes('Test save failure')");
  assert.deepEqual(await repository.list(), []);
  failCreate = false;
  await clickButton("Add Item");
  await waitFor("document.querySelector('h3')?.textContent === 'Smoke test item' && !document.querySelector('[role=dialog]')");
  assert.equal((await repository.list()).length, 1);

  await selectAction("Edit");
  await fill("Title", "Updated item");
  await clickButton("Update Item");
  await waitFor("document.querySelector('h3')?.textContent === 'Updated item' && !document.querySelector('[role=dialog]')");
  assert.equal((await repository.list())[0].title, "Updated item");

  await selectAction("Delete");
  failDelete = true;
  await clickButton("Confirm");
  await waitFor("document.querySelector('[role=alert]')?.textContent.includes('Test delete failure')");
  assert.equal((await repository.list()).length, 1);
  failDelete = false;
  await clickButton("Confirm");
  await waitFor("document.body.textContent.includes('No Data Available') && !document.querySelector('[role=dialog]')");
  assert.deepEqual(await repository.list(), []);
  assert.equal(loads, 1, "CRUD must update React state without reloading the page");

  const validationError = await evaluate("window.collections.create({ title: ' ', description: '', imageUrl: '' }).catch((error) => error.message)");
  assert.match(validationError, /title is required/);

  const untrusted = new BrowserWindow({ show: false, webPreferences: { preload, sandbox: true, contextIsolation: true } });
  try {
    await untrusted.loadURL("about:blank");
    const error = await untrusted.webContents.executeJavaScript("window.collections.list().catch((error) => error.message)");
    assert.match(error, /Untrusted collection request/);
  } finally {
    untrusted.destroy();
  }
  console.log("Desktop smoke test passed: preload, CRUD, failed mutations, validation, and no page reloads.");
}).then(() => finish(0), (error) => { console.error(error); return finish(1); });

async function finish(code) {
  clearTimeout(timeout);
  if (window && !window.isDestroyed()) window.destroy();
  if (database) await closeDatabase(database);
  app.exit(code);
}
