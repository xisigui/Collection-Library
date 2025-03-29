import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    frame: false,
  });
  mainWindow.loadFile(path.join(app.getAppPath(), "dist-react/index.html"));
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
