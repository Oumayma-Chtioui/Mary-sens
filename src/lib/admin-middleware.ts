import { NextResponse, type NextRequest } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const GATE_COOKIE = "ms_gate";
const SESSION_COOKIES = ["better-auth.session_token", "__Secure-better-auth.session_token"];

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const { env } = getCloudflareContext();
  const gatePath = env.ADMIN_GATE_PATH;
  const gateSecret = env.ADMIN_GATE_SECRET;

  // Visiting the secret path sets the gate cookie and forwards to login.
  if (gatePath && pathname === gatePath) {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.set(GATE_COOKIE, gateSecret ?? "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 180, // 180 days
    });
    return response;
  }

  const isAdminRoute = pathname.startsWith("/admin");

  // No gate cookie (or wrong value) -> /admin doesn't appear to exist.
  if (isAdminRoute && gateSecret) {
    const hasGateCookie = request.cookies.get(GATE_COOKIE)?.value === gateSecret;
    if (!hasGateCookie) {
      return new NextResponse("Not Found", { status: 404 });
    }
  }

  const response = NextResponse.next({ request: { headers: request.headers } });
  const hasSessionCookie = SESSION_COOKIES.some((name) => request.cookies.get(name)?.value);
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