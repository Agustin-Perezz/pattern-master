import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import {
  supabasePublishableKey,
  supabaseUrl,
} from "@/lib/shared/infrastructure/env";

// Trailing slash matches `/problems/<slug>` (detail, protected) but NOT
// `/problems` (listing, public). Keep the asymmetry intentional.
// `/api/evaluate` is the protected POST endpoint; middleware returns 401 for
// it instead of redirecting, so the prefix is listed separately.
const PROTECTED_PREFIXES = ["/problems/", "/api/evaluate"] as const;
const SIGNIN_PATH = "/signin";
const HOME_PATH = "/";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const { data: claims, error } = await supabase.auth.getClaims();

  const hasUser = !error && claims !== null;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix),
  );

  if (isProtected && !hasUser) {
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL(SIGNIN_PATH, request.url));
  }

  if (hasUser && request.nextUrl.pathname === SIGNIN_PATH) {
    return NextResponse.redirect(new URL(HOME_PATH, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)",
  ],
};
