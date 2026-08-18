"use client";

import { Mail } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithMagicLinkAction } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? (
        "Sending..."
      ) : (
        <>
          <Mail />
          Send Magic Link
        </>
      )}
    </Button>
  );
}

export function MagicLinkForm() {
  const [state, formAction] = useActionState(signInWithMagicLinkAction, {});

  return (
    <form action={formAction} className="flex flex-col gap-[16px]">
      {state.success && (
        <p className="rounded-sm border border-success bg-transparent p-[12px] font-mono text-[14px] text-success">
          {state.success}
        </p>
      )}
      {state.error && (
        <p className="rounded-sm border border-danger bg-transparent p-[12px] font-mono text-[14px] text-danger">
          {state.error}
        </p>
      )}
      <div className="flex flex-col gap-[8px]">
        <Label htmlFor="email" className="font-mono text-[14px] text-mute">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>
      <SubmitButton />
    </form>
  );
}
