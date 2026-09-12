"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";

export default function CartIndicator() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/panier"
      aria-label="Voir le panier"
      className="relative flex size-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-or hover:text-or"
    >
      <ShoppingBag className="size-4" />
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-or text-[10px] font-semibold text-black">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </Link>
  );
}