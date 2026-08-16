"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function createCategory(formData: FormData) {
  const supabase = createClient();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "") || null;

  const { error } = await supabase.from("categories").insert({
    name,
    slug: slugify(name),
    description,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidatePath("/catalogue");
}

export async function updateCategory(categoryId: string, formData: FormData) {
  const supabase = createClient();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "") || null;
  const is_visible = formData.get("is_visible") === "on";

  const { error } = await supabase
    .from("categories")
    .update({ name, description, is_visible })
    .eq("id", categoryId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidatePath("/catalogue");
}

export async function deleteCategory(categoryId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("categories").delete().eq("id", categoryId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
  revalidatePath("/catalogue");
}

export async function reorderCategory(categoryId: string, position: number) {
  const supabase = createClient();
  const { error } = await supabase.from("categories").update({ position }).eq("id", categoryId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
}
