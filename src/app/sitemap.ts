import type { MetadataRoute } from "next";
import { getProducts, getCategories } from "@/lib/queries";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  const staticRoutes = ["", "/catalogue", "/a-propos", "/points-de-vente", "/contact"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
    priority: path === "" ? 1 : 0.8,
  }));

  const productRoutes = products.map((p) => ({
    url: `${SITE_URL}/catalogue/${p.slug}`,
    lastModified: p.updated_at,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${SITE_URL}/catalogue?categorie=${c.slug}`,
    lastModified: c.updated_at,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
