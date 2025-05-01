import "./App.css";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CirclePlus, Ellipsis } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { isURL } from "validator";
import { ItemDialog } from "./components/items/item-dialog";

interface Collection {
  id: number;
  title: string;
  description: string;
  url_picture: string;
}

function App() {
  const [datas, setDatas] = useState<Collection[]>([]);

  useEffect(() => {
    fetchDatas();
  }, []);

  const fetchDatas = async () => {
    // @ts-ignore
    const res = await window.electron.getAllItems();
    setDatas(res);
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setOpenDialog(true);
  };

  const handleDeleteCollection = async (id: number) => {
    try {
      // @ts-ignore
      await window.electron.deleteCollection(id);
      toast.success("Collection deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete collection. Please try again.");
    } finally {
      fetchDatas();
      setOpenDialog(false);
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col items-center justify-between p-4 overflow-hidden">
        {datas.length === 0 ? (
          <Label className="justify-center h-screen overflow-hidden">
            No Data Available
          </Label>
        ) : (
          <ScrollArea className="flex-1 size-full p-4 ">
            <div className="grid grid-cols-4 gap-4 w-full h-full">
              {datas.map((item) => (
                <Card key={item.id} className="py-0 gap-0 rounded-lg">
                  <CardContent className="px-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={
                          isURL(item.url_picture)
                            ? item.url_picture
                            : "https://placehold.co/600x400/transparent/FFF?text=No Image Found"
                        }
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
                            <ItemDialog
                              initialData={{
                                title: item.title,
                                description: item.description,
                                imageUrl: item.url_picture,
                              }}
                              itemId={item.id}
                              trigger={
                                <DropdownMenuItem
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  Edit
                                </DropdownMenuItem>
                              }
                            />
                            <DropdownMenuItem onClick={handleDeleteClick}>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Dialog component */}
                        {openDialog && (
                          <Dialog
                            open={openDialog}
                            onOpenChange={setOpenDialog}
                          >
                            <DialogTrigger />
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Are you absolutely sure?
                                </DialogTitle>
                                <DialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete the data.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    handleDeleteCollection(item.id)
                                  }
                                >
                                  Confirm
                                </Button>
                                <Button onClick={() => setOpenDialog(false)}>
                                  Cancel
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>

                    <div className="p-6 space-y-2">
                      <h3 className="text-xl font-semibold">{item.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}

        <ItemDialog
          trigger={
            <Button
              className="fixed bottom-4 right-4 z-1080"
              variant="outline"
              size="icon"
            >
              <CirclePlus size={48} strokeWidth={1.5} />
            </Button>
          }
        />
      </div>
    </>
  );
}

export default App;
