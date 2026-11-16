"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { SparkleIcon } from "@/components/icons";

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
      <div className="card w-full max-w-md p-8 shadow-md animate-fade-in">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-slate-700">
            <SparkleIcon className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
            Admin Sign In
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Enter your credentials to access the TaxWise administration panel.
          </p>
        </div>

        {error && (
          <div
            className="mt-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
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
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
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

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            &larr; Return to public site
          </Link>
        </div>
      </div>
    </div>
  );
}
