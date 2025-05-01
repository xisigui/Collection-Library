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
import { Input } from "@/components/ui/input";
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

interface Collection {
  id: number;
  title: string;
  description: string;
  url_picture: string;
}

function App() {
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [datas, setDatas] = useState<Collection[]>([]);
  const [newData, setNewData] = useState({
    title: "",
    description: "",
    url_picture: "",
  });

  useEffect(() => {
    fetchDatas();
  }, []);

  const fetchDatas = async () => {
    // @ts-ignore
    const res = await window.electron.getAllItems();
    setDatas(res);
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    try {
      // @ts-ignore
      const res = await window.electron.createCollection(
        newData.title,
        newData.description,
        newData.url_picture
      );
      toast.success("Collection created successfully!");
    } catch (error) {
      toast.error("Failed to create collection. Please try again.");
    } finally {
      fetchDatas();
      setNewData({ title: "", description: "", url_picture: "" });
      setIsCreateFormOpen(false);
    }
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
                            <DropdownMenuItem>Edit</DropdownMenuItem>
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

        <Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
          <DialogTrigger>
            <Button
              className="fixed bottom-4 right-4 z-1080"
              variant="outline"
              size="icon"
            >
              <CirclePlus size={48} strokeWidth={1.5} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCollection}>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newData.title}
                  onChange={(e) =>
                    setNewData({ ...newData, title: e.target.value })
                  }
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newData.description}
                  onChange={(e) =>
                    setNewData({ ...newData, description: e.target.value })
                  }
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="pictureUrl">Picture URL</Label>
                <Input
                  id="pictureUrl"
                  value={newData.url_picture}
                  onChange={(e) =>
                    setNewData({ ...newData, url_picture: e.target.value })
                  }
                />
              </div>
              <Button className="mt-3 p-4">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default App;
