"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteSettings } from "@/lib/settings";
import { optimizeImage } from "@/lib/images";
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

// Text fields + the WhatsApp toggle. Deliberately does NOT touch the hero
// image at all, so a failed image upload can never block these from saving.
export async function updateSettings(formData: FormData) {
  const supabase = await createClient();
  const current = await getSiteSettings();
  const updated: SiteSettings = { ...current };

  for (const key of TEXT_FIELDS) {
    const value = formData.get(key);
    if (value !== null) (updated[key] as string) = String(value);
  }

  updated.whatsapp_enabled = formData.get("whatsapp_enabled") === "true";

  const { error } = await supabase
    .from("site_settings")
    .update({ data: updated, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) {
    console.error("[updateSettings] failed:", error);
    redirect(`/admin/parametres?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect("/admin/parametres?success=1");
}

// Hero image upload, entirely separate from the form above. A failure here
// only ever affects this one field, never your other settings.
export async function updateHeroImage(formData: FormData) {
  const supabase = await createClient();
  const heroFile = formData.get("hero_image_file") as File | null;

  if (!heroFile || heroFile.size === 0) {
    redirect(`/admin/parametres?heroError=${encodeURIComponent("Veuillez choisir une image.")}`);
  }

  let errorMessage: string | null = null;

  try {
    const buffer = Buffer.from(await heroFile.arrayBuffer());
    const optimized = await optimizeImage(buffer, { maxWidth: 1920, quality: 82 });
    const path = `settings/hero-${Date.now()}.webp`;

    const { error: uploadError } = await supabase.storage
      .from("marysens-media")
      .upload(path, optimized, { contentType: "image/webp", upsert: false });
    if (uploadError) throw uploadError;

    const { data: publicUrl } = supabase.storage.from("marysens-media").getPublicUrl(path);

    const current = await getSiteSettings();
    const updated: SiteSettings = { ...current, hero_image: publicUrl.publicUrl };

    const { error } = await supabase
      .from("site_settings")
      .update({ data: updated, updated_at: new Date().toISOString() })
      .eq("id", 1);
    if (error) throw error;
  } catch (err: any) {
    console.error("[updateHeroImage] failed:", err);
    errorMessage = err?.message ?? "Erreur inconnue lors du téléversement.";
  }

  if (errorMessage) {
    redirect(`/admin/parametres?heroError=${encodeURIComponent(errorMessage)}`);
  }

  revalidatePath("/", "layout");
  redirect("/admin/parametres?heroSuccess=1");
}