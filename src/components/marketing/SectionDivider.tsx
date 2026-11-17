import * as React from "react";

export default function SectionDivider({ className }: { className?: string }) {
  return (
    <div
      className={`container-px my-8 sm:my-12 flex items-center justify-center gap-4 text-accent-ai select-none ${className || ""}`}
      aria-hidden="true"
    >
      <div className="h-[1px] flex-1 max-w-[200px] bg-gradient-to-r from-transparent to-border-subtle" />
      <span className="text-xs opacity-75 font-bold">◆</span>
      <div className="h-[1px] flex-1 max-w-[200px] bg-gradient-to-l from-transparent to-border-subtle" />
    </div>
  );
}
