// The standard guidance disclaimer, shown wherever the app makes a suggestion.
export default function Disclaimer({ text }: { text?: string }) {
  const message =
    text ??
    "This is general product guidance only and is not tax, legal, or financial advice. For your specific situation, please consult a qualified tax professional.";
  return (
    <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-200">
      {message}
    </p>
  );
}
