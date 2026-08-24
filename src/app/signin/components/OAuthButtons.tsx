"use client";

import { GitHubIcon, GoogleIcon } from "@/components/icons/brand-icons";
import { OAuthProvider } from "@/domain/entities/oauth-provider.enum";
import { OAuthButton } from "./OAuthButton";

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
      {OAUTH_BUTTONS.map(({ provider, label, icon }) => (
        <OAuthButton
          key={provider}
          provider={provider}
          label={label}
          icon={icon}
        />
      ))}
    </div>
  );
}
