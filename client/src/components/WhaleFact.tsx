import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/hooks/use-toast";

interface WhaleFactProps {
  id: number;
  fact: string;
  imageUrl: string;
  isSaved?: boolean;
  onSaveChange?: (saved: boolean) => void;
}

export default function WhaleFact({ id, fact, imageUrl, isSaved, onSaveChange }: WhaleFactProps) {
  const [isLiked, setIsLiked] = useState(isSaved);
  const { toast } = useToast();

  const handleSave = async () => {
    const newSavedState = !isLiked;
    setIsLiked(newSavedState);
    onSaveChange?.(newSavedState);
    
    try {
      if (newSavedState) {
        await fetch("/api/facts/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ factId: id }),
        });
      } else {
        await fetch(`/api/facts/saved/${id}`, {
          method: "DELETE",
        });
      }

      toast({
        title: newSavedState ? "Fact saved to favorites" : "Fact removed from favorites",
        duration: 2000,
      });
    } catch (error) {
      setIsLiked(!newSavedState); // Revert on error
      onSaveChange?.(!newSavedState);
      toast({
        title: "Error",
        description: "Failed to update saved status",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden">
      <CardHeader className="p-0">
        <AspectRatio ratio={16 / 9}>
          <img
            src={imageUrl}
            alt="Whale"
            className="object-cover w-full h-full"
          />
        </AspectRatio>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex justify-between items-start gap-4">
          <p className="text-lg leading-relaxed">{fact}</p>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            className="flex-shrink-0"
          >
            <Heart
              className={`h-5 w-5 ${
                isLiked ? "fill-primary text-primary" : "text-gray-500"
              }`}
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
