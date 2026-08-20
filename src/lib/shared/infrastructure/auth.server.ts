import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/shared/infrastructure/supabase.server";

export type User = {
  id: string;
  email: string;
  name?: string;
};

export const SIGNIN_PATH = "/signin";
export const HOME_PATH = "/";
export const AUTH_CALLBACK_PATH = "/auth/callback";

// Local JWT verification (no network). Used by read-only page protection
// via requireUser(). Fast, but cannot detect revoked/deleted users until
// the access token's exp passes.
export async function getUser(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data) {
    return null;
  }

  const claims = data.claims;
  const userMetadata = claims.user_metadata as
    | { full_name?: string; name?: string }
    | undefined;

  return {
    id: claims.sub,
    email: claims.email ?? "",
    name: userMetadata?.full_name ?? userMetadata?.name,
  };
}

// Server-side verification (network call to Auth). Used by write paths
// that persist user.id (e.g. /api/evaluate). Catches revoked/deleted
// users at auth time so writes fail with 401, not a FK 500.
export async function getUserVerified(): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email ?? "",
    name: user.user_metadata?.full_name ?? user.user_metadata?.name,
  };
}

export async function requireUser(): Promise<User> {
  const user = await getUser();

  if (!user) {
    redirect(SIGNIN_PATH);
  }

  return user;
}

export function getUserInitials(user: {
  name?: string;
  email: string;
}): string {
  if (user.name) {
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return user.name.slice(0, 2).toUpperCase();
  }
  return user.email.slice(0, 2).toUpperCase();
}
