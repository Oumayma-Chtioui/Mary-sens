"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function readLocationFields(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    address: String(formData.get("address") ?? "") || null,
    city: String(formData.get("city") ?? "") || null,
    phone: String(formData.get("phone") ?? "") || null,
    opening_hours: String(formData.get("opening_hours") ?? "") || null,
    maps_url: String(formData.get("maps_url") ?? "") || null,
    description: String(formData.get("description") ?? "") || null,
    is_visible: formData.get("is_visible") === "on",
  };
}

export async function createLocation(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("locations").insert(readLocationFields(formData));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/points-de-vente");
  revalidatePath("/points-de-vente");
}

export async function updateLocation(locationId: string, formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("locations").update(readLocationFields(formData)).eq("id", locationId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/points-de-vente");
  revalidatePath("/points-de-vente");
}

export async function deleteLocation(locationId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("locations").delete().eq("id", locationId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/points-de-vente");
  revalidatePath("/points-de-vente");
}
