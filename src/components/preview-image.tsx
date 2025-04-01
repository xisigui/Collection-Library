import { Card, CardContent } from "@/components/ui/card";

export function PreviewImageDialog({ imgUrl, title, description }) {
  return (
    <Card className="py-0 gap-0 rounded-lg">
      <CardContent className="px-0">
        <div className="overflow-hidden rounded-t-lg">
          <img
            src={imgUrl}
            alt="Product Image"
            width={600}
            height={400}
            className="w-full h-64 object-cover"
            style={{ aspectRatio: "600/400", objectFit: "cover" }}
          />
        </div>

        <div className="p-6 space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
