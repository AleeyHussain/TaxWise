import * as React from "react";

export function ChatInput({
  input,
  onChange,
  onSubmit,
  loading,
}: {
  input: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="mt-4 flex gap-2">
      <label htmlFor="question" className="sr-only">
        Your question
      </label>
      <input
        id="question"
        value={input}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ask a product question..."
        className="input"
        autoComplete="off"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !input.trim()}
        className="btn btn-primary shrink-0"
      >
        Send
      </button>
    </form>
  );
}
