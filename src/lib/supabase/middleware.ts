import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const GATE_COOKIE = "ms_gate";

export async function updateSession(request: NextRequest) {
  const gatePath = process.env.ADMIN_GATE_PATH;
  const gateSecret = process.env.ADMIN_GATE_SECRET;
  const pathname = request.nextUrl.pathname;

  // Visiting the secret gate path sets the cookie, then sends you to login.
  if (gatePath && gateSecret && pathname === gatePath) {
    const res = NextResponse.redirect(new URL("/admin/login", request.url));
    res.cookies.set({
      name: GATE_COOKIE,
      value: gateSecret,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 90,
    });
    return res;
  }

  // Without the gate cookie, /admin/* behaves as if it doesn't exist.
  // NOTE: this is obscurity, not authentication — the real protection is the
  // Supabase auth check below plus RLS. It only reduces drive-by discovery.
  if (gatePath && gateSecret && pathname.startsWith("/admin")) {
    if (request.cookies.get(GATE_COOKIE)?.value !== gateSecret) {
      return new NextResponse(null, { status: 404 });
    }
  }

  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return response;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: any) {
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/admin/login");

  if (isAdminRoute && !isLoginRoute && !user) {
    const redirectUrl = new URL("/admin/login", request.url);
    redirectUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (isLoginRoute && user) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}