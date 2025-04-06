import { Card, CardContent } from "@/components/ui/card";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export function PreviewImageDialog({ imgUrl, title, description }) {
  const [openDialog, setOpenDialog] = useState(false);

  // Function to handle the DialogTrigger click
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent the dropdown from closing when "Delete" is clicked
    setOpenDialog(true); // Open the dialog
  };
  return (
    <Card className="py-0 gap-0 rounded-lg">
      <CardContent className="px-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={imgUrl}
            alt="Product Image"
            width={600}
            height={400}
            className="w-full h-64 object-cover"
            style={{ aspectRatio: "600/400", objectFit: "cover" }}
          />
          <div className="absolute top-0 right-0 p-2">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  className="data-[state=open]:bg-muted"
                  variant="ghost"
                  size="icon"
                >
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-24">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteClick}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dialog component */}
            {openDialog && (
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button onClick={() => setOpenDialog(false)}>
                      Confirm
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <div className="p-6 space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
