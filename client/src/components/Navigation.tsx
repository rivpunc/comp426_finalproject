import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AuthForms } from "./AuthForms";

export default function Navigation() {
  const [location] = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check authentication status on mount
    fetch("/api/auth/status")
      .then((res) => res.json())
      .then((data) => {
        setIsLoggedIn(data.isAuthenticated);
      })
      .catch((error) => {
        console.error("Failed to check auth status:", error);
      });
  }, []);

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <div className="flex gap-6 md:gap-10">
          <Link href="/">
            <span className="text-2xl font-bold text-primary">WhaleWatch</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/">
              <Button variant={location === "/" ? "default" : "ghost"}>
                Daily Fact
              </Button>
            </Link>
            <Link href="/quiz">
              <Button variant={location === "/quiz" ? "default" : "ghost"}>
                Quiz
              </Button>
            </Link>
            <Link href="/about">
              <Button variant={location === "/about" ? "default" : "ghost"}>
                About
              </Button>
            </Link>
            {isLoggedIn && (
              <Link href="/profile">
                <Button variant={location === "/profile" ? "default" : "ghost"}>
                  Profile
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="ml-auto">
          {!isLoggedIn ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button>Sign In</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Account Access</DialogTitle>
                <DialogDescription>
                  Sign in to your account or create a new one to save your favorite whale facts and track your quiz progress.
                </DialogDescription>
                <AuthForms onSuccess={() => setIsLoggedIn(true)} />
              </DialogContent>
            </Dialog>
          ) : (
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const response = await fetch("/api/auth/logout", {
                    method: "POST",
                  });
                  if (response.ok) {
                    setIsLoggedIn(false);
                  }
                } catch (error) {
                  console.error("Failed to sign out:", error);
                }
              }}
            >
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
