import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { getPreloadPath } from "./pathResolver.js";
import { isDev } from "./util.js";
import sqlite3 from "sqlite3";

let db: sqlite3.Database | null = null;

function createDatabase() {
  const userDataPath = path.join(app.getPath("userData"), "data.db");

  db = new sqlite3.Database(userDataPath, (err) => {
    if (err) {
      console.error("Error opening database: ", err);
    } else {
      console.log("Connected to the SQLite database.");
    }
  });

  db.run(`CREATE TABLE IF NOT EXISTS collections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    url_picture TEXT NOT NULL
  )`);
}

app.on("ready", () => {
  createDatabase();
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

ipcMain.handle("get-all-data", async () => {
  return new Promise((resolve, reject) => {
    db?.all("SELECT * FROM collections", (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
});

ipcMain.handle(
  "create-collection",
  async (event, title: string, description: string, imageURL: string) => {
    return new Promise((resolve, reject) => {
      db?.run(
        "INSERT INTO collections (title, description, url_picture) VALUES (?,?,?)",
        [title, description, imageURL],
        function (err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, title, description, imageURL });
        }
      );
    });
  }
);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
