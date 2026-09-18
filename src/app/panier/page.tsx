"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, itemCount, total, hasHiddenPrices, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 bg-black px-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full border border-white/15">
          <ShoppingBag className="size-7 text-white/40" />
        </div>
        <div>
          <p className="font-display text-2xl text-white">Votre panier est vide</p>
          <p className="mt-2 max-w-sm text-sm text-white/50">
            Découvrez nos huiles essentielles et végétales 100% pures et bio.
          </p>
        </div>
        <Link
          href="/catalogue"
          className="mt-2 flex items-center gap-2 rounded-full bg-or px-8 py-3 font-medium text-black"
        >
          Découvrir la boutique
          <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-6 py-10 md:px-12">
      <div className="mb-8 flex flex-col items-center gap-1 text-center">
        <span className="text-xs uppercase tracking-[0.28em] text-or">Votre sélection</span>
        <h1 className="font-display text-4xl font-semibold text-white">Panier</h1>
        <p className="text-sm text-white/50">
          {itemCount} article{itemCount > 1 ? "s" : ""}
        </p>
      </div>

      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0a0a0a] p-4"
          >
            <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-white/5">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] text-white/30">
                  Sans photo
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-1">
              <Link href={`/catalogue/${item.slug}`} className="text-sm font-medium text-white hover:text-or">
                {item.name}
              </Link>
              {item.priceVisible && item.unitPrice != null ? (
                <span className="text-xs text-white/50">{formatPrice(item.unitPrice)} / unité</span>
              ) : (
                <span className="text-xs text-white/40">Prix sur demande</span>
              )}
            </div>

            <div className="flex items-center rounded-full border border-white/20">
              
              <span className="w-8 text-center text-sm text-white">{item.quantity}</span>
              
            </div>

            <div className="hidden w-20 shrink-0 text-right text-sm font-semibold text-or sm:block">
              {item.priceVisible && item.unitPrice != null
                ? formatPrice(item.unitPrice * item.quantity)
                : "—"}
            </div>

            <button
              type="button"
              onClick={() => removeItem(item.productId)}
              aria-label="Retirer du panier"
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-white/40 transition-colors hover:text-argile"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}

        <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-or/30 bg-[#111111] p-6">
          {hasHiddenPrices && (
            <p className="text-xs text-white/50">
              Le prix de certains articles vous sera confirmé par Mary&apos;sens.
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">Total</span>
            <span className="font-display text-2xl font-semibold text-or">{formatPrice(total)}</span>
          </div>
          <Link
            href="/commande"
            className="flex items-center justify-center gap-2 rounded-full bg-or py-4 text-base font-semibold text-black transition-opacity hover:opacity-90"
          >
            Passer la commande
            <ArrowRight className="size-5" />
          </Link>
          <Link href="/catalogue" className="text-center text-xs text-white/45 hover:text-white/70">
            Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  );
}
