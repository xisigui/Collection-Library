export interface Collection {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

export type CollectionInput = Omit<Collection, "id">;

export interface CollectionsApi {
  list(): Promise<Collection[]>;
  create(input: CollectionInput): Promise<Collection>;
  update(id: number, input: CollectionInput): Promise<Collection>;
  delete(id: number): Promise<void>;
}

// Types only: the sandboxed preload must not require another local module.
export interface CollectionIpc {
  "collections:list": CollectionsApi["list"];
  "collections:create": CollectionsApi["create"];
  "collections:update": CollectionsApi["update"];
  "collections:delete": CollectionsApi["delete"];
}
