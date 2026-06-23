"use client";

import { useRef, useState } from "react";
import ConfidenceBadge from "@/components/ConfidenceBadge";
import Disclaimer from "@/components/Disclaimer";
import { SparkleIcon } from "@/components/icons";
import type { AssistantResponse } from "@/lib/types";

type ChatMessage =
  | { role: "user"; text: string }
  | { role: "assistant"; data: AssistantResponse }
  | { role: "error"; text: string };

const EXAMPLES = [
  "I have salary income and donations. Which product should I use?",
  "I am a freelancer with home-office expenses. Can I use Free?",
  "I own an incorporated company with no revenue. What should I choose?",
  "I have investment income and rental income. Which product fits me?",
  "What is the difference between Premier and Self-Employed?",
  "I want someone else to file for me. What should I select?",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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
      // Scroll the newest message into view.
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
          <h1 className="flex items-center gap-2 text-3xl font-bold text-slate-900 dark:text-white">
            <SparkleIcon className="h-7 w-7 text-brand-600 dark:text-brand-400" />
            Product assistant
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Ask about your situation in plain language. The assistant answers from
            the same product data and rules the rest of the site uses. It will not
            give tax, legal or financial advice.
          </p>
        </header>

        {/* Conversation */}
        <div className="card min-h-[280px] space-y-4 p-5">
          {messages.length === 0 ? (
            <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              <p>No questions yet. Try one of these to get started:</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {EXAMPLES.map((q) => (
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
            </div>
          ) : (
            messages.map((msg, i) => <MessageBubble key={i} message={msg} />)
          )}

          {loading && (
            <div className="text-sm text-slate-400">The assistant is thinking...</div>
          )}
          <div ref={listEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={onSubmit} className="mt-4 flex gap-2">
          <label htmlFor="question" className="sr-only">
            Your question
          </label>
          <input
            id="question"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a product question..."
            className="input"
            autoComplete="off"
          />
          <button type="submit" disabled={loading || !input.trim()} className="btn btn-primary shrink-0">
            Send
          </button>
        </form>

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

function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-brand-600 px-4 py-2.5 text-sm text-white">
          {message.text}
        </div>
      </div>
    );
  }

  if (message.role === "error") {
    return (
      <div className="flex justify-start">
        <div className="max-w-[85%] rounded-2xl bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
          {message.text}
        </div>
      </div>
    );
  }

  const { data } = message;
  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] space-y-3 rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3 text-sm dark:bg-slate-800">
        <p className="text-slate-800 dark:text-slate-100">{data.answer}</p>

        <div className="flex flex-wrap items-center gap-2">
          {data.recommendedProduct && (
            <span className="badge badge-brand">Suggested: {data.recommendedProduct}</span>
          )}
          <ConfidenceBadge confidence={data.confidence} />
          <span className="badge badge-slate" title="Which backend answered">
            {data.source === "ai" ? "AI" : "rules-based"}
          </span>
        </div>

        {data.reasons.length > 0 && (
          <ul className="list-disc space-y-1 pl-5 text-slate-600 dark:text-slate-300">
            {data.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        )}

        <Disclaimer text={data.disclaimer} />
      </div>
    </div>
  );
}
