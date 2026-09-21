"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { contactMessages } from "@/db/schema";
import { getDb } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin";

export async function markMessageStatus(messageId: string, status: "new" | "read" | "handled") {
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  await getDb().update(contactMessages).set({ status }).where(eq(contactMessages.id, messageId));
  revalidatePath("/admin/messages");
}

export async function deleteMessage(messageId: string) {
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  await getDb().delete(contactMessages).where(eq(contactMessages.id, messageId));
  revalidatePath("/admin/messages");
}
