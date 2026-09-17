import { createAdminClient } from "@/lib/supabase/server";

/**
 * Supabase-backed rate limiter. Deliberately not in-memory: on Vercel each
 * serverless instance has its own memory, so an in-memory counter would reset
 * constantly and be trivially bypassed. This shares state across instances.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; retryAfter: number }> {
  try {
    const supabase = createAdminClient();
    const since = new Date(Date.now() - windowSeconds * 1000).toISOString();

    const { count, error } = await supabase
      .from("rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("key", key)
      .gte("created_at", since);

    if (error) {
      console.error("[rateLimit] lookup failed, allowing request:", error);
      return { allowed: true, retryAfter: 0 };
    }

    if ((count ?? 0) >= limit) {
      return { allowed: false, retryAfter: windowSeconds };
    }

    await supabase.from("rate_limits").insert({ key });

    // Opportunistic cleanup (~2% of calls) so the table doesn't grow forever.
    if (Math.random() < 0.02) {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      await supabase.from("rate_limits").delete().lt("created_at", cutoff);
    }

    return { allowed: true, retryAfter: 0 };
  } catch (err) {
    // Never let the limiter itself take down a legitimate request.
    console.error("[rateLimit] unexpected failure, allowing request:", err);
    return { allowed: true, retryAfter: 0 };
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}