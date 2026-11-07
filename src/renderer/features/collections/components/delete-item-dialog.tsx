import { useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export function DeleteItemDialog({ open, onOpenChange, onConfirm }: DeleteItemDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (isDeleting) return;
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to delete the item.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => { if (!isDeleting) onOpenChange(value); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the data.
          </DialogDescription>
        </DialogHeader>
        {error && <p role="alert" className="text-destructive text-sm">{error}</p>}
        <DialogFooter>
          <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Confirm"}
          </Button>
          <Button onClick={() => onOpenChange(false)} disabled={isDeleting}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
