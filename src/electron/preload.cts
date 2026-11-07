import { contextBridge, ipcRenderer } from "electron";
import type { CollectionIpc, CollectionsApi } from "../shared/collections.js" with { "resolution-mode": "import" };

function invoke<Channel extends keyof CollectionIpc>(
  channel: Channel,
  ...args: Parameters<CollectionIpc[Channel]>
): Promise<Awaited<ReturnType<CollectionIpc[Channel]>>> {
  return ipcRenderer.invoke(channel, ...args);
}

const collections: CollectionsApi = {
  list: () => invoke("collections:list"),
  create: (input) => invoke("collections:create", input),
  update: (id, input) => invoke("collections:update", id, input),
  delete: (id) => invoke("collections:delete", id),
};

contextBridge.exposeInMainWorld("collections", collections);
