import ConfidenceBadge from "@/components/marketing/ConfidenceBadge";
import Disclaimer from "@/components/marketing/Disclaimer";
import type { AssistantResponse } from "@/types";

export type ChatMessageItem =
  | { role: "user"; text: string }
  | { role: "assistant"; data: AssistantResponse }
  | { role: "error"; text: string };

export function ChatMessage({ message }: { message: ChatMessageItem }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-brand-600 px-4 py-2.5 text-sm text-white">
          {message.text}
        </div>
      </div>
    );
  }

  if (message.role === "error") {
    return (
      <div className="flex justify-start animate-fade-in">
        <div className="max-w-[85%] rounded-2xl bg-red-50 px-4 py-2.5 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
          {message.text}
        </div>
      </div>
    );
  }

  const { data } = message;
  return (
    <div className="flex justify-start animate-fade-in">
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
