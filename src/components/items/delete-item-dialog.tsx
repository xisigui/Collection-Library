"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteItemDialogProps {
  itemId: number;
  trigger: React.ReactNode;
}

export function DeleteItemDialog({ itemId, trigger }: DeleteItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (itemId: number) => {
    console.log("Delete item");
    try {
      // @ts-ignore
      await window.electron.deleteCollection(itemId);
    } catch (error) {
      console.error(error);
    } finally {
      setOpen(false);
      setIsLoading(false);
      location.reload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the data.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => handleDelete(itemId)}
            disabled={isLoading}
          >
            Confirm
          </Button>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
