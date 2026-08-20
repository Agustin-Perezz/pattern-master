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

  // When the refresh token is invalid/expired (e.g. signed out elsewhere),
  // getClaims returns an error. Clear the stale auth cookies so the browser
  // stops retrying with the dead token — otherwise every request logs
  // "Invalid Refresh Token: Refresh Token Not Found" and the user is stuck
  // seeing stale auth state instead of being treated as logged out.
  if (error) {
    const authCookies = request.cookies
      .getAll()
      .filter(
        (cookie) =>
          cookie.name.startsWith("sb-") && cookie.name.endsWith("-auth-token"),
      );
    for (const cookie of authCookies) {
      response.cookies.delete(cookie.name);
    }
  }

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

  // After OAuth callback exchanges the code, the provider may redirect to
  // "/" with the code still in the query string. Strip it so the user does
  // not see ?code=... in the URL bar on the home page.
  if (
    request.nextUrl.pathname === HOME_PATH &&
    request.nextUrl.searchParams.has("code")
  ) {
    const cleanUrl = new URL(HOME_PATH, request.url);
    return NextResponse.redirect(cleanUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|css|js)$).*)",
  ],
};
