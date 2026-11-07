import type { CollectionsApi } from "@shared/collections";

function getBridge(): CollectionsApi {
  if (!window.collections) {
    throw new Error("Open Collection Library in the desktop app to access your collections.");
  }
  return window.collections;
}

// Keep Electron access at this boundary; components depend on callbacks.
export const collectionsApi: CollectionsApi = {
  list: async () => getBridge().list(),
  create: async (input) => getBridge().create(input),
  update: async (id, input) => getBridge().update(id, input),
  delete: async (id) => getBridge().delete(id),
};
