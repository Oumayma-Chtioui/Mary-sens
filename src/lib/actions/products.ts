"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { productImages, products } from "@/db/schema";
import { getDb } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin";
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
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  const fields = readProductFields(formData);
  const slug = slugify(fields.name);

  const [data] = await getDb().insert(products).values({ ...fields, slug }).returning({ id: products.id });
  if (!data) throw new Error("Impossible de créer le produit.");

  revalidatePath("/admin/produits");
  revalidatePath("/catalogue");
  redirect(`/admin/produits/${data.id}`);
}

export async function updateProduct(productId: string, formData: FormData) {
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  const fields = readProductFields(formData);

  await getDb().update(products).set(fields).where(eq(products.id, productId));

  revalidatePath("/admin/produits");
  revalidatePath(`/admin/produits/${productId}`);
  revalidatePath("/catalogue");
}

export async function deleteProduct(productId: string) {
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  await getDb().delete(products).where(eq(products.id, productId));
  revalidatePath("/admin/produits");
  revalidatePath("/catalogue");
}

export async function duplicateProduct(productId: string) {
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  const [original] = await getDb().select().from(products).where(eq(products.id, productId)).limit(1);
  if (!original) throw new Error("Produit introuvable.");

  const { id, created_at, updated_at, slug, ...rest } = original;
  const newName = `${rest.name} (copie)`;
  const [data] = await getDb().insert(products).values({ ...rest, name: newName, slug: slugify(newName), is_published: false }).returning({ id: products.id });
  if (!data) throw new Error("Impossible de dupliquer le produit.");
  revalidatePath("/admin/produits");
  redirect(`/admin/produits/${data.id}`);
}

export async function togglePublish(productId: string, next: boolean) {
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  await getDb().update(products).set({ is_published: next }).where(eq(products.id, productId));
  revalidatePath("/admin/produits");
  revalidatePath("/catalogue");
}

function safeExtension(filename: string) {
  const match = filename.match(/\.([a-zA-Z0-9]+)$/);
  const ext = match ? match[1].toLowerCase() : "jpg";
  return /^(jpg|jpeg|png|webp|gif)$/.test(ext) ? ext : "jpg";
}

export async function addProductImage(productId: string, formData: FormData) {
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  // TODO(storage): implement product image storage when a file backend is available.
  throw new Error("Product image uploads require storage configuration.");

  revalidatePath(`/admin/produits/${productId}`);
  revalidatePath("/catalogue");
}

export async function deleteProductImage(productId: string, imageId: string) {
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  await getDb().delete(productImages).where(eq(productImages.id, imageId));
  revalidatePath(`/admin/produits/${productId}`);
}

export async function setPrimaryImage(productId: string, imageId: string) {
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  const db = getDb();
  await db.update(productImages).set({ is_primary: false }).where(eq(productImages.product_id, productId));
  await db.update(productImages).set({ is_primary: true }).where(eq(productImages.id, imageId));
  revalidatePath(`/admin/produits/${productId}`);
}