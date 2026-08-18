import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-[8px] font-mono font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:bg-surface-card disabled:text-ash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-on-primary rounded-sm hover:bg-accent-hover active:bg-accent-active",
        secondary:
          "bg-surface-card text-ink rounded-sm border border-hairline-strong hover:bg-surface-dark-elevated",
        tab: "bg-transparent text-mute rounded-none hover:text-ink border-b-2 border-transparent",
        "tab-active":
          "bg-transparent text-ink rounded-none border-b-2 border-ink",
        ghost: "bg-transparent text-ink rounded-sm hover:bg-surface-card",
      },
      size: {
        md: "h-[36px] px-[20px] py-[4px] text-[16px] leading-[2]",
        tab: "px-[16px] py-[8px] text-[16px] leading-[2]",
        icon: "h-[36px] w-[36px] rounded-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
