import Link from "next/link";
import type * as React from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-[16px] py-[48px]">
      <div className="flex w-full max-w-[420px] flex-col gap-[24px]">
        <Link
          href="/"
          className="flex items-center justify-center gap-[8px] font-mono text-[18px] font-bold text-ink"
        >
          <span className="text-mute">[</span>
          PatternMaster
          <span className="text-mute">]</span>
        </Link>

        <div className="rounded-sm border border-hairline bg-surface-soft p-[24px] md:p-[32px]">
          <div className="mb-[24px] flex flex-col gap-[4px]">
            <h1 className="font-mono text-[22px] font-bold leading-[1.3] text-ink">
              {title}
            </h1>
            <p className="font-mono text-[14px] text-mute">{subtitle}</p>
          </div>
          {children}
        </div>

        <p className="text-center font-mono text-[14px] text-mute">{footer}</p>
      </div>
    </main>
  );
}
