import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-[rgb(var(--line))] bg-[rgb(var(--surface))] px-4 py-2 text-sm text-foreground shadow-inner outline-none transition-colors",
        "placeholder:text-muted-foreground/70",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "focus-visible:border-[rgb(var(--line-strong))] focus-visible:bg-[rgb(var(--surface2))] focus-visible:ring-2 focus-visible:ring-[rgb(var(--ink))]/25",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[120px] w-full rounded-xl border border-[rgb(var(--line))] bg-[rgb(var(--surface))] px-4 py-3 text-sm text-foreground shadow-inner outline-none transition-colors",
        "placeholder:text-muted-foreground/70 resize-y",
        "focus-visible:border-[rgb(var(--line-strong))] focus-visible:bg-[rgb(var(--surface2))] focus-visible:ring-2 focus-visible:ring-[rgb(var(--ink))]/25",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = "Textarea";

const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "flex h-11 w-full appearance-none rounded-xl border border-[rgb(var(--line))] bg-[rgb(var(--surface))] px-4 py-2 text-sm text-foreground outline-none transition-colors",
        "focus-visible:border-[rgb(var(--line-strong))] focus-visible:ring-2 focus-visible:ring-[rgb(var(--ink))]/25",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "[&>option]:bg-[rgb(var(--surface2))] [&>option]:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);
Select.displayName = "Select";

export { Input, Textarea, Select };