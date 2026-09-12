import { NextResponse } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";

type IncomingItem = { productId: string; quantity: number };

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

  const { customer_name, customer_phone, customer_email, customer_address, customer_city, notes, items } = body;

  // --- Basic field validation ---
  if (!customer_name?.trim() || !customer_phone?.trim() || !customer_address?.trim() || !customer_city?.trim()) {
    return NextResponse.json(
      { error: "Merci de renseigner votre nom, téléphone, adresse et ville." },
      { status: 400 }
    );
  }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Votre panier est vide." }, { status: 400 });
  }

  const cleanedItems: IncomingItem[] = [];
  for (const raw of items) {
    const productId = String(raw?.productId ?? "");
    const quantity = Number(raw?.quantity);
    if (!productId || !Number.isFinite(quantity) || quantity < 1 || !Number.isInteger(quantity)) {
      return NextResponse.json({ error: "Un article du panier est invalide." }, { status: 400 });
    }
    cleanedItems.push({ productId, quantity });
  }

  const supabase = createAdminClient();

  // --- Fetch trusted product data server-side. Client-supplied names/prices
  // are never used — only productId + quantity are trusted from the request. ---
  const productIds = cleanedItems.map((i) => i.productId);
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select("id, name, price, is_available, is_published")
    .in("id", productIds);

  if (productsError) {
    return NextResponse.json({ error: "Erreur lors de la vérification des produits." }, { status: 500 });
  }

  const productById = new Map((products ?? []).map((p) => [p.id, p]));

  const orderItemsToInsert: Array<{
    product_id: string;
    product_name: string;
    unit_price: number;
    quantity: number;
    subtotal: number;
  }> = [];

  for (const item of cleanedItems) {
    const product = productById.get(item.productId);
    if (!product || !product.is_published || !product.is_available) {
      return NextResponse.json(
        { error: "Un ou plusieurs produits de votre panier ne sont plus disponibles. Merci de revoir votre panier." },
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

  const totalAmount = Math.round(orderItemsToInsert.reduce((sum, i) => sum + i.subtotal, 0) * 100) / 100;

  // --- Create the order, then its items. If the items insert fails, the
  // order is rolled back (compensating delete) so we never leave an order
  // with no line items. ---
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: customer_name.trim(),
      customer_phone: customer_phone.trim(),
      customer_email: customer_email?.trim() || null,
      customer_address: customer_address.trim(),
      customer_city: customer_city.trim(),
      notes: notes?.trim() || null,
      total_amount: totalAmount,
    })
    .select("id, order_number")
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Impossible de créer la commande. Merci de réessayer." }, { status: 500 });
  }

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemsToInsert.map((i) => ({ ...i, order_id: order.id })));

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: "Impossible d'enregistrer les articles de la commande." }, { status: 500 });
  }

  return NextResponse.json({ id: order.id, order_number: order.order_number });
}