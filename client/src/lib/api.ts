import { type WhaleFact, type QuizQuestion } from "@db/schema";

export async function getDailyFact(): Promise<WhaleFact> {
  const response = await fetch("/api/facts/daily");
  if (!response.ok) throw new Error("Failed to fetch daily fact");
  return response.json();
}

export async function getSavedFacts(): Promise<WhaleFact[]> {
  const response = await fetch("/api/facts/saved");
  if (!response.ok) throw new Error("Failed to fetch saved facts");
  return response.json();
}

export async function saveFact(factId: number): Promise<void> {
  const response = await fetch("/api/facts/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ factId }),
  });
  if (!response.ok) throw new Error("Failed to save fact");
}

export async function getQuizQuestions(): Promise<QuizQuestion[]> {
  const response = await fetch("/api/quiz/questions");
  if (!response.ok) throw new Error("Failed to fetch quiz questions");
  return response.json();
}

export async function updatePreferences(preferences: {
  dailyNotifications: boolean;
  soundEnabled: boolean;
}): Promise<void> {
  const response = await fetch("/api/preferences", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(preferences),
  });
  if (!response.ok) throw new Error("Failed to update preferences");
}
