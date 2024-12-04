import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import WhaleFact from "./WhaleFact";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { queryClient } from "@/lib/queryClient";

export default function FactsBrowser() {
  const [open, setOpen] = useState(false);
  
  const { data: facts, isLoading } = useQuery({
    queryKey: ["allFacts"],
    queryFn: async () => {
      const response = await fetch("/api/facts");
      if (!response.ok) throw new Error("Failed to fetch facts");
      return response.json();
    },
    enabled: open, // Only fetch when dialog is open
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="w-full py-6 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 group-hover:scale-110 transition-transform duration-300" />
          <div className="relative flex items-center justify-center gap-2">
            <span>Browse More Facts</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[80vh]">
        <DialogTitle className="text-2xl font-bold mb-4">
          All Whale Facts
        </DialogTitle>
        <ScrollArea className="h-[calc(80vh-8rem)] pr-4">
          <div className="space-y-6 py-4">
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            ) : (
              facts?.map((fact: any) => (
                <WhaleFact
                  key={fact.id}
                  id={fact.id}
                  fact={fact.fact}
                  imageUrl={fact.imageUrl}
                  onSaveChange={() => {
                    queryClient.invalidateQueries({ queryKey: ["savedFacts"] });
                  }}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
