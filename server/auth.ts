import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { db } from "db";
import { eq } from "drizzle-orm";
import { users, type User } from "@db/schema";
import type { Request, Response, NextFunction } from "express";

// Extend Express.User with our User type
import type { User as DbUser } from "@db/schema";

declare global {
  namespace Express {
    interface User extends DbUser {}
  }
}

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!user) {
      return done(null, false);
    }

    if (user.password !== password) { // In production, use proper password hashing
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
}
