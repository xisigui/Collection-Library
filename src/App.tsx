import "./App.css";
import { PreviewImageDialog } from "./components/preview-image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function App() {
  // @ts-ignore
  window.electron.getAllItems();

  const sampleData = [
    {
      imgUrl:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBzdW5zZXR8ZW58MHx8MHx8fDA%3D",
      title: "Beach Sunset",
      description: "A beautiful sunset at the beach.",
    },
    {
      imgUrl:
        "https://images.unsplash.com/photo-1615809265087-1416ccddd6ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW4lMjB2aWV3fGVufDB8fDB8fHww",
      title: "Mountain View",
      description: "Stunning view of the mountains during sunset.",
    },
    {
      imgUrl:
        "https://images.unsplash.com/photo-1742268351241-b1b2ccae70c5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw3fHx8ZW58MHx8fHx8",
      title: "City Skyline",
      description: "A breathtaking city skyline at night.",
    },
    {
      imgUrl:
        "https://images.unsplash.com/photo-1742201835989-4e346e36b364?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw4fHx8ZW58MHx8fHx8",
      title: "Forest Adventure",
      description: "Exploring the deep forest on a bright day.",
    },
    {
      imgUrl:
        "https://images.unsplash.com/photo-1742054294284-baa5691ede46?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxMXx8fGVufDB8fHx8fA%3D%3D",
      title: "Winter Wonderland",
      description: "Snowy winter landscape with a serene atmosphere.",
    },
    {
      imgUrl:
        "https://images.unsplash.com/photo-1742268351428-ba1366f7dae3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D",
      title: "Desert Oasis",
      description: "A peaceful oasis in the middle of the desert.",
    },
    {
      imgUrl:
        "https://images.unsplash.com/photo-1742268351428-ba1366f7dae3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D",
      title: "Desert Oasis",
      description: "A peaceful oasis in the middle of the desert.",
    },
    {
      imgUrl:
        "https://images.unsplash.com/photo-1742268351428-ba1366f7dae3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D",
      title: "Desert Oasis",
      description: "A peaceful oasis in the middle of the desert.",
    },
    {
      imgUrl:
        "https://images.unsplash.com/photo-1742268351428-ba1366f7dae3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D",
      title: "Desert Oasis",
      description: "A peaceful oasis in the middle of the desert.",
    },
    {
      imgUrl:
        "https://images.unsplash.com/photo-1742268351428-ba1366f7dae3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D",
      title: "Desert Oasis",
      description: "A peaceful oasis in the middle of the desert.",
    },
    {
      imgUrl:
        "https://images.unsplash.com/photo-1742268351428-ba1366f7dae3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D",
      title: "Desert Oasis",
      description: "A peaceful oasis in the middle of the desert.",
    },
  ];
  return (
    <>
      <ScrollArea className="h-screen p-4">
        <div className="grid grid-cols-4 gap-4 w-full h-full">
          {sampleData.map((item) => (
            <PreviewImageDialog
              imgUrl={item.imgUrl}
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
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Input id="description" />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="pictureUrl">Picture URL</Label>
              <Input id="pictureUrl" />
            </div>
            <Button className="mt-3 p-4">Save</Button>
          </DialogContent>
        </Dialog>
      </ScrollArea>
    </>
  );
}

export default App;
