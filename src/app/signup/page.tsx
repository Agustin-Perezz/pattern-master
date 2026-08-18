import { KeyRound } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/opencode/button";

import { AuthShell } from "../problems/components/AuthShell";
import { SignUpForm } from "./components/SignUpForm";

export const metadata: Metadata = {
  title: "Sign up — PatternMaster",
  description:
    "Create an account to start practicing software design patterns.",
};

export default function SignUpPage() {
  return (
    <AuthShell
      title="Create account"
      subtitle="// start your first challenge in seconds"
      footer={
        <>
          {"Already have an account? "}
          <Link href="/signin" className="text-accent hover:text-accent-hover">
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm />

      <div className="my-[20px] flex items-center gap-[12px]">
        <span className="h-px flex-1 bg-hairline" />
        <span className="font-mono text-[12px] text-mute">OR</span>
        <span className="h-px flex-1 bg-hairline" />
      </div>

      <Button variant="secondary" type="button" className="w-full">
        <KeyRound className="size-[16px]" aria-hidden />
        Sign up with SSO
      </Button>
    </AuthShell>
  );
}
