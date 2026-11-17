"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Send, X, ExternalLink, Bot } from "lucide-react";
import QuickChatMessages, { type ChatItem } from "./QuickChatMessages";
import type { AssistantResponse } from "@/types";

const QUICK_PROMPTS = [
  "Which plan is best for freelancers?",
  "Can I file for free with salary & donations?",
  "Do you support rental income?",
  "What is the difference between Deluxe & Premier?",
];

export default function QuickAssistantChat({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      role: "assistant",
      text: "Hi! I'm the TaxWise assistant. Tell me about your income sources or tax needs and I'll guide you to the right plan.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendQuestion = async (q: string) => {
    const text = q.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json();
      if (res.ok && data.response) {
        const r = data.response as AssistantResponse;
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: r.answer,
            recommendedProduct: r.recommendedProduct,
            reasons: r.reasons,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: data.error || "Sorry, I could not process that request." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Network error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.95 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-4 right-4 z-50 flex h-[580px] max-h-[85vh] w-[calc(100vw-32px)] max-w-[420px] flex-col overflow-hidden rounded-3xl border border-trust/30 bg-surface/85 shadow-2xl backdrop-blur-xl sm:bottom-6 sm:right-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-subtle bg-elevated/70 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-trust text-white shadow-xs">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-primary">TaxWise Bot</h3>
              <span className="flex h-2 w-2 rounded-full bg-success" />
            </div>
            <p className="text-[11px] text-secondary">AI Plan Recommender</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="/assistant"
            title="Open Fullscreen Assistant"
            className="rounded-lg p-1.5 text-secondary hover:bg-surface hover:text-primary transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-secondary hover:bg-surface hover:text-primary transition-colors"
            aria-label="Close Assistant"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <QuickChatMessages
        messages={messages}
        loading={loading}
        scrollRef={scrollRef}
      />

      {/* Quick Prompts */}
      <div className="border-t border-subtle/80 bg-elevated/40 p-2 overflow-x-auto">
        <div className="flex gap-1.5 whitespace-nowrap">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => sendQuestion(prompt)}
              className="rounded-lg border border-subtle bg-surface/90 px-2.5 py-1 text-[11px] font-medium text-secondary hover:border-trust hover:text-trust transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendQuestion(input);
        }}
        className="flex items-center gap-2 border-t border-subtle bg-surface p-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a tax question..."
          className="flex-1 rounded-xl border border-subtle bg-elevated/60 px-3.5 py-2 text-xs sm:text-sm text-primary placeholder:text-secondary focus:border-trust focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="btn btn-primary h-9 w-9 rounded-xl p-0 disabled:opacity-40"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </motion.div>
  );
}
