import type { CollectionsApi } from "@shared/collections";

declare global {
  interface Window {
    collections?: CollectionsApi;
  }
}

export {};
