import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Category, Location, Product } from "@/lib/types";

// Every function below fails soft to an empty array/null when Supabase
// isn't connected yet, so the public site still renders (with proper
// empty states) before the client's database is wired up.

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_visible", true)
    .order("position", { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function getProducts(options?: {
  categorySlug?: string;
  search?: string;
  featuredOnly?: boolean;
}): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();

  let query = supabase
    .from("products")
    .select("*, category:categories(*), images:product_images(*)")
    .eq("is_published", true)
    .order("position", { ascending: true });

  if (options?.featuredOnly) query = query.eq("is_featured", true);
  if (options?.search) query = query.ilike("name", `%${options.search}%`);
  if (options?.categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", options.categorySlug)
      .single();
    if (cat) query = query.eq("category_id", cat.id);
    else return [];
  }

  const { data, error } = await query;
  if (error) return [];
  return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), images:product_images(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (error) return null;
  return data;
}

export async function getLocations(): Promise<Location[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = createClient();
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("is_visible", true)
    .order("position", { ascending: true });
  if (error) return [];
  return data ?? [];
}
