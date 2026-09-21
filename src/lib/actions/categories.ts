"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { categories } from "@/db/schema";
import { getDb } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin";
import { slugify } from "@/lib/utils";

function safeExtension(filename: string) {
  const match = filename.match(/\.([a-zA-Z0-9]+)$/);
  const ext = match ? match[1].toLowerCase() : "jpg";
  return /^(jpg|jpeg|png|webp|gif)$/.test(ext) ? ext : "jpg";
}

export async function createCategory(formData: FormData) {
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "") || null;
  const imageFile = formData.get("image") as File | null;

  const [category] = await getDb().insert(categories).values({ name, slug: slugify(name), description }).returning({ id: categories.id });

  if (imageFile && imageFile.size > 0) {
    // TODO(storage): implement category image storage when a file backend is available.
    throw new Error("Category image uploads require storage configuration.");
  }

  revalidatePath("/admin/categories");
  revalidatePath("/catalogue");
  revalidatePath("/");
}

export async function updateCategory(categoryId: string, formData: FormData) {
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "") || null;
  const is_visible = formData.get("is_visible") === "on";
  const imageFile = formData.get("image") as File | null;

  const updates: Record<string, unknown> = { name, description, is_visible };

  if (imageFile && imageFile.size > 0) {
    // TODO(storage): implement category image storage when a file backend is available.
    throw new Error("Category image uploads require storage configuration.");
  }

  await getDb().update(categories).set(updates).where(eq(categories.id, categoryId));

  revalidatePath("/admin/categories");
  revalidatePath("/catalogue");
  revalidatePath("/");
}

export async function deleteCategory(categoryId: string) {
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  await getDb().delete(categories).where(eq(categories.id, categoryId));
  revalidatePath("/admin/categories");
  revalidatePath("/catalogue");
}

export async function reorderCategory(categoryId: string, position: number) {
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  await getDb().update(categories).set({ position }).where(eq(categories.id, categoryId));
  revalidatePath("/admin/categories");
}