import type { Metadata } from "next";
import Link from "next/link";

import { MagicLinkForm } from "./components/MagicLinkForm";
import { OAuthButtons } from "./components/OAuthButtons";

export const metadata: Metadata = {
  title: "Sign in — PatternMaster",
  description: "Sign in to continue practicing software design patterns.",
};

export default function SignInPage() {
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
          <div className="mb-[24px] flex flex-col gap-[4px] text-center">
            <h1 className="font-mono text-[22px] font-bold leading-[1.3] text-ink">
              Sign in or sign up
            </h1>
            <p className="font-mono text-[14px] text-mute">
              {"// magic link or OAuth to continue"}
            </p>
          </div>

          <div className="flex flex-col gap-[24px]">
            <MagicLinkForm />

            <div className="flex items-center gap-[12px]">
              <span className="h-px flex-1 bg-hairline" />
              <span className="font-mono text-[12px] text-mute">OR</span>
              <span className="h-px flex-1 bg-hairline" />
            </div>

            <OAuthButtons />
          </div>
        </div>
      </div>
    </main>
  );
}
