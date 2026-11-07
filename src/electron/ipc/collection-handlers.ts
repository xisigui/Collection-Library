import { ipcMain, type IpcMainInvokeEvent } from "electron";
import type { CollectionIpc, CollectionsApi } from "../../shared/collections.js";
import { parseCollectionId, parseCollectionInput } from "./collection-validation.js";

function validateSender(event: IpcMainInvokeEvent, rendererUrl: string) {
  const frame = event.senderFrame;
  if (!frame || frame !== event.sender.mainFrame || frame.url !== rendererUrl) {
    throw new Error("Untrusted collection request.");
  }
}

export function registerCollectionHandlers(repository: CollectionsApi, rendererUrl: string) {
  const handlers: {
    [Channel in keyof CollectionIpc]: (...args: unknown[]) => ReturnType<CollectionIpc[Channel]>;
  } = {
    "collections:list": () => repository.list(),
    "collections:create": (input) => repository.create(parseCollectionInput(input)),
    "collections:update": (id, input) =>
      repository.update(parseCollectionId(id), parseCollectionInput(input)),
    "collections:delete": (id) => repository.delete(parseCollectionId(id)),
  };

  for (const [channel, handler] of Object.entries(handlers)) {
    ipcMain.handle(channel, (event, ...args: unknown[]) => {
      validateSender(event, rendererUrl);
      return handler(...args);
    });
  }
}
