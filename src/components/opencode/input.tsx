import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-[40px] w-full rounded-sm border border-hairline-strong bg-surface-soft px-[12px] font-mono text-[16px] text-ink",
      "placeholder:text-mute",
      "focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent",
      "disabled:cursor-not-allowed disabled:bg-surface-card disabled:text-ash",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

type FieldProps = {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
};

export function Field({ label, htmlFor, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-[8px]">
      <label htmlFor={htmlFor} className="font-mono text-[14px] text-mute">
        {label}
      </label>
      {children}
    </div>
  );
}
