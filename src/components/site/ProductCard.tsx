import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({ product }: { product: Product }) {
  const primaryImage =
    product.images?.find((i) => i.is_primary)?.url ?? product.images?.[0]?.url;

  return (
    <Link href={`/catalogue/${product.slug}`} className="group flex flex-col bg-ivoire transition-colors hover:bg-ivoire-2">
      <div className="relative aspect-[1/1.08] overflow-hidden bg-ivoire-2">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink/30">
            Image à venir
          </div>
        )}
        {!product.is_available && (
          <span className="absolute left-3 top-3 bg-noir px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-or-clair">
            Indisponible
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {product.category && <span className="eyebrow text-[10.5px]">{product.category.name}</span>}
        <h3 className="font-display text-lg leading-tight">{product.name}</h3>
        {product.short_description && (
          <p dir="auto" className="flex-1 text-[13px] leading-relaxed text-ink/60">{product.short_description}</p>
        )}
        <div className="mt-2 flex items-center justify-between">
          {product.price_visible && product.price != null ? (
            <span className="text-sm font-medium">{formatPrice(product.price)}</span>
          ) : (
            <span className="text-[11px] uppercase tracking-[0.08em] text-ink/40">Sur demande</span>
          )}
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-or-deep">
            Découvrir
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3 w-3 transition-transform group-hover:translate-x-1">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
