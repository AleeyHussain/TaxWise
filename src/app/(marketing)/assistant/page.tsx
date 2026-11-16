"use client";

import { useRef, useState } from "react";
import { SparkleIcon } from "@/components/icons";
import { ChatInput } from "./_components/ChatInput";
import { MessageList, EXAMPLES } from "./_components/MessageList";
import type { ChatMessageItem } from "./_components/ChatMessage";

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listEndRef = useRef<HTMLDivElement>(null);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "error", text: data?.error ?? "Something went wrong." },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", data: data.response }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "error", text: "Could not reach the assistant. Please try again." },
      ]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() =>
        listEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      );
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    void ask(input);
  }

  return (
    <div className="container-px py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6">
          <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
            <SparkleIcon className="h-7 w-7 text-brand-600 dark:text-brand-400" />
            Product assistant
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Ask about your situation in plain language. The assistant answers from
            the same product data and rules the rest of the site uses. It will not
            give tax, legal or financial advice.
          </p>
        </header>

        <MessageList
          messages={messages}
          loading={loading}
          onSelectExample={ask}
          listEndRef={listEndRef}
        />

        <ChatInput
          input={input}
          onChange={setInput}
          onSubmit={onSubmit}
          loading={loading}
        />

        {messages.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {EXAMPLES.slice(0, 3).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => ask(q)}
                className="badge badge-slate hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
