import { BrowserWindow } from "electron";
import { getPreloadPath, getRendererUrl } from "./paths.js";

export async function createMainWindow() {
  const window = new BrowserWindow({
    width: 1195,
    height: 950,
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  window.setMenuBarVisibility(false);
  window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  window.webContents.on("will-navigate", (event, url) => {
    if (url !== getRendererUrl()) event.preventDefault();
  });

  try {
    await window.loadURL(getRendererUrl());
    return window;
  } catch (error) {
    window.destroy();
    throw error;
  }
}
