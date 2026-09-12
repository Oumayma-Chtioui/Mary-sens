"use client";

import { useState } from "react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import type { Product } from "@/lib/types";

export default function AddToCartButton({
  product,
  size = "default",
}: {
  product: Product;
  size?: "default" | "compact";
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!product.is_available) return null;

  function handleAdd(qty: number) {
    const image = product.images?.find((i) => i.is_primary)?.url ?? product.images?.[0]?.url ?? null;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image,
        unitPrice: product.price,
        priceVisible: product.price_visible,
      },
      qty
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  }

  if (size === "compact") {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          handleAdd(1);
        }}
        aria-label="Ajouter au panier"
        className="flex size-8 items-center justify-center rounded-full bg-or text-black transition-transform hover:scale-105"
      >
        {justAdded ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center rounded-full border border-white/25">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="flex size-10 items-center justify-center text-or"
          aria-label="Diminuer la quantité"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-8 text-center font-semibold text-white">{quantity}</span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="flex size-10 items-center justify-center text-or"
          aria-label="Augmenter la quantité"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => handleAdd(quantity)}
        className="flex items-center justify-center gap-2 rounded-full border border-or px-6 py-3 text-sm font-medium text-or transition-colors hover:bg-or hover:text-black"
      >
        {justAdded ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
        {justAdded ? "Ajouté au panier" : "Ajouter au panier"}
      </button>
    </div>
  );
}