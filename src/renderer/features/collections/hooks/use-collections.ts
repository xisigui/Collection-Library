import { useEffect, useState } from "react";
import type { Collection, CollectionInput } from "@shared/collections";
import { collectionsApi } from "../api/collections-api";

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadVersion, setLoadVersion] = useState(0);

  useEffect(() => {
    let active = true;

    collectionsApi.list().then((items) => {
      if (active) setCollections(items);
    }).catch((error: unknown) => {
      if (active) {
        setError(error instanceof Error ? error.message : "Unable to load collections.");
      }
    }).finally(() => {
      if (active) setIsLoading(false);
    });

    return () => { active = false; };
  }, [loadVersion]);

  async function createCollection(input: CollectionInput) {
    const created = await collectionsApi.create(input);
    setCollections((current) => [...current, created].sort((a, b) => a.id - b.id));
  }

  async function updateCollection(id: number, input: CollectionInput) {
    const updated = await collectionsApi.update(id, input);
    setCollections((current) => current.map((item) => item.id === id ? updated : item));
  }

  async function deleteCollection(id: number) {
    await collectionsApi.delete(id);
    setCollections((current) => current.filter((item) => item.id !== id));
  }

  function retry() {
    setError(null);
    setIsLoading(true);
    setLoadVersion((current) => current + 1);
  }

  return { collections, isLoading, error, retry, createCollection, updateCollection, deleteCollection };
}
