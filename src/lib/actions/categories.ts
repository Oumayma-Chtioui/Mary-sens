"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { categories } from "@/db/schema";
import { getDb } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin";
import { slugify } from "@/lib/utils";
import { uploadImage } from "@/lib/cloudinary";

export async function createCategory(formData: FormData) {
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "") || null;
  const imageFile = formData.get("image") as File | null;
  const slug = slugify(name);
  const existing = await getDb().select({ id: categories.id }).from(categories).where(eq(categories.slug, slug)).limit(1);
  if (existing.length > 0) return { error: "Une catégorie avec ce nom existe déjà. Choisissez un autre nom." };

  let category: { id: string } | undefined;
  try {
    [category] = await getDb().insert(categories).values({ name, slug, description }).returning({ id: categories.id });
  } catch (error) {
    if (String(error).includes("UNIQUE constraint failed: categories.slug")) {
      return { error: "Une catégorie avec ce nom existe déjà. Choisissez un autre nom." };
    }
    throw error;
  }

  if (imageFile && imageFile.size > 0) {
    const image_url = await uploadImage(imageFile, "categories");
    await getDb().update(categories).set({ image_url }).where(eq(categories.id, category.id));
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
  const slug = slugify(name);
  const existing = await getDb().select({ id: categories.id }).from(categories).where(eq(categories.slug, slug)).limit(1);
  if (existing.some((category) => category.id !== categoryId)) {
    return { error: "Une catégorie avec ce nom existe déjà. Choisissez un autre nom." };
  }

  const updates: Record<string, unknown> = { name, slug, description, is_visible };

  if (imageFile && imageFile.size > 0) {
    updates.image_url = await uploadImage(imageFile, "categories");
  }

  try {
    await getDb().update(categories).set(updates).where(eq(categories.id, categoryId));
  } catch (error) {
    if (String(error).includes("UNIQUE constraint failed: categories.slug")) {
      return { error: "Une catégorie avec ce nom existe déjà. Choisissez un autre nom." };
    }
    throw error;
  }

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