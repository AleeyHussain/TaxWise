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
      className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all duration-180 min-h-[44px] ${
        selected
          ? "border-trust bg-trust/10 shadow-xs"
          : "border-subtle bg-surface hover:border-trust/40 hover:bg-elevated"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 transition-colors ${
          multi ? "rounded-md" : "rounded-full"
        } ${
          selected
            ? "border-trust bg-trust text-white"
            : "border-subtle bg-base"
        }`}
      >
        {selected && <span className="text-[11px] leading-none">&#10003;</span>}
      </span>
      <span>
        <span className="block font-medium text-primary">{label}</span>
        {hint && (
          <span className="mt-0.5 block text-sm text-secondary">
            {hint}
          </span>
        )}
      </span>
    </button>
  );
}
