export function buildWhatsAppLink(
  whatsappNumber: string,
  message: string
): string {
  const digitsOnly = whatsappNumber.replace(/\D/g, "");
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${digitsOnly}?text=${encoded}`;
}

export function productOrderMessage(productName: string, quantity = 1) {
  if (quantity > 1) {
    return `Bonjour Mary'sens, je souhaite commander le produit : ${productName} (x${quantity}).`;
  }
  return `Bonjour Mary'sens, je souhaite commander le produit : ${productName}.`;
}

export type CartLine = { name: string; quantity: number };

export function cartOrderMessage(lines: CartLine[]) {
  const items = lines
    .map((l) => `- ${l.name}${l.quantity > 1 ? ` x${l.quantity}` : ""}`)
    .join("\n");
  return `Bonjour Mary'sens, je souhaite commander :\n${items}`;
}

export function generalContactMessage() {
  return "Bonjour Mary'sens, j'aimerais avoir plus d'informations.";
}