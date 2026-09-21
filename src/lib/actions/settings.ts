"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { siteSettings } from "@/db/schema";
import { getDb } from "@/lib/db";
import { getSiteSettings } from "@/lib/settings";
import { requireAdminApi } from "@/lib/require-admin";
import type { SiteSettings } from "@/lib/types";
import { uploadImage } from "@/lib/cloudinary";

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

export async function updateHeroImage(formData: FormData) {
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  const heroFile = formData.get("hero_image_file") as File | null;

  if (!heroFile || heroFile.size === 0) {
    redirect(`/admin/parametres?heroError=${encodeURIComponent("Veuillez choisir une image.")}`);
  }

  const hero_image = await uploadImage(heroFile, "site");
  const current = await getSiteSettings();
  await getDb().update(siteSettings).set({
    data: { ...current, hero_image },
    updated_at: new Date().toISOString(),
  }).where(eq(siteSettings.id, 1));

  revalidatePath("/", "layout");
  redirect("/admin/parametres?heroSuccess=1");
}