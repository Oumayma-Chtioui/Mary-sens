"use client";

import { useState } from "react";
import { buildWhatsAppLink, productOrderMessage } from "@/lib/whatsapp";

export default function OrderOnWhatsApp({
  productName,
  whatsappNumber,
}: {
  productName: string;
  whatsappNumber: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const link = buildWhatsAppLink(whatsappNumber, productOrderMessage(productName, quantity));

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center border border-ink/20">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-3.5 py-2.5 text-sm hover:bg-ivoire-2"
          aria-label="Diminuer la quantité"
        >
          −
        </button>
        <span className="w-10 text-center text-sm">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="px-3.5 py-2.5 text-sm hover:bg-ivoire-2"
          aria-label="Augmenter la quantité"
        >
          +
        </button>
      </div>
      <a href={link} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
        Commander sur WhatsApp
      </a>
    </div>
  );
}
