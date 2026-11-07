import { CirclePlus } from "lucide-react";
import { useState } from "react";
import type { Collection } from "@shared/collections";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CollectionCard } from "./components/collection-card";
import { DeleteItemDialog } from "./components/delete-item-dialog";
import { ItemFormDialog } from "./components/item-form-dialog";
import { useCollections } from "./hooks/use-collections";

type ActiveDialog =
  | { kind: "create" }
  | { kind: "edit"; collection: Collection }
  | { kind: "delete"; collection: Collection }
  | null;

export function CollectionsPage() {
  const {
    collections, isLoading, error, retry,
    createCollection, updateCollection, deleteCollection,
  } = useCollections();
  const [dialog, setDialog] = useState<ActiveDialog>(null);

  function handleOpenChange(open: boolean) {
    if (!open) setDialog(null);
  }

  return (
    <main className="h-screen flex flex-col items-center justify-between p-4 overflow-hidden">
      {isLoading ? (
        <p role="status" className="m-auto">Loading collections...</p>
      ) : error ? (
        <div className="m-auto space-y-4 text-center">
          <p role="alert">{error}</p>
          <Button onClick={retry}>Try again</Button>
        </div>
      ) : collections.length === 0 ? (
        <p className="m-auto">No Data Available</p>
      ) : (
        <ScrollArea className="flex-1 size-full p-4">
          <div className="grid grid-cols-4 gap-4 w-full h-full">
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onEdit={() => setDialog({ kind: "edit", collection })}
                onDelete={() => setDialog({ kind: "delete", collection })}
              />
            ))}
          </div>
        </ScrollArea>
      )}

      <Button
        className="fixed bottom-4 right-4 z-40"
        variant="outline"
        size="icon"
        aria-label="Add item"
        disabled={isLoading || Boolean(error)}
        onClick={() => setDialog({ kind: "create" })}
      >
        <CirclePlus size={48} strokeWidth={1.5} />
      </Button>

      {dialog?.kind === "create" && (
        <ItemFormDialog
          key="create"
          open
          onOpenChange={handleOpenChange}
          onSubmit={createCollection}
        />
      )}
      {dialog?.kind === "edit" && (
        <ItemFormDialog
          key={dialog.collection.id}
          open
          initialData={dialog.collection}
          onOpenChange={handleOpenChange}
          onSubmit={(input) => updateCollection(dialog.collection.id, input)}
        />
      )}
      {dialog?.kind === "delete" && (
        <DeleteItemDialog
          open
          onOpenChange={handleOpenChange}
          onConfirm={() => deleteCollection(dialog.collection.id)}
        />
      )}
    </main>
  );
}
