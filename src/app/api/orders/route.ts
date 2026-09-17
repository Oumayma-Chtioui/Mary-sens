import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

type IncomingItem = { productId: string; quantity: number };

// No ambiguous characters (0/O, 1/I) — these get read aloud over the phone.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateOrderNumber() {
  let out = "";
  for (let i = 0; i < 8; i++) out += ALPHABET[randomInt(ALPHABET.length)];
  return `MS-${out}`;
}

const MAX_ITEMS = 50;
const MAX_QTY = 100;
const MAX_TEXT = 200;
const MAX_NOTES = 1000;

function clean(value: unknown, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase n'est pas encore configuré." }, { status: 503 });
  }

  // 10 orders per IP per hour.
  const ip = getClientIp(request);
  const { allowed } = await checkRateLimit(`order:${ip}`, 10, 60 * 60);
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de commandes envoyées. Merci de réessayer plus tard ou de nous contacter directement." },
      { status: 429 }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const firstName = clean(body.customer_first_name, MAX_TEXT);
  const lastName = clean(body.customer_last_name, MAX_TEXT);
  const phone = clean(body.customer_phone, 40);
  const email = clean(body.customer_email, MAX_TEXT);
  const address = clean(body.customer_address, 500);
  const city = clean(body.customer_city, MAX_TEXT);
  const notes = clean(body.notes, MAX_NOTES);
  const items = body.items;

  if (!firstName || !lastName || !phone || !address || !city) {
    return NextResponse.json(
      { error: "Merci de renseigner votre prénom, nom, téléphone, adresse et ville." },
      { status: 400 }
    );
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Votre panier est vide." }, { status: 400 });
  }
  if (items.length > MAX_ITEMS) {
    return NextResponse.json({ error: "Trop d'articles dans le panier." }, { status: 400 });
  }

  const cleanedItems: IncomingItem[] = [];
  for (const raw of items) {
    const productId = String(raw?.productId ?? "");
    const quantity = Number(raw?.quantity);
    if (
      !/^[0-9a-f-]{36}$/i.test(productId) ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > MAX_QTY
    ) {
      return NextResponse.json({ error: "Un article du panier est invalide." }, { status: 400 });
    }
    cleanedItems.push({ productId, quantity });
  }

  const supabase = createAdminClient();

  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price, is_available, is_published")
    .in("id", cleanedItems.map((i) => i.productId));

  if (productsError) {
    console.error("[/api/orders] Failed to fetch products:", productsError);
    return NextResponse.json({ error: "Erreur lors de la vérification des produits." }, { status: 500 });
  }

  const productById = new Map((products ?? []).map((p) => [p.id, p]));
  const orderItemsToInsert = [];

  for (const item of cleanedItems) {
    const product = productById.get(item.productId);
    if (!product || !product.is_published || !product.is_available) {
      return NextResponse.json(
        { error: "Un ou plusieurs produits de votre panier ne sont plus disponibles." },
        { status: 400 }
      );
    }
    const unitPrice = Number(product.price) || 0;
    orderItemsToInsert.push({
      product_id: product.id,
      product_name: product.name,
      unit_price: unitPrice,
      quantity: item.quantity,
      subtotal: Math.round(unitPrice * item.quantity * 100) / 100,
    });
  }

  const totalAmount =
    Math.round(orderItemsToInsert.reduce((sum, i) => sum + i.subtotal, 0) * 100) / 100;

  // Retry on the (very unlikely) chance of a reference collision. The DB's
  // unique constraint is what actually guarantees uniqueness.
  let order: { id: string; order_number: string } | null = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_number: generateOrderNumber(),
        customer_name: `${firstName} ${lastName}`,
        customer_phone: phone,
        customer_email: email || null,
        customer_address: address,
        customer_city: city,
        notes: notes || null,
        total_amount: totalAmount,
      })
      .select("id, order_number")
      .single();

    if (!error && data) {
      order = data;
      break;
    }
    if (error && error.code !== "23505") {
      console.error("[/api/orders] Failed to create order:", error);
      return NextResponse.json({ error: "Impossible de créer la commande." }, { status: 500 });
    }
  }

  if (!order) {
    return NextResponse.json({ error: "Impossible de créer la commande." }, { status: 500 });
  }

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemsToInsert.map((i) => ({ ...i, order_id: order!.id })));

  if (itemsError) {
    console.error("[/api/orders] Failed to create order items:", itemsError);
    await supabase.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: "Impossible d'enregistrer les articles." }, { status: 500 });
  }

  return NextResponse.json({ id: order.id, order_number: order.order_number });
}