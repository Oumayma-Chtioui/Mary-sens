import { NextResponse, type NextRequest } from "next/server";

const GATE_COOKIE = "ms_gate";

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next({ request: { headers: request.headers } });
  const hasSessionCookie = Boolean(
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value
  );

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/admin/login");

  if (isAdminRoute && !isLoginRoute && !hasSessionCookie) {
    const redirectUrl = new URL("/admin/login", request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isLoginRoute && hasSessionCookie) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}