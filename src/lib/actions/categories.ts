"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

function safeExtension(filename: string) {
  const match = filename.match(/\.([a-zA-Z0-9]+)$/);
  const ext = match ? match[1].toLowerCase() : "jpg";
  return /^(jpg|jpeg|png|webp|gif)$/.test(ext) ? ext : "jpg";
}

async function uploadCategoryImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  categoryId: string,
  file: File
) {
  const ext = safeExtension(file.name);
  const path = `categories/${categoryId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("marysens-media")
    .upload(path, file, { contentType: file.type || undefined, upsert: false });
  if (uploadError) throw uploadError;

  const { data: publicUrl } = supabase.storage.from("marysens-media").getPublicUrl(path);
  return publicUrl.publicUrl;
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "") || null;
  const imageFile = formData.get("image") as File | null;

  const { data: category, error } = await supabase
    .from("categories")
    .insert({ name, slug: slugify(name), description })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  if (imageFile && imageFile.size > 0) {
    const imageUrl = await uploadCategoryImage(supabase, category.id, imageFile);
    await supabase.from("categories").update({ image_url: imageUrl }).eq("id", category.id);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/catalogue");
  revalidatePath("/");
}

export async function updateCategory(categoryId: string, formData: FormData) {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "") || null;
  const is_visible = formData.get("is_visible") === "on";
  const imageFile = formData.get("image") as File | null;

  const updates: Record<string, unknown> = { name, description, is_visible };

  if (imageFile && imageFile.size > 0) {
    updates.image_url = await uploadCategoryImage(supabase, categoryId, imageFile);
  }

  const { error } = await supabase.from("categories").update(updates).eq("id", categoryId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidatePath("/catalogue");
  revalidatePath("/");
}

export async function deleteCategory(categoryId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", categoryId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
  revalidatePath("/catalogue");
}

export async function reorderCategory(categoryId: string, position: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").update({ position }).eq("id", categoryId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
}