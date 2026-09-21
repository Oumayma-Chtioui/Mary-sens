
import { NextResponse } from "next/server";
import { contactMessages } from "@/db/schema";
import { getDb } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = await checkRateLimit(`contact:${ip}`, 5, 60 * 60);
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de messages envoyés. Merci de réessayer plus tard." },
      { status: 429 }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 200);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const phone = String(body.phone ?? "").trim().slice(0, 40);
  const subject = String(body.subject ?? "").trim().slice(0, 300);
  const message = String(body.message ?? "").trim().slice(0, 5000);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
  }

  try {
    await getDb().insert(contactMessages).values({
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
    });
  } catch (error) {
    console.error("[/api/contact] insert failed:", error);
    return NextResponse.json({ error: "Impossible d'enregistrer le message." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}