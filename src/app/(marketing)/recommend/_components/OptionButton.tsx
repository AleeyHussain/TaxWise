export function OptionButton({
  selected,
  label,
  hint,
  onClick,
  multi,
}: {
  selected: boolean;
  label: string;
  hint?: string;
  onClick: () => void;
  multi?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition ${
        selected
          ? "border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-900/20"
          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 ${
          multi ? "rounded-md" : "rounded-full"
        } ${
          selected
            ? "border-brand-600 bg-brand-600 text-white"
            : "border-slate-300 dark:border-slate-600"
        }`}
      >
        {selected && <span className="text-[11px] leading-none">&#10003;</span>}
      </span>
      <span>
        <span className="block font-medium text-slate-900 dark:text-white">{label}</span>
        {hint && (
          <span className="mt-0.5 block text-sm text-slate-500 dark:text-slate-400">
            {hint}
          </span>
        )}
      </span>
    </button>
  );
}
