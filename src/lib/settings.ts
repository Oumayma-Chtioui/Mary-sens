import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/types";

// Default content used until the admin fills in real values from
// /admin/parametres, or while Supabase isn't connected yet. Only the copy
// explicitly provided in the brand brief is used here — everything else
// (address, founders, certifications) is left as a clearly-labelled
// placeholder rather than invented.
export const DEFAULT_SETTINGS: SiteSettings = {
  brand_name: "Mary'sens",
  logo_url: "/images/logo.png",
  description:
    "Soin et bien-être. La marque tunisienne de référence des huiles essentielles et végétales 100% pures et bio.",
  phone: "À compléter",
  whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "21600000000",
  email: "contact@marysens.tn",
  hero_title: "Mary'sens",
  hero_tagline: "Soin & bien-être naturel",
  hero_description:
    "Des huiles essentielles et végétales 100% pures et bio, pensées pour prendre soin de vous, naturellement.",
  hero_cta_primary: "Découvrir nos produits",
  hero_cta_secondary: "Commander sur WhatsApp",
  about_story: "À compléter depuis l'administration (Contenu du site > La marque).",
  about_mission: "À compléter depuis l'administration.",
  about_values: "À compléter depuis l'administration.",
  instagram_url: "",
  facebook_url: "",
  tiktok_url: "",
  address: "Mahdia, Tunisie",
  seo_title: "Mary'sens — Soin & bien-être naturel",
  seo_description:
    "Huiles essentielles et végétales 100% pures et bio, pensées et fabriquées en Tunisie.",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return DEFAULT_SETTINGS;

  try {
    const supabase = createClient();
    const { data } = await supabase.from("site_settings").select("data").eq("id", 1).single();
    if (!data?.data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...data.data };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
