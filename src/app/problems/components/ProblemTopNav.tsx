import Link from "next/link";

import { ProblemTopNavActions } from "./ProblemTopNavActions";

type ProblemTopNavProps = {
  subtitle?: string;
};

export function ProblemTopNav({ subtitle }: ProblemTopNavProps) {
  return (
    <header className="flex h-[56px] shrink-0 items-center justify-between border-b border-hairline bg-canvas px-[16px] md:px-[24px]">
      <div className="flex min-w-0 items-center gap-[16px]">
        <Link
          href="/"
          className="flex items-center gap-[8px] font-mono text-[16px] font-bold text-ink"
        >
          <span className="text-mute">[</span>
          PatternMaster
          <span className="text-mute">]</span>
        </Link>
        {subtitle ? (
          <>
            <span aria-hidden className="hidden text-hairline-strong sm:inline">
              |
            </span>
            <span className="hidden truncate font-mono text-[14px] text-mute sm:inline">
              Challenge: {subtitle}
            </span>
          </>
        ) : null}
      </div>
      <ProblemTopNavActions />
    </header>
  );
}
