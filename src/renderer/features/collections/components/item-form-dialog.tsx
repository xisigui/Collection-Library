import { useId, useState, type FormEvent } from "react";
import type { CollectionInput } from "@shared/collections";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ItemFormDialogProps {
  initialData?: CollectionInput;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: CollectionInput) => Promise<void>;
}

export function ItemFormDialog({
  initialData, open, onOpenChange, onSubmit,
}: ItemFormDialogProps) {
  const fieldId = useId();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CollectionInput>(() => ({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    imageUrl: initialData?.imageUrl ?? "",
  }));
  const isEditing = Boolean(initialData);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;
    if (!formData.title.trim()) {
      setError("A title is required.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to save the item.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => { if (!isSaving) onOpenChange(value); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Item" : "Create New Item"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Make changes to your item here." : "Add a new item to your collection."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" aria-busy={isSaving}>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor={`${fieldId}-title`}>Title</Label>
            <Input
              id={`${fieldId}-title`}
              required
              disabled={isSaving}
              value={formData.title}
              onChange={(event) => setFormData({ ...formData, title: event.target.value })}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor={`${fieldId}-description`}>Description</Label>
            <Input
              id={`${fieldId}-description`}
              disabled={isSaving}
              value={formData.description}
              onChange={(event) => setFormData({ ...formData, description: event.target.value })}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor={`${fieldId}-image`}>Picture URL</Label>
            <Input
              id={`${fieldId}-image`}
              disabled={isSaving}
              value={formData.imageUrl}
              onChange={(event) => setFormData({ ...formData, imageUrl: event.target.value })}
            />
          </div>
          {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
          <DialogFooter>
            <Button type="button" variant="outline" disabled={isSaving} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : isEditing ? "Update Item" : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
