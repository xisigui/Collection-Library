const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  getAllItems: () => console.log(""),
});
