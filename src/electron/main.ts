import { app, BrowserWindow, dialog } from "electron";
import path from "node:path";
import type sqlite3 from "sqlite3";
import { openDatabase, closeDatabase } from "./database/database.js";
import { createCollectionRepository } from "./database/collection-repository.js";
import { registerCollectionHandlers } from "./ipc/collection-handlers.js";
import { createMainWindow } from "./window.js";
import { getRendererUrl } from "./paths.js";

let database: sqlite3.Database | undefined;
let isClosing = false;

function reportStartupError(error: unknown) {
  console.error(error);
  dialog.showErrorBox(
    "Unable to start Collection Library",
    error instanceof Error ? error.message : "An unexpected error occurred.",
  );
  app.quit();
}

app.whenReady().then(async () => {
  database = await openDatabase(path.join(app.getPath("userData"), "data.db"));
  registerCollectionHandlers(createCollectionRepository(database), getRendererUrl());
  await createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createMainWindow().catch(reportStartupError);
    }
  });
}).catch(reportStartupError);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", (event) => {
  if (!database) return;
  event.preventDefault();
  if (isClosing) return;
  isClosing = true;

  void closeDatabase(database).catch(console.error).finally(() => {
    database = undefined;
    app.quit();
  });
});
