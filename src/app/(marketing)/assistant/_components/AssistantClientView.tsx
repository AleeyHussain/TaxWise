"use client";

import { useRef, useState } from "react";
import { LogoMark } from "@/components/branding/Logo";
import { ChatInput } from "./ChatInput";
import { MessageList, EXAMPLES } from "./MessageList";
import type { ChatMessageItem } from "./ChatMessage";

export default function AssistantClientView() {
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
    <div className="container-px py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6">
          <span className="badge badge-ai mb-2 py-1 px-3 flex items-center gap-1.5 w-fit">
            <LogoMark size={16} variant="icon-only" />
            AI Grounded Assistant
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
            Product Assistant
          </h1>
          <p className="mt-2 text-secondary leading-relaxed">
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
                className="badge badge-slate hover:bg-elevated hover:text-primary transition-colors cursor-pointer border border-subtle"
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
