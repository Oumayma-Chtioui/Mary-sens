import { NextResponse } from "next/server";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, phone, subject, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase n'est pas encore configuré côté serveur." },
      { status: 503 }
    );
  }

  const supabase = createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    phone: phone || null,
    subject: subject || null,
    message,
  });

  if (error) {
    return NextResponse.json({ error: "Impossible d'enregistrer le message." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
