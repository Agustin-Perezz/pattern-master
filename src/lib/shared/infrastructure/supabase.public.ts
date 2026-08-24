import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/infrastructure/database/postgres/database.types";
import { supabasePublishableKey, supabaseUrl } from "./env";

/**
 * Cookie-less Supabase client for ISR-eligible data fetching.
 * Uses the publishable (anon) key — only works on tables with
 * anon-readable RLS policies (e.g. challenges).
 *
 * Unlike `createSupabaseServerClient`, this does NOT call `cookies()`,
 * so it does not opt the route into dynamic rendering.
 */
export function createSupabasePublicClient() {
  return createServerClient<Database>(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {},
    },
  });
}
