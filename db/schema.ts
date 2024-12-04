import { pgTable, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const whaleFacts = pgTable("whale_facts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  fact: text("fact").notNull(),
  imageUrl: text("image_url").notNull(),
  source: text("source"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const savedFacts = pgTable("saved_facts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id).notNull(),
  factId: integer("fact_id").references(() => whaleFacts.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  question: text("question").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  wrongAnswer1: text("wrong_answer1").notNull(),
  wrongAnswer2: text("wrong_answer2").notNull(),
  wrongAnswer3: text("wrong_answer3").notNull(),
});

export const userPreferences = pgTable("user_preferences", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id).notNull(),
  dailyNotifications: boolean("daily_notifications").default(true),
  soundEnabled: boolean("sound_enabled").default(true),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;

export const insertWhaleFactSchema = createInsertSchema(whaleFacts);
export const selectWhaleFactSchema = createSelectSchema(whaleFacts);
export type WhaleFact = z.infer<typeof selectWhaleFactSchema>;

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions);
export const selectQuizQuestionSchema = createSelectSchema(quizQuestions);
export type QuizQuestion = z.infer<typeof selectQuizQuestionSchema>;
