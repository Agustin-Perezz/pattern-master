import { KeyRound } from "lucide-react";
import type { Metadata } from "next";

import { Button } from "@/components/opencode/button";
import { Field, Input } from "@/components/opencode/input";

import { AuthShell } from "../problems/components/AuthShell";

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
          <a href="/signin" className="text-accent hover:text-accent-hover">
            Sign in
          </a>
        </>
      }
    >
      <form className="flex flex-col gap-[16px]">
        <Field label="Username" htmlFor="username">
          <Input
            id="username"
            type="text"
            placeholder="ada_lovelace"
            autoComplete="username"
          />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Field>
        <Field label="Password" htmlFor="password">
          <Input
            id="password"
            type="password"
            placeholder="8+ characters"
            autoComplete="new-password"
          />
        </Field>

        <label className="flex items-start gap-[8px] font-mono text-[14px] text-mute">
          <input
            type="checkbox"
            className="mt-[3px] size-[16px] accent-[var(--color-accent)]"
          />
          <span>
            I agree to the{" "}
            <a href="/terms" className="text-accent hover:text-accent-hover">
              Terms
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-accent hover:text-accent-hover">
              Privacy Policy
            </a>
            .
          </span>
        </label>

        <Button variant="primary" type="submit" className="w-full">
          Create account
        </Button>
      </form>

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
