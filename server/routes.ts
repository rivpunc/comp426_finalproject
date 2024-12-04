import type { Express } from "express";
import passport from "passport";
import { db } from "db";
import { eq, and } from "drizzle-orm";
import { users, whaleFacts, savedFacts, quizQuestions, userPreferences } from "@db/schema";
import { initializeFactService } from "./services/factService";
import { initializeQuizService } from "./services/quizService";
import { ensureAuthenticated } from "./auth";

export function registerRoutes(app: Express) {
  // Initialize services
  const factService = initializeFactService();
  const quizService = initializeQuizService();

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = req.body;
      const existingUser = await db.query.users.findFirst({
        where: eq(users.username, username),
      });

      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const [user] = await db.insert(users).values({ username, password }).returning();
      await db.insert(userPreferences).values({
        userId: user.id,
        dailyNotifications: true,
        soundEnabled: true,
      });

      req.login(user, (err) => {
        if (err) throw err;
        res.json(user);
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/auth/status", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ isAuthenticated: true, user: req.user });
    } else {
      res.json({ isAuthenticated: false });
    }
  });

  // Whale facts routes
  app.get("/api/facts/daily", async (req, res) => {
    try {
      const fact = await factService.getDailyFact();
      res.json(fact);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch daily fact" });
    }
  });
  app.get("/api/facts", async (req, res) => {
    try {
      const facts = await factService.getAllFacts();
      res.json(facts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch facts" });
    }
  });


  app.get("/api/facts/saved", ensureAuthenticated, async (req, res) => {
    try {
      const userSavedFacts = await db
        .select({
          id: whaleFacts.id,
          fact: whaleFacts.fact,
          imageUrl: whaleFacts.imageUrl,
          source: whaleFacts.source,
        })
        .from(savedFacts)
        .innerJoin(whaleFacts, eq(savedFacts.factId, whaleFacts.id))
        .where(eq(savedFacts.userId, req.user!.id));

      res.json(userSavedFacts);
    } catch (error) {
      console.error("Error fetching saved facts:", error);
      res.status(500).json({ error: "Failed to fetch saved facts" });
    }
  });

  app.post("/api/facts/save", ensureAuthenticated, async (req, res) => {
    try {
      const { factId } = req.body;
      await db.insert(savedFacts).values({
        userId: req.user!.id,
        factId,
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to save fact" });
    }
  });

  app.delete("/api/facts/saved/:factId", ensureAuthenticated, async (req, res) => {
    try {
      await db.delete(savedFacts).where(
        and(
          eq(savedFacts.userId, req.user!.id),
          eq(savedFacts.factId, parseInt(req.params.factId))
        )
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove saved fact" });
    }
  });

  // Quiz routes
  app.get("/api/quiz/questions", async (req, res) => {
    try {
      const questions = await quizService.getRandomQuestions(5);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quiz questions" });
    }
  });

  // User preferences routes
  app.get("/api/preferences", ensureAuthenticated, async (req, res) => {
    try {
      const prefs = await db.query.userPreferences.findFirst({
        where: eq(userPreferences.userId, req.user!.id),
      });
      res.json(prefs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch preferences" });
    }
  });

  app.put("/api/preferences", ensureAuthenticated, async (req, res) => {
    try {
      const { dailyNotifications, soundEnabled } = req.body;
      await db
        .update(userPreferences)
        .set({ dailyNotifications, soundEnabled })
        .where(eq(userPreferences.userId, req.user!.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update preferences" });
    }
  });
}
