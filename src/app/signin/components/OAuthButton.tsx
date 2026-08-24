"use client";

import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { OAuthProvider } from "@/domain/entities/oauth-provider.enum";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { signInWithOAuthAction } from "../actions";

type OAuthButtonProps = {
  provider: OAuthProvider;
  label: string;
  icon: () => React.ReactElement;
};

export function OAuthButton({ provider, label, icon: Icon }: OAuthButtonProps) {
  const { isPending, run } = useAsyncAction(signInWithOAuthAction);

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full"
      disabled={isPending}
      onClick={() => run(provider)}
    >
      {isPending ? <LoaderCircle className="animate-spin" /> : <Icon />}
      Continue with {label}
    </Button>
  );
}
