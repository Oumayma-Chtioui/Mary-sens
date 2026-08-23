"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
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
    <div className="flex items-center gap-6">
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-white/50">Quantité</span>
        <div className="flex items-center rounded-full border border-white/25">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex size-10 items-center justify-center rounded-full text-or"
            aria-label="Diminuer la quantité"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-10 text-center font-semibold text-white">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex size-10 items-center justify-center rounded-full text-or"
            aria-label="Augmenter la quantité"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-or px-8 py-4 text-base font-semibold text-black transition-opacity hover:opacity-90"
      >
        <ShoppingCart className="size-5" />
        Commander sur WhatsApp
      </a>
    </div>
  );
}
