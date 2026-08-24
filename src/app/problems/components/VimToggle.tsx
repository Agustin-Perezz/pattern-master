"use client";

import { Keyboard } from "lucide-react";

import { cn } from "@/lib/utils";

type VimToggleProps = {
  enabled: boolean;
  onToggle: () => void;
};

export function VimToggle({ enabled, onToggle }: VimToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label="Toggle Vim mode"
      className={cn(
        "ml-auto flex items-center gap-[6px] rounded-sm border px-[8px] py-[4px] font-mono text-[13px] transition-colors",
        enabled
          ? "border-accent bg-accent/15 text-accent"
          : "border-hairline text-mute hover:text-ink hover:bg-surface-dark-elevated",
      )}
    >
      <Keyboard className="size-[14px]" aria-hidden />
      Vim
    </button>
  );
}
