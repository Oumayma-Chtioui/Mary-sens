"use client";

import { useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import type { Product } from "@/lib/types";

export default function AddToCartButton({
  product,
  quantity = 1,
  size = "default",
}: {
  product: Product;
  quantity?: number;
  size?: "default" | "compact";
}) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  if (!product.is_available) return null;

  function handleAdd() {
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
      quantity
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
          handleAdd();
        }}
        aria-label="Ajouter au panier"
        className="flex size-8 items-center justify-center rounded-full bg-or text-black transition-transform hover:scale-105"
      >
        {justAdded ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="flex items-center justify-center gap-2 rounded-full border border-or px-6 py-3 text-sm font-medium text-or transition-colors hover:bg-or hover:text-black"
    >
      {justAdded ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
      {justAdded ? "Ajouté au panier" : "Ajouter au panier"}
    </button>
  );
}
