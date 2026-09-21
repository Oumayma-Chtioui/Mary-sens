
import { NextResponse } from "next/server";
import { eq, inArray } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { orderItems, orders, products } from "@/db/schema";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
type IncomingItem = { productId: string; quantity: number };

// No ambiguous characters (0/O, 1/I) — these get read aloud over the phone.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateOrderNumber() {
  // Web Crypto API (crypto.getRandomValues) instead of Node's crypto.randomInt
  // — this global exists in both Cloudflare's edge runtime and modern Node,
  // unlike the Node-only `crypto` module import above.
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
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

  const db = getDb();
  let availableProducts;
  try {
    availableProducts = await db
      .select({ id: products.id, name: products.name, price: products.price, is_available: products.is_available, is_published: products.is_published })
      .from(products)
      .where(inArray(products.id, cleanedItems.map((i) => i.productId)));
  } catch (error) {
    console.error("[/api/orders] Failed to fetch products:", error);
    return NextResponse.json({ error: "Erreur lors de la vérification des produits." }, { status: 500 });
  }

  const productById = new Map(availableProducts.map((p) => [p.id, p]));
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
    try {
      const [data] = await db
        .insert(orders)
        .values({
          order_number: generateOrderNumber(),
          customer_name: `${firstName} ${lastName}`,
          customer_phone: phone,
          customer_email: email || null,
          customer_address: address,
          customer_city: city,
          notes: notes || null,
          total_amount: totalAmount,
        })
        .returning({ id: orders.id, order_number: orders.order_number });
      order = data ?? null;
      if (order) break;
    } catch (error) {
      if (!String(error).includes("UNIQUE")) {
        console.error("[/api/orders] Failed to create order:", error);
        return NextResponse.json({ error: "Impossible de créer la commande." }, { status: 500 });
      }
    }
  }

  if (!order) {
    return NextResponse.json({ error: "Impossible de créer la commande." }, { status: 500 });
  }

  try {
    await db.insert(orderItems).values(orderItemsToInsert.map((i) => ({ ...i, order_id: order!.id })));
  } catch (error) {
    console.error("[/api/orders] Failed to create order items:", error);
    await db.delete(orders).where(eq(orders.id, order.id));
    return NextResponse.json({ error: "Impossible d'enregistrer les articles." }, { status: 500 });
  }

  return NextResponse.json({ id: order.id, order_number: order.order_number });
}