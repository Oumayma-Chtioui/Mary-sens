import { NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase n'est pas encore configuré." }, { status: 503 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const orderNumber = String(body?.orderNumber ?? "").trim();
  const phone = String(body?.phone ?? "").trim();

  if (!orderNumber || !phone) {
    return NextResponse.json({ error: "Merci de renseigner la référence et le numéro de téléphone." }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Exact, single-row lookup by reference — this is not a listable query,
  // so it can't be used to browse orders. The phone number match below acts
  // as the access check (order references alone are sequential and
  // guessable; the phone match prevents a stranger from pulling up an order
  // just by trying MS-000001, MS-000002, etc.).
  const { data: order, error } = await supabase
    .from("orders")
    .select("id, customer_phone")
    .ilike("order_number", orderNumber)
    .maybeSingle();

  if (error) {
    console.error("[/api/orders/lookup] Query failed:", error);
    return NextResponse.json({ error: "Une erreur est survenue. Merci de réessayer." }, { status: 500 });
  }

  if (!order || normalizePhone(order.customer_phone) !== normalizePhone(phone)) {
    return NextResponse.json(
      { error: "Aucune commande ne correspond à cette référence et ce numéro de téléphone." },
      { status: 404 }
    );
  }

  return NextResponse.json({ id: order.id });
}