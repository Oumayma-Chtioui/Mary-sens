"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function markMessageStatus(messageId: string, status: "new" | "read" | "handled") {
  const supabase = createClient();
  const { error } = await supabase.from("contact_messages").update({ status }).eq("id", messageId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(messageId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", messageId);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}
