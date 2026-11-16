import * as React from "react";
import { cn } from "@/lib/cn";

export interface FieldsetProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  legend?: string;
  description?: string;
}

export function Fieldset({ legend, description, className, children, ...props }: FieldsetProps) {
  return (
    <fieldset className={cn("space-y-4", className)} {...props}>
      {legend && (
        <legend className="text-lg font-semibold text-slate-900 dark:text-white">
          {legend}
        </legend>
      )}
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      )}
      {children}
    </fieldset>
  );
}
