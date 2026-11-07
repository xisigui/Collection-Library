import { app } from "electron";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const isDev = () => process.env.NODE_ENV === "development" && !app.isPackaged;

export function getPreloadPath() {
  return fileURLToPath(new URL("./preload.cjs", import.meta.url));
}

export function getRendererUrl() {
  return isDev()
    ? "http://localhost:5123/"
    : pathToFileURL(path.join(app.getAppPath(), "dist-react/index.html")).href;
}
