import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Broad matcher so the secret gate path is caught too. Static assets excluded.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
};