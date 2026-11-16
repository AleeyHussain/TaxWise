"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChatMessage, type ChatMessageItem } from "./ChatMessage";

export const EXAMPLES = [
  "I have salary income and donations. Which product should I use?",
  "I am a freelancer with home-office expenses. Can I use Free?",
  "I own an incorporated company with no revenue. What should I choose?",
  "I have investment income and rental income. Which product fits me?",
  "What is the difference between Premier and Self-Employed?",
  "I want someone else to file for me. What should I select?",
];

export function MessageList({
  messages,
  loading,
  onSelectExample,
  listEndRef,
}: {
  messages: ChatMessageItem[];
  loading: boolean;
  onSelectExample: (q: string) => void;
  listEndRef: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="card min-h-[340px] space-y-4 p-5 sm:p-6 border-subtle">
      {messages.length === 0 ? (
        <div className="py-8 text-center text-sm text-secondary">
          <p className="font-semibold text-primary">
            No questions yet. Try one of these examples:
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {EXAMPLES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onSelectExample(q)}
                className="badge badge-slate hover:bg-elevated hover:text-primary transition-colors cursor-pointer text-left py-1.5 px-3 border border-subtle"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      ) : (
        messages.map((msg, i) => <ChatMessage key={i} message={msg} />)
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-secondary" role="status">
          <div className="flex items-center gap-1.5 py-1 px-2">
            {[0, 0.2, 0.4].map((delay, idx) => (
              <motion.span
                key={idx}
                animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.4, repeat: Infinity, delay, ease: "easeInOut" }}
                className="inline-block h-2 w-2 rounded-full bg-ai"
              />
            ))}
          </div>
          <span className="sr-only">The assistant is thinking...</span>
          <span className="text-xs font-medium">Assistant is thinking...</span>
        </div>
      )}
      <div ref={listEndRef} />
    </div>
  );
}
