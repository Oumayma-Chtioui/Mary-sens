import { and, count, eq, gte, lt } from "drizzle-orm";
import { rateLimits } from "@/db/schema";
import { getDb } from "@/lib/db";

/**
 * D1-backed rate limiter. Deliberately not in-memory: on Workers each
 * serverless instance has its own memory, so an in-memory counter would reset
 * constantly and be trivially bypassed. This shares state across instances.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; retryAfter: number }> {
  try {
    const db = getDb();
    const since = new Date(Date.now() - windowSeconds * 1000).toISOString();

    const [{ c }] = await db
      .select({ c: count() })
      .from(rateLimits)
      .where(and(eq(rateLimits.key, key), gte(rateLimits.created_at, since)));

    if (Number(c ?? 0) >= limit) {
      return { allowed: false, retryAfter: windowSeconds };
    }

    await db.insert(rateLimits).values({ key });

    // Opportunistic cleanup (~2% of calls) so the table doesn't grow forever.
    if (Math.random() < 0.02) {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      await db.delete(rateLimits).where(lt(rateLimits.created_at, cutoff));
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