import { Ellipsis } from "lucide-react";
import type { Collection } from "@shared/collections";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CollectionCardProps {
  collection: Collection;
  onEdit: () => void;
  onDelete: () => void;
}

function getImageSource(imageUrl: string) {
  try {
    const url = new URL(imageUrl);
    if (url.protocol === "http:" || url.protocol === "https:") return url.href;
  } catch {
    // Empty and malformed URLs use the existing placeholder.
  }
  return "https://placehold.co/600x400/transparent/FFF?text=No Image Found";
}

export function CollectionCard({ collection, onEdit, onDelete }: CollectionCardProps) {
  return (
    <Card className="py-0 gap-0 rounded-lg">
      <CardContent className="px-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={getImageSource(collection.imageUrl)}
            alt={collection.title}
            width={600}
            height={400}
            className="w-full h-64 object-cover"
            style={{ aspectRatio: "600/400", objectFit: "cover" }}
          />
          <div className="absolute top-0 right-0 p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="data-[state=open]:bg-muted"
                  variant="ghost"
                  size="icon"
                  aria-label={`Actions for ${collection.title}`}
                >
                  <Ellipsis />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-24">
                <DropdownMenuItem onSelect={onEdit}>Edit</DropdownMenuItem>
                <DropdownMenuItem onSelect={onDelete}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="p-6 space-y-2">
          <h3 className="text-xl font-semibold">{collection.title}</h3>
          <p className="text-gray-500 dark:text-gray-400">{collection.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
