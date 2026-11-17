"use client";

import { RefObject } from "react";
import { Sparkles, User, CheckCircle2 } from "lucide-react";

export interface ChatItem {
  role: "user" | "assistant";
  text: string;
  recommendedProduct?: string | null;
  reasons?: string[];
}

export default function QuickChatMessages({
  messages,
  loading,
  scrollRef,
}: {
  messages: ChatItem[];
  loading: boolean;
  scrollRef: RefObject<HTMLDivElement>;
}) {
  return (
    <div ref={scrollRef} className="flex-1 space-y-3.5 overflow-y-auto p-4 text-xs sm:text-sm">
      {messages.map((m, idx) => (
        <div
          key={idx}
          className={`flex items-start gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
        >
          {m.role === "assistant" && (
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-trust/10 text-trust">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
          )}
          <div
            className={`max-w-[82%] rounded-2xl p-3 leading-relaxed ${
              m.role === "user"
                ? "bg-trust text-white shadow-xs font-medium"
                : "border border-subtle bg-surface/90 text-primary shadow-xs"
            }`}
          >
            <p className="whitespace-pre-wrap">{m.text}</p>
            {m.recommendedProduct && (
              <div className="mt-2.5 rounded-xl border border-trust/30 bg-elevated/80 p-2.5 text-primary">
                <p className="font-bold text-trust">Recommended: {m.recommendedProduct}</p>
                {m.reasons && m.reasons.length > 0 && (
                  <ul className="mt-1 space-y-1 text-[11px] text-secondary">
                    {m.reasons.map((r, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-success" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          {m.role === "user" && (
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-elevated text-secondary">
              <User className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
      ))}

      {loading && (
        <div className="flex items-center gap-2 text-xs text-secondary pl-8">
          <span className="inline-block h-2 w-2 rounded-full bg-ai animate-ping" />
          <span>Analyzing tax rules...</span>
        </div>
      )}
    </div>
  );
}
