import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-[4px] font-mono text-[14px] leading-[2] px-[8px] py-[2px] rounded-sm",
  {
    variants: {
      variant: {
        news: "bg-surface-dark text-on-dark",
        neutral: "bg-surface-card text-ink",
        success: "bg-transparent text-success border border-success",
        warning: "bg-transparent text-warning border border-warning",
        danger: "bg-transparent text-danger border border-danger",
        accent: "bg-transparent text-accent border border-accent",
        label: "bg-transparent text-ink font-bold px-0 rounded-none",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
