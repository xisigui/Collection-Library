import type { CollectionInput } from "../../shared/collections.js";

export function parseCollectionId(value: unknown): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) {
    throw new Error("Invalid collection ID.");
  }
  return value;
}

export function parseCollectionInput(value: unknown): CollectionInput {
  if (typeof value !== "object" || value === null) {
    throw new Error("Invalid collection details.");
  }

  const input = value as Record<string, unknown>;
  if (
    typeof input.title !== "string" ||
    typeof input.description !== "string" ||
    typeof input.imageUrl !== "string"
  ) {
    throw new Error("Collection fields must be text.");
  }
  if (!input.title.trim()) {
    throw new Error("A title is required.");
  }

  return {
    title: input.title.trim(),
    description: input.description,
    imageUrl: input.imageUrl.trim(),
  };
}
