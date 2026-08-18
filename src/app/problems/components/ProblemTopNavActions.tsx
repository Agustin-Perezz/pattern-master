import { ChevronDown, Flame } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/opencode/badge";

export function ProblemTopNavActions() {
  return (
    <div className="flex items-center gap-[12px]">
      <Badge variant="warning" className="gap-[6px]">
        <Flame className="size-[14px]" aria-hidden />
        <span className="tabular-nums">3 days</span>
      </Badge>

      <button
        type="button"
        className="hidden items-center gap-[6px] rounded-sm border border-hairline-strong bg-surface-card px-[12px] py-[6px] font-mono text-[14px] text-ink hover:bg-surface-dark-elevated sm:flex"
      >
        TypeScript
        <ChevronDown className="size-[14px] text-mute" aria-hidden />
      </button>

      <Link
        href="/signin"
        className="hidden font-mono text-[14px] text-mute hover:text-ink sm:inline"
      >
        Sign in
      </Link>

      <div
        role="img"
        aria-label="User avatar"
        className="flex size-[32px] items-center justify-center rounded-full border border-hairline-strong bg-surface-card font-mono text-[14px] font-bold text-ink"
      >
        DP
      </div>
    </div>
  );
}
