"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { optimizeImage } from "@/lib/images";
import JSZip from "jszip";

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
  publication?: string;
  availability?: string;
  featured?: string;
  // Either a filename to look up inside the uploaded ZIP (e.g. "roll-on.jpg"),
  // or a direct https:// URL — both are supported.
  image?: string;
};

export type ImportResult = {
  totalDetected: number;
  importedCount: number;
  errorCount: number;
  imagesMatchedCount: number;
  imagesMissingCount: number;
  errors: Array<{ row: number; name: string; reason: string }>;
};

function truthy(value?: string) {
  if (!value) return false;
  return ["1", "true", "vrai", "oui", "yes"].includes(value.trim().toLowerCase());
}

function normalizeFilename(name: string) {
  return name.split("/").pop()?.trim().toLowerCase() ?? "";
}

async function fetchImageBuffer(
  imageValue: string,
  imagesByName: Map<string, JSZip.JSZipObject> | null
): Promise<Buffer | null> {
  if (/^https?:\/\//i.test(imageValue)) {
    try {
      const res = await fetch(imageValue);
      if (!res.ok) return null;
      return Buffer.from(await res.arrayBuffer());
    } catch {
      return null;
    }
  }

  const entry = imagesByName?.get(normalizeFilename(imageValue));
  if (!entry) return null;
  return Buffer.from(await entry.async("arraybuffer"));
}

export async function importProducts(formData: FormData): Promise<ImportResult> {
  let rows: ImportRow[];
  try {
    const rowsValue = formData.get("rows");
    rows = JSON.parse(typeof rowsValue === "string" ? rowsValue : "null");
    if (!Array.isArray(rows)) throw new Error("Les lignes importées sont invalides.");
  } catch {
    return {
      totalDetected: 0,
      importedCount: 0,
      errorCount: 1,
      imagesMatchedCount: 0,
      imagesMissingCount: 0,
      errors: [{ row: 0, name: "Import", reason: "Le fichier CSV est invalide." }],
    };
  }

  const zipValue = formData.get("zip");
  const zipFile = zipValue instanceof File ? zipValue : null;
  const supabase = await createClient();

  const { data: categories } = await supabase.from("categories").select("id,name");
  const categoryByName = new Map((categories ?? []).map((c) => [c.name.trim().toLowerCase(), c.id]));

  let imagesByName: Map<string, JSZip.JSZipObject> | null = null;
  if (zipFile && zipFile.size > 0) {
    try {
      const zip = await JSZip.loadAsync(await zipFile.arrayBuffer());
      imagesByName = new Map();
      zip.forEach((relativePath, entry) => {
        if (!entry.dir) imagesByName!.set(normalizeFilename(relativePath), entry);
      });
    } catch (err) {
      console.error("[importProducts] Failed to read ZIP:", err);
      imagesByName = null;
    }
  }

  const errors: ImportResult["errors"] = [];
  let importedCount = 0;
  let imagesMatchedCount = 0;
  let imagesMissingCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNumber = i + 2;

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
    const slug = slugify(row.name.trim()) + "-" + Math.random().toString(36).slice(2, 6);

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        name: row.name.trim(),
        slug,
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
        is_published: row.publication ? truthy(row.publication) : false,
      })
      .select("id")
      .single();

    if (error || !product) {
      errors.push({ row: rowNumber, name: row.name, reason: error?.message ?? "Erreur inconnue." });
      continue;
    }
    importedCount++;

    const imageValue = row.image?.trim();
    if (imageValue) {
      try {
        const buffer = await fetchImageBuffer(imageValue, imagesByName);
        if (!buffer) {
          imagesMissingCount++;
          errors.push({
            row: rowNumber,
            name: row.name,
            reason: /^https?:\/\//i.test(imageValue)
              ? `Impossible de télécharger l'image depuis "${imageValue}".`
              : `Image "${imageValue}" introuvable dans le fichier ZIP.`,
          });
        } else {
          const optimized = await optimizeImage(buffer, { maxWidth: 1600, quality: 82 });
          const path = `products/${product.id}/${Date.now()}.webp`;

          const { error: uploadError } = await supabase.storage
            .from("marysens-media")
            .upload(path, optimized, { contentType: "image/webp", upsert: false });

          if (uploadError) {
            imagesMissingCount++;
            errors.push({ row: rowNumber, name: row.name, reason: `Échec de l'envoi de l'image : ${uploadError.message}` });
          } else {
            const { data: publicUrl } = supabase.storage.from("marysens-media").getPublicUrl(path);
            await supabase.from("product_images").insert({
              product_id: product.id,
              url: publicUrl.publicUrl,
              position: 0,
              is_primary: true,
            });
            imagesMatchedCount++;
          }
        }
      } catch (err: any) {
        imagesMissingCount++;
        errors.push({ row: rowNumber, name: row.name, reason: `Erreur lors du traitement de l'image : ${err?.message ?? "inconnue"}` });
      }
    }
  }

  revalidatePath("/admin/produits");
  revalidatePath("/catalogue");

  return {
    totalDetected: rows.length,
    importedCount,
    errorCount: errors.length,
    imagesMatchedCount,
    imagesMissingCount,
    errors,
  };
}