import type * as React from "react";

import { cn } from "@/lib/utils";

type CardTone = "canvas" | "soft" | "card" | "dark";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  tone?: CardTone;
};

const toneClasses: Record<CardTone, string> = {
  canvas: "bg-canvas text-ink border-hairline",
  soft: "bg-surface-soft text-ink border-hairline",
  card: "bg-surface-card text-ink border-hairline",
  dark: "bg-surface-dark text-on-dark border-transparent",
};

export function Card({ className, tone = "canvas", ...props }: CardProps) {
  return (
    <div
      className={cn("rounded-sm border p-[16px]", toneClasses[tone], className)}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mb-[12px] flex flex-col gap-[4px]", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("font-mono text-[16px] font-bold leading-[1.5]", className)}
      {...props}
    />
  );
}

export function CardBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("font-mono text-[16px] leading-[1.5]", className)}
      {...props}
    />
  );
}
