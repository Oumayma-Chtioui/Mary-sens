"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { locations } from "@/db/schema";
import { getDb } from "@/lib/db";
import { requireAdminApi } from "@/lib/require-admin";

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
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  await getDb().insert(locations).values(readLocationFields(formData));
  revalidatePath("/admin/points-de-vente");
  revalidatePath("/points-de-vente");
}

export async function updateLocation(locationId: string, formData: FormData) {
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  await getDb().update(locations).set(readLocationFields(formData)).where(eq(locations.id, locationId));
  revalidatePath("/admin/points-de-vente");
  revalidatePath("/points-de-vente");
}

export async function deleteLocation(locationId: string) {
  const admin = await requireAdminApi();
  if (admin instanceof Response) throw new Error("Non autorisé.");
  await getDb().delete(locations).where(eq(locations.id, locationId));
  revalidatePath("/admin/points-de-vente");
  revalidatePath("/points-de-vente");
}
