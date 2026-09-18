import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import AddToCartButton from "@/components/site/AddToCartButton";

export default function ProductCard({ product }: { product: Product }) {
  const primaryImage =
    product.images?.find((i) => i.is_primary)?.url ?? product.images?.[0]?.url;

  return (
    <div className="overflow-hidden rounded-lg border border-[#e7dfd0] bg-[#f7f4ec]">
      <Link href={`/catalogue/${product.slug}`} className="block">
        <div className="relative h-36 bg-black/5">
          {primaryImage ? (
            <Image src={primaryImage} alt={product.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-ink/30">
              Image à venir
            </div>
          )}
          {!product.is_available && (
            <span className="absolute left-3 top-3 rounded-full bg-black/80 px-2.5 py-1 text-[10px] uppercase tracking-[0.08em] text-white/70">
              Indisponible
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-col gap-1 p-3">
        <Link href={`/catalogue/${product.slug}`}>
          <h3 className="text-sm font-medium text-ink hover:text-or-deep">{product.name}</h3>
        </Link>
        <p className="text-xs text-ink/55">{product.category?.name ?? "100% Pure et Bio"}</p>
        <div className="flex items-center justify-between pt-2">
          {product.price_visible && product.price != null ? (
            <span className="font-semibold text-ink">{formatPrice(product.price)}</span>
          ) : (
            <span className="text-[11px] uppercase tracking-[0.06em] text-ink/40">Sur demande</span>
          )}
          {product.is_available ? (
            <AddToCartButton product={product} size="compact" />
          ) : (
            <Link
              href={`/catalogue/${product.slug}`}
              className="rounded-full border border-or px-3 py-1 text-[11px] text-or transition-colors hover:bg-or hover:text-black"
            >
              Découvrir
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}