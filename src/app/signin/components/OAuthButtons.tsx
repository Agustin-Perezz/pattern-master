"use client";

import { LoaderCircle } from "lucide-react";
import { useTransition } from "react";

import { GitHubIcon, GoogleIcon } from "@/components/icons/brand-icons";
import { Button } from "@/components/ui/button";
import { OAuthProvider } from "@/domain/entities/oauth-provider.enum";
import { signInWithOAuthAction } from "../actions";

type OAuthButtonConfig = {
  provider: OAuthProvider;
  label: string;
  icon: () => React.ReactElement;
};

const OAUTH_BUTTONS: readonly OAuthButtonConfig[] = [
  {
    provider: OAuthProvider.Google,
    label: "Google",
    icon: () => <GoogleIcon className="size-5" />,
  },
  {
    provider: OAuthProvider.GitHub,
    label: "GitHub",
    icon: () => <GitHubIcon className="size-5" />,
  },
] as const;

export function OAuthButtons() {
  return (
    <div className="flex flex-col gap-[12px]">
      {OAUTH_BUTTONS.map(({ provider, label, icon: Icon }) => (
        <OAuthButton
          key={provider}
          provider={provider}
          label={label}
          Icon={Icon}
        />
      ))}
    </div>
  );
}

type OAuthButtonProps = {
  provider: OAuthProvider;
  label: string;
  Icon: () => React.ReactElement;
};

function OAuthButton({ provider, label, Icon }: OAuthButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full"
      disabled={isPending}
      onClick={() => startTransition(() => signInWithOAuthAction(provider))}
    >
      {isPending ? <LoaderCircle className="animate-spin" /> : <Icon />}
      Continue with {label}
    </Button>
  );
}
