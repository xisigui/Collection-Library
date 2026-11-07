import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

test("compiled preload only requires Electron and exposes the four collection operations", async () => {
  const source = await readFile(new URL("../dist-electron/electron/preload.cjs", import.meta.url), "utf8");
  const calls = [];
  let api;
  vm.runInNewContext(source, {
    exports: {},
    require(name) {
      assert.equal(name, "electron", "Sandboxed preload cannot require local files");
      return {
        contextBridge: {
          exposeInMainWorld(key, value) { assert.equal(key, "collections"); api = value; },
        },
        ipcRenderer: {
          invoke: async (...args) => { calls.push(args); return "result"; },
        },
      };
    },
  });
  assert.deepEqual(Object.keys(api).sort(), ["create", "delete", "list", "update"]);
  const input = { title: "Test", description: "", imageUrl: "" };
  assert.equal(await api.list(), "result");
  await api.create(input);
  await api.update(7, input);
  await api.delete(7);
  assert.deepEqual(calls, [
    ["collections:list"], ["collections:create", input],
    ["collections:update", 7, input], ["collections:delete", 7],
  ]);
});
