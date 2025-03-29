import { app, BrowserWindow } from "electron";
import path from "path";
import { getPreloadPath } from "./pathResolver.js";
import { isDev } from "./util.js";
import { getAllItems } from "./dataManager.js";

app.on("ready", () => {
  const mainWindow = new BrowserWindow({
    width: 1195,
    height: 950,
    webPreferences: {
      preload: getPreloadPath(),
    },
  });
  mainWindow.setMenuBarVisibility(false);
  if (isDev()) {
    mainWindow.loadURL("http://localhost:5123");
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "dist-react/index.html"));
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
