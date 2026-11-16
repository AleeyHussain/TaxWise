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
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-trust px-4 py-2.5 text-sm text-white shadow-xs">
          {message.text}
        </div>
      </div>
    );
  }

  if (message.role === "error") {
    return (
      <div className="flex justify-start animate-fade-in">
        <div className="max-w-[85%] rounded-2xl bg-danger/10 border border-danger/30 px-4 py-2.5 text-sm text-danger">
          {message.text}
        </div>
      </div>
    );
  }

  const { data } = message;
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="max-w-[90%] space-y-3 rounded-2xl rounded-bl-sm bg-elevated border border-subtle px-4 py-3 text-sm">
        <p className="text-primary leading-relaxed">{data.answer}</p>

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
          <ul className="list-disc space-y-1 pl-5 text-secondary">
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
