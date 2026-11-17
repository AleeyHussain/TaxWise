"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/branding/Logo";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429) {
          setError("Too many login attempts. Please try again in 15 minutes.");
        } else {
          setError(data.error || "Invalid username or password.");
        }
        return;
      }

      router.push(from);
      router.refresh();
    } catch {
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-px flex min-h-[75vh] flex-col items-center justify-center py-12">
      <div className="glass-2 w-full max-w-md p-8 shadow-md rounded-2xl animate-fade-in">
        <div className="text-center flex flex-col items-center">
          <Logo size={64} variant="full" />
          <h1 className="mt-4 text-2xl font-bold text-primary">
            Admin Sign In
          </h1>
          <p className="mt-1 text-sm text-secondary">
            Enter your credentials to access the TaxWise administration panel.
          </p>
        </div>

        {error && (
          <div
            className="mt-6 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-primary"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input mt-1"
              placeholder="admin"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-primary"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-secondary hover:text-primary transition-colors"
          >
            &larr; Return to public site
          </Link>
        </div>
      </div>
    </div>
  );
}
