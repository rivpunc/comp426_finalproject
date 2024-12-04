import { db } from "db";
import { whaleFacts } from "@db/schema";

const WHALE_IMAGES = [
  "https://images.unsplash.com/photo-1602611162728-0222143b4621",
  "https://images.unsplash.com/photo-1575278221636-c84079087c9f",
  "https://images.unsplash.com/photo-1698907774454-063599f7c345",
  "https://images.unsplash.com/photo-1687904403491-02dc344002f6",
  "https://images.unsplash.com/photo-1634931406069-fdd4aea9e355",
  "https://images.unsplash.com/photo-1551172237-d80816ea094d",
];

const INITIAL_FACTS = [
  "Blue whales are the largest animals ever known to exist, reaching lengths of up to 100 feet.",
  "Humpback whales create 'songs' that can last for hours and can be heard from miles away.",
  "Beluga whales can change the shape of their head by moving air around their sinuses.",
  "Orcas (killer whales) are actually the largest member of the dolphin family.",
  "Some whales can hold their breath for up to 90 minutes while diving.",
  "The heart of a blue whale can weigh as much as a car.",
];

export function initializeFactService() {
  async function initializeFacts() {
    const existingFacts = await db.query.whaleFacts.findMany();
    
    if (existingFacts.length === 0) {
      for (let i = 0; i < INITIAL_FACTS.length; i++) {
        await db.insert(whaleFacts).values({
          fact: INITIAL_FACTS[i],
          imageUrl: WHALE_IMAGES[i],
          source: "WhaleWatch Research",
        });
      }
    }
  }

  async function getDailyFact() {
    const facts = await db.query.whaleFacts.findMany();
    const today = new Date();
    const index = today.getDate() % facts.length;
    return facts[index];
  }

  // Initialize facts on service start
  initializeFacts();

  async function getAllFacts() {
    const facts = await db.query.whaleFacts.findMany({
      orderBy: (whaleFacts, { desc }) => [desc(whaleFacts.createdAt)],
    });
    return facts;
  }

  return {
    getDailyFact,
    getAllFacts,
  };
}
