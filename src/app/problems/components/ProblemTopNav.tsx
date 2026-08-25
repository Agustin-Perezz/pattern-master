import Link from "next/link";

type ProblemTopNavProps = {
  children?: React.ReactNode;
};

export function ProblemTopNav({ children }: ProblemTopNavProps) {
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
      </div>
      {children}
    </header>
  );
}
