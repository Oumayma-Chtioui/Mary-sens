"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

function readProductFields(formData: FormData) {
  const tagsRaw = String(formData.get("tags") ?? "");
  return {
    name: String(formData.get("name") ?? "").trim(),
    short_description: String(formData.get("short_description") ?? "") || null,
    full_description: String(formData.get("full_description") ?? "") || null,
    category_id: String(formData.get("category_id") ?? "") || null,
    price: formData.get("price") ? Number(formData.get("price")) : null,
    price_visible: formData.get("price_visible") === "on",
    is_available: formData.get("is_available") === "on",
    sku: String(formData.get("sku") ?? "") || null,
    volume: String(formData.get("volume") ?? "") || null,
    ingredients: String(formData.get("ingredients") ?? "") || null,
    benefits: String(formData.get("benefits") ?? "") || null,
    usage_instructions: String(formData.get("usage_instructions") ?? "") || null,
    precautions: String(formData.get("precautions") ?? "") || null,
    tags: tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    is_featured: formData.get("is_featured") === "on",
    is_published: formData.get("is_published") === "on",
    whatsapp_enabled: formData.get("whatsapp_enabled") === "on",
  };
}

export async function createProduct(formData: FormData) {
  const supabase = createClient();
  const fields = readProductFields(formData);
  const slug = slugify(fields.name);

  const { data, error } = await supabase
    .from("products")
    .insert({ ...fields, slug })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/admin/produits");
  revalidatePath("/catalogue");
  redirect(`/admin/produits/${data.id}`);
}

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = createClient();
  const fields = readProductFields(formData);

  const { error } = await supabase.from("products").update(fields).eq("id", productId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/produits");
  revalidatePath(`/admin/produits/${productId}`);
  revalidatePath("/catalogue");
}

export async function deleteProduct(productId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/produits");
  revalidatePath("/catalogue");
}

export async function duplicateProduct(productId: string) {
  const supabase = createClient();
  const { data: original } = await supabase.from("products").select("*").eq("id", productId).single();
  if (!original) throw new Error("Produit introuvable.");

  const { id, created_at, updated_at, slug, ...rest } = original;
  const newName = `${rest.name} (copie)`;
  const { data, error } = await supabase
    .from("products")
    .insert({ ...rest, name: newName, slug: slugify(newName), is_published: false })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/produits");
  redirect(`/admin/produits/${data.id}`);
}

export async function togglePublish(productId: string, next: boolean) {
  const supabase = createClient();
  const { error } = await supabase.from("products").update({ is_published: next }).eq("id", productId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/produits");
  revalidatePath("/catalogue");
}

export async function addProductImage(productId: string, formData: FormData) {
  const supabase = createClient();
  const file = formData.get("file") as File;
  if (!file || file.size === 0) return;

  const safeName = file.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents (é -> e)
    .replace(/[^a-zA-Z0-9.\-_]/g, "-") // replace anything else (apostrophes, spaces...) with "-"
    .replace(/-+/g, "-");

  const path = `products/${productId}/${Date.now()}-${safeName}`;
  const { error: uploadError } = await supabase.storage
    .from("marysens-media")
    .upload(path, file, { upsert: false });
  if (uploadError) throw new Error(uploadError.message);

  const { data: publicUrl } = supabase.storage.from("marysens-media").getPublicUrl(path);

  const { count } = await supabase
    .from("product_images")
    .select("*", { count: "exact", head: true })
    .eq("product_id", productId);

  const { error } = await supabase.from("product_images").insert({
    product_id: productId,
    url: publicUrl.publicUrl,
    position: count ?? 0,
    is_primary: (count ?? 0) === 0,
  });
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/produits/${productId}`);
  revalidatePath("/catalogue");
}

export async function deleteProductImage(productId: string, imageId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("product_images").delete().eq("id", imageId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/produits/${productId}`);
}

export async function setPrimaryImage(productId: string, imageId: string) {
  const supabase = createClient();
  await supabase.from("product_images").update({ is_primary: false }).eq("product_id", productId);
  const { error } = await supabase.from("product_images").update({ is_primary: true }).eq("id", imageId);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/produits/${productId}`);
}
