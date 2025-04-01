import "./App.css";
import { PreviewImageDialog } from "./components/preview-image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

interface Collection {
  id: number;
  title: string;
  description: string;
  url_picture: string;
}

function App() {
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
    // @ts-ignore
    const res = await window.electron.createCollection(
      newData.title,
      newData.description,
      newData.url_picture
    );
    fetchDatas();
    setNewData({ title: "", description: "", url_picture: "" });
  };

  return (
    <>
      <ScrollArea className="h-screen p-4">
        <div className="grid grid-cols-4 gap-4 w-full h-full">
          {datas.map((item, index) => (
            <PreviewImageDialog
              key={index}
              imgUrl={item.url_picture}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>
        <Dialog>
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
      </ScrollArea>
    </>
  );
}

export default App;
