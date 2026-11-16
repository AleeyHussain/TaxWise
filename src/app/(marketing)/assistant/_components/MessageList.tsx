import * as React from "react";
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
    <div className="card min-h-[300px] space-y-4 p-5">
      {messages.length === 0 ? (
        <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
          <p className="font-medium">No questions yet. Try one of these to get started:</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {EXAMPLES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onSelectExample(q)}
                className="badge badge-slate hover:bg-slate-200 dark:hover:bg-slate-700 transition"
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
        <div className="flex items-center gap-2 text-sm text-slate-400" role="status">
          <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-cyan-600" />
          <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-cyan-600 [animation-delay:0.2s]" />
          <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-cyan-600 [animation-delay:0.4s]" />
          <span className="sr-only">The assistant is thinking...</span>
          <span>The assistant is thinking...</span>
        </div>
      )}
      <div ref={listEndRef} />
    </div>
  );
}
