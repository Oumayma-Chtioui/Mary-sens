"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_SETTINGS } from "@/lib/settings";
import type { SiteSettings } from "@/lib/types";

export async function updateSettings(formData: FormData) {
  const supabase = createClient();

  const updated: SiteSettings = { ...DEFAULT_SETTINGS };
  for (const key of Object.keys(DEFAULT_SETTINGS) as Array<keyof SiteSettings>) {
    const value = formData.get(key);
    if (value !== null) updated[key] = String(value);
  }

  const { error } = await supabase
    .from("site_settings")
    .update({ data: updated, updated_at: new Date().toISOString() })
    .eq("id", 1);
  if (error) throw new Error(error.message);

  revalidatePath("/", "layout");
}
