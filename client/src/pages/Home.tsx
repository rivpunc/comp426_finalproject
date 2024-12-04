import { useQuery } from "@tanstack/react-query";
import WhaleFact from "../components/WhaleFact";
import BubbleEffect from "../components/BubbleEffect";
import FactsBrowser from "../components/FactsBrowser";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient } from "@/lib/queryClient";

export default function Home() {
  const { data: fact, isLoading } = useQuery({
    queryKey: ["dailyFact"],
    queryFn: async () => {
      const response = await fetch("/api/facts/daily");
      if (!response.ok) {
        throw new Error("Failed to fetch fact");
      }
      return response.json();
    },
  });

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <BubbleEffect />
      <div className="relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8">
          Today's Whale Fact
        </h1>
        {isLoading ? (
          <div className="w-full max-w-2xl mx-auto space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          fact && (
            <div className="space-y-6">
              <WhaleFact
                id={fact.id}
                fact={fact.fact}
                imageUrl={fact.imageUrl}
                onSaveChange={() => {
                  // Invalidate saved facts query
                  queryClient.invalidateQueries({ queryKey: ["savedFacts"] });
                }}
              />
              <FactsBrowser />
            </div>
          )
        )}
      </div>
    </div>
  );
}
