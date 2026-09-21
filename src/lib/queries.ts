import { and, asc, eq, inArray, like, ne } from "drizzle-orm";
import { categories, locations, productImages, products } from "@/db/schema";
import { getDb } from "@/lib/db";
import type { Category, Location, Product } from "@/lib/types";

async function withProductRelations(rows: typeof products.$inferSelect[]): Promise<Product[]> {
  if (rows.length === 0) return [];

  const db = getDb();
  const categoryIds = rows.map((product) => product.category_id).filter((id): id is string => Boolean(id));
  const [categoryRows, imageRows] = await Promise.all([
    categoryIds.length > 0 ? db.select().from(categories).where(inArray(categories.id, categoryIds)) : Promise.resolve([]),
    db.select().from(productImages).where(inArray(productImages.product_id, rows.map((product) => product.id))),
  ]);
  const categoryById = new Map(categoryRows.map((category) => [category.id, category]));
  const imagesByProductId = new Map<string, typeof imageRows>();

  for (const image of imageRows) {
    const images = imagesByProductId.get(image.product_id) ?? [];
    images.push(image);
    imagesByProductId.set(image.product_id, images);
  }

  return rows.map((product) => ({
    ...product,
    category: product.category_id ? categoryById.get(product.category_id) ?? null : null,
    images: imagesByProductId.get(product.id) ?? [],
  }));
}

export async function getCategories(): Promise<Category[]> {
  try {
    return await getDb().select().from(categories).where(eq(categories.is_visible, true)).orderBy(asc(categories.position));
  } catch {
    return [];
  }
}

export async function getProducts(options?: {
  categorySlug?: string;
  search?: string;
  featuredOnly?: boolean;
}): Promise<Product[]> {
  try {
    const db = getDb();
    const conditions = [eq(products.is_published, true)];
    if (options?.featuredOnly) conditions.push(eq(products.is_featured, true));
    if (options?.search) conditions.push(like(products.name, `%${options.search}%`));
    if (options?.categorySlug) {
      const [category] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, options.categorySlug)).limit(1);
      if (!category) return [];
      conditions.push(eq(products.category_id, category.id));
    }
    const rows = await db.select().from(products).where(and(...conditions)).orderBy(asc(products.position));
    return withProductRelations(rows);
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const [product] = await getDb().select().from(products).where(and(eq(products.slug, slug), eq(products.is_published, true))).limit(1);
    if (!product) return null;
    const [result] = await withProductRelations([product]);
    return result ?? null;
  } catch {
    return null;
  }
}

export async function getLocations(): Promise<Location[]> {
  try {
    return await getDb().select().from(locations).where(eq(locations.is_visible, true)).orderBy(asc(locations.position));
  } catch {
    return [];
  }
}

export async function getRelatedProducts(
  categoryId: string | null,
  excludeProductId: string,
  limit = 4
): Promise<Product[]> {
  if (!categoryId) return [];
  try {
    const rows = await getDb()
      .select()
      .from(products)
      .where(and(eq(products.is_published, true), eq(products.category_id, categoryId), ne(products.id, excludeProductId)))
      .limit(limit);
    return withProductRelations(rows);
  } catch {
    return [];
  }
}