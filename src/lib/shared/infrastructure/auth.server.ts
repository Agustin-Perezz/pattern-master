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

export async function requireUser(): Promise<User> {
  const user = await getUser();

  if (!user) {
    redirect(SIGNIN_PATH);
  }

  return user;
}
