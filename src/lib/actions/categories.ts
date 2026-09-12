"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { optimizeImage } from "@/lib/images";

async function uploadCategoryImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  categoryId: string,
  file: File
) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const optimized = await optimizeImage(buffer, { maxWidth: 1200, quality: 82 });
  const path = `categories/${categoryId}/${Date.now()}.webp`;

  const { error: uploadError } = await supabase.storage
    .from("marysens-media")
    .upload(path, optimized, { contentType: "image/webp", upsert: false });
  if (uploadError) throw uploadError;

  const { data: publicUrl } = supabase.storage.from("marysens-media").getPublicUrl(path);
  return publicUrl.publicUrl;
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "") || null;
  const imageFile = formData.get("image") as File | null;

  let errorMessage: string | null = null;

  try {
    const { data: category, error } = await supabase
      .from("categories")
      .insert({ name, slug: slugify(name), description })
      .select("id")
      .single();
    if (error) throw error;

    if (imageFile && imageFile.size > 0) {
      const imageUrl = await uploadCategoryImage(supabase, category.id, imageFile);
      const { error: imgError } = await supabase
        .from("categories")
        .update({ image_url: imageUrl })
        .eq("id", category.id);
      if (imgError) throw imgError;
    }
  } catch (err: any) {
    console.error("[createCategory] failed:", err);
    errorMessage = err?.message ?? "Erreur inconnue.";
  }

  revalidatePath("/admin/categories");
  revalidatePath("/catalogue");
  revalidatePath("/");

  if (errorMessage) {
    redirect(`/admin/categories?error=${encodeURIComponent(errorMessage)}`);
  }
  redirect("/admin/categories?success=1");
}

export async function updateCategory(categoryId: string, formData: FormData) {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "") || null;
  const is_visible = formData.get("is_visible") === "on";
  const imageFile = formData.get("image") as File | null;

  let errorMessage: string | null = null;

  try {
    const updates: Record<string, unknown> = { name, description, is_visible };

    if (imageFile && imageFile.size > 0) {
      updates.image_url = await uploadCategoryImage(supabase, categoryId, imageFile);
    }

    const { error } = await supabase.from("categories").update(updates).eq("id", categoryId);
    if (error) throw error;
  } catch (err: any) {
    console.error("[updateCategory] failed:", err);
    errorMessage = err?.message ?? "Erreur inconnue.";
  }

  revalidatePath("/admin/categories");
  revalidatePath("/catalogue");
  revalidatePath("/");

  if (errorMessage) {
    redirect(`/admin/categories?error=${encodeURIComponent(errorMessage)}`);
  }
  redirect("/admin/categories?success=1");
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