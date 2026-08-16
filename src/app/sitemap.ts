import type { MetadataRoute } from "next";
import { getProducts, getCategories } from "@/lib/queries";

const BASE_URL = "https://www.marysens.tn";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const staticRoutes = ["", "/catalogue", "/a-propos", "/points-de-vente", "/contact"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((p) => ({
    url: `${BASE_URL}/catalogue/${p.slug}`,
    lastModified: p.updated_at,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${BASE_URL}/catalogue?categorie=${c.slug}`,
    lastModified: c.updated_at,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
