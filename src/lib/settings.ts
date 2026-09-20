import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/types";

export const DEFAULT_SETTINGS: SiteSettings = {
  brand_name: "Mary'sens",
  logo_url: "/images/logo.png",
  description:
    "Huiles essentielles et végétales 100% pures & biologiques. Soin & bien-être 🇹🇳",
  phone: "27 995 027",
  whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "21627995027",
  whatsapp_enabled: true,
  email: "marysens.cosmetique@gmail.com",
  hero_title: "La Marque tunisienne de référence des huiles essentielles et végétales",
  hero_tagline: "Soin & bien-être naturel",
  hero_description:
    "Des huiles 100% pures et biologiques, sélectionnées avec soin pour votre bien-être au quotidien.",
  hero_image: "/images/banner.png",
  about_story:
    "Mary'Sens est la marque tunisienne de référence des huiles essentielles et végétales, 100% Pure et Bio. Née d'une passion profonde pour le savoir-faire artisanal tunisien, notre maison puise dans la richesse d'une terre généreuse pour révéler le meilleur de la nature.\n\nChaque flacon incarne un engagement sans compromis envers la pureté, l'authenticité et le bien-être. De la cueillette délicate des plantes à l'extraction méticuleuse de leurs essences, nous célébrons un héritage où tradition et exigence se rencontrent.",
  about_mission:
    "Offrir des soins naturels d'exception qui prennent soin de votre peau et de votre esprit, tout en honorant la beauté du terroir tunisien.",
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
    const supabase = await createClient();
    const { data } = await supabase.from("site_settings").select("data").eq("id", 1).single();
    if (!data?.data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...data.data };
  } catch {
    return DEFAULT_SETTINGS;
  }
}