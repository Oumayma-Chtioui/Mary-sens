"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { siteSettings } from "@/db/schema";
import { getDb } from "@/lib/db";
import { getSiteSettings } from "@/lib/settings";
import { requireAdminApi } from "@/lib/require-admin";
import type { SiteSettings } from "@/lib/types";

const TEXT_FIELDS: Array<keyof SiteSettings> = [
  "brand_name",
  "description",
  "phone",
  "whatsapp_number",
  "email",
  "hero_title",
  "hero_tagline",
  "hero_description",
  "about_story",
  "about_mission",
  "about_values",
  "instagram_url",
  "facebook_url",
  "tiktok_url",
  "address",
  "seo_title",
  "seo_description",
];

export async function updateSettings(formData: FormData) {
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  const current = await getSiteSettings();
  const updated: SiteSettings = { ...current };

  for (const key of TEXT_FIELDS) {
    const value = formData.get(key);
    if (value !== null) (updated[key] as string) = String(value);
  }

  updated.whatsapp_enabled = formData.get("whatsapp_enabled") === "true";

  try {
    await getDb().update(siteSettings).set({ data: updated, updated_at: new Date().toISOString() }).where(eq(siteSettings.id, 1));
  } catch (error) {
    console.error("[updateSettings] failed:", error);
    redirect(`/admin/parametres?error=${encodeURIComponent(String(error))}`);
  }

  revalidatePath("/", "layout");
  redirect("/admin/parametres?success=1");
}

function safeExtension(filename: string) {
  const match = filename.match(/\.([a-zA-Z0-9]+)$/);
  const ext = match ? match[1].toLowerCase() : "jpg";
  return /^(jpg|jpeg|png|webp|gif)$/.test(ext) ? ext : "jpg";
}

export async function updateHeroImage(formData: FormData) {
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  const heroFile = formData.get("hero_image_file") as File | null;

  if (!heroFile || heroFile.size === 0) {
    redirect(`/admin/parametres?heroError=${encodeURIComponent("Veuillez choisir une image.")}`);
  }

  // TODO(storage): implement hero image storage when a file backend is available.
  throw new Error("Hero image uploads require storage configuration.");
}