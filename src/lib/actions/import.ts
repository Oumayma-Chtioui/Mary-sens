"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export type ImportRow = {
  name: string;
  category?: string;
  description?: string;
  price?: string;
  volume?: string;
  ingredients?: string;
  benefits?: string;
  usage?: string;
  precautions?: string;
  availability?: string;
  featured?: string;
};

export type ImportResult = {
  totalDetected: number;
  importedCount: number;
  errorCount: number;
  errors: Array<{ row: number; name: string; reason: string }>;
};

function truthy(value?: string) {
  if (!value) return false;
  return ["1", "true", "vrai", "oui", "yes"].includes(value.trim().toLowerCase());
}

export async function importProducts(rows: ImportRow[]): Promise<ImportResult> {
  const supabase = await createClient();

  const { data: categories } = await supabase.from("categories").select("id,name");
  const categoryByName = new Map((categories ?? []).map((c) => [c.name.trim().toLowerCase(), c.id]));

  const errors: ImportResult["errors"] = [];
  let importedCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNumber = i + 2; // account for header row in the source CSV

    if (!row.name || !row.name.trim()) {
      errors.push({ row: rowNumber, name: row.name ?? "(sans nom)", reason: "Nom du produit manquant." });
      continue;
    }

    let price: number | null = null;
    if (row.price && row.price.trim()) {
      const parsed = Number(row.price.replace(",", "."));
      if (Number.isNaN(parsed)) {
        errors.push({ row: rowNumber, name: row.name, reason: `Prix invalide : "${row.price}".` });
        continue;
      }
      price = parsed;
    }

    const categoryId = row.category ? categoryByName.get(row.category.trim().toLowerCase()) ?? null : null;

    const { error } = await supabase.from("products").insert({
      name: row.name.trim(),
      slug: slugify(row.name.trim()) + "-" + Math.random().toString(36).slice(2, 6),
      short_description: row.description?.trim() || null,
      category_id: categoryId,
      price,
      price_visible: price != null,
      volume: row.volume?.trim() || null,
      ingredients: row.ingredients?.trim() || null,
      benefits: row.benefits?.trim() || null,
      usage_instructions: row.usage?.trim() || null,
      precautions: row.precautions?.trim() || null,
      is_available: row.availability ? truthy(row.availability) : true,
      is_featured: truthy(row.featured),
      is_published: false, // imported products land as drafts for review before going live
    });

    if (error) {
      errors.push({ row: rowNumber, name: row.name, reason: error.message });
      continue;
    }
    importedCount++;
  }

  revalidatePath("/admin/produits");

  return {
    totalDetected: rows.length,
    importedCount,
    errorCount: errors.length,
    errors,
  };
}
