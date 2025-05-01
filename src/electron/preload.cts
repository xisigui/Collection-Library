import { ipcRenderer } from "electron";
const electron = require("electron");

electron.contextBridge.exposeInMainWorld("electron", {
  getAllItems: () => ipcRenderer.invoke("get-all-data"),
  createCollection: (title: string, description: string, imageURL: string) =>
    ipcRenderer.invoke("create-collection", title, description, imageURL),
  updateCollection: (
    id: number,
    title: string,
    description: string,
    imageURL: string
  ) =>
    ipcRenderer.invoke("update-collection", id, title, description, imageURL),
  deleteCollection: (id: number) => ipcRenderer.invoke("delete-collection", id),
});
