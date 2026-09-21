import { getCloudflareContext } from "@opennextjs/cloudflare";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { createAuth } from "@/auth";
import { adminUsers } from "@/db/schema";
import { getDb } from "@/lib/db";

export async function getAdminUser() {
  const { env } = getCloudflareContext();
  const session = await createAuth(env as Env).api.getSession({ headers: await headers() });
  if (!session) return null;

  const [admin] = await getDb()
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.id, session.user.id))
    .limit(1);

  return admin ? session.user : null;
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requireAdminApi() {
  const user = await getAdminUser();
  if (!user) return Response.json({ error: "Non autorisé." }, { status: 401 });
  return user;
}