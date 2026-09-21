"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { productImages, products } from "@/db/schema";
import { getDb } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin";
import { slugify } from "@/lib/utils";
import { uploadImage } from "@/lib/cloudinary";

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
  const existing = await getDb().select({ id: products.id }).from(products).where(eq(products.slug, slug)).limit(1);
  if (existing.length > 0) return { error: "Un produit avec ce nom existe déjà. Choisissez un autre nom." };

  let data: { id: string } | undefined;
  try {
    [data] = await getDb().insert(products).values({ ...fields, slug }).returning({ id: products.id });
  } catch (error) {
    if (String(error).includes("UNIQUE constraint failed: products.slug")) {
      return { error: "Un produit avec ce nom existe déjà. Choisissez un autre nom." };
    }
    throw error;
  }
  if (!data) throw new Error("Impossible de créer le produit.");

  revalidatePath("/admin/produits");
  revalidatePath("/catalogue");
  redirect(`/admin/produits/${data.id}`);
}

export async function updateProduct(productId: string, formData: FormData) {
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  const fields = readProductFields(formData);
  const slug = slugify(fields.name);
  const existing = await getDb().select({ id: products.id }).from(products).where(eq(products.slug, slug)).limit(1);
  if (existing.some((product) => product.id !== productId)) {
    return { error: "Un produit avec ce nom existe déjà. Choisissez un autre nom." };
  }

  try {
    await getDb().update(products).set({ ...fields, slug }).where(eq(products.id, productId));
  } catch (error) {
    if (String(error).includes("UNIQUE constraint failed: products.slug")) {
      return { error: "Un produit avec ce nom existe déjà. Choisissez un autre nom." };
    }
    throw error;
  }

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

export async function addProductImage(productId: string, formData: FormData) {
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return;

  const url = await uploadImage(file, "products");
  const imageRows = await getDb().select({ id: productImages.id }).from(productImages).where(eq(productImages.product_id, productId));
  await getDb().insert(productImages).values({
    product_id: productId,
    url,
    position: imageRows.length,
    is_primary: imageRows.length === 0,
  });

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