import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { queryClient } from "@/lib/queryClient";
import WhaleFact from "../components/WhaleFact";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const { data: savedFacts, isLoading: isLoadingSaved } = useQuery({
    queryKey: ["savedFacts"],
    queryFn: async () => {
      const response = await fetch("/api/facts/saved");
      if (!response.ok) throw new Error("Failed to fetch saved facts");
      return response.json();
    },
  });

  const { data: preferences, isLoading: isLoadingPrefs } = useQuery({
    queryKey: ["preferences"],
    queryFn: async () => {
      const response = await fetch("/api/preferences");
      if (!response.ok) throw new Error("Failed to fetch preferences");
      return response.json();
    },
  });

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Your Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingPrefs ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <Switch
                  id="notifications"
                  checked={preferences?.dailyNotifications}
                />
                <Label htmlFor="notifications">Daily Notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="sound"
                  checked={preferences?.soundEnabled}
                />
                <Label htmlFor="sound">Sound Effects</Label>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Saved Facts</h2>
        <div className="grid gap-6">
          {isLoadingSaved ? (
            Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))
          ) : (
            savedFacts?.map((fact: any) => (
              <WhaleFact
                key={fact.id}
                id={fact.id}
                fact={fact.fact}
                imageUrl={fact.imageUrl}
                isSaved={true}
                onSaveChange={(saved) => {
                  if (!saved) {
                    // Optimistically remove from the list
                    queryClient.setQueryData(
                      ["savedFacts"],
                      (old: any[]) => old.filter(f => f.id !== fact.id)
                    );
                  }
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
