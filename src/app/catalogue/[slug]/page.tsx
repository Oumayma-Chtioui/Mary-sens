import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { formatPrice } from "@/lib/utils";
import OrderOnWhatsApp from "@/components/site/OrderOnWhatsApp";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — Mary'sens`,
    description: product.short_description ?? undefined,
    openGraph: {
      title: `${product.name} — Mary'sens`,
      description: product.short_description ?? undefined,
      images: product.images?.[0]?.url ? [product.images[0].url] : undefined,
    },
  };
}

const infoBlocks: Array<{ key: keyof NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>; title: string }> = [
  { key: "full_description", title: "À propos" },
  { key: "benefits", title: "Bienfaits" },
  { key: "usage_instructions", title: "Mode d'utilisation" },
  { key: "ingredients", title: "Composition" },
  { key: "precautions", title: "Précautions" },
];

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
  ]);

  if (!product) notFound();

  const primaryImage = product.images?.find((i) => i.is_primary)?.url ?? product.images?.[0]?.url;
  const otherImages = (product.images ?? []).filter((i) => i.url !== primaryImage);

  return (
    <div className="wrap py-14">
      <nav className="mb-8 text-xs text-ink/50">
        <Link href="/catalogue" className="hover:text-ink">Catalogue</Link>
        {product.category && (
          <>
            {" / "}
            <Link href={`/catalogue?categorie=${product.category.slug}`} className="hover:text-ink">
              {product.category.name}
            </Link>
          </>
        )}
        {" / "}
        <span className="text-ink/70">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-14 md:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden bg-ivoire-2">
            {primaryImage ? (
              <Image src={primaryImage} alt={product.name} fill className="object-cover" priority />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-ink/30">Image à venir</div>
            )}
          </div>
          {otherImages.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {otherImages.map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden bg-ivoire-2">
                  <Image src={img.url} alt={product.name} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          {product.category && <span className="eyebrow">{product.category.name}</span>}
          <h1 className="font-display text-4xl font-medium leading-tight md:text-5xl">{product.name}</h1>
          {product.short_description && (
            <p dir="auto" className="text-[15.5px] leading-relaxed text-ink/70">{product.short_description}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-ink/60">
            {product.volume && <span>{product.volume}</span>}
            {product.price_visible && product.price != null && (
              <span className="text-lg font-medium text-ink">{formatPrice(product.price)}</span>
            )}
            <span className={product.is_available ? "text-sauge" : "text-argile"}>
              {product.is_available ? "En stock" : "Indisponible"}
            </span>
          </div>

          {product.whatsapp_enabled && product.is_available && (
            <OrderOnWhatsApp productName={product.name} whatsappNumber={settings.whatsapp_number} />
          )}

          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {product.tags.map((tag) => (
                <span key={tag} className="border border-ink/15 px-2.5 py-1 text-[11px] uppercase tracking-[0.06em] text-ink/55">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto mt-20 grid max-w-3xl grid-cols-1 gap-12">
        {infoBlocks.map(({ key, title }) => {
          const value = product[key];
          if (!value || typeof value !== "string") return null;
          return (
            <div key={key} className="border-t border-border pt-8">
              <h2 className="mb-3 font-display text-2xl">{title}</h2>
              <p dir="auto" className="whitespace-pre-line text-[14.5px] leading-relaxed text-ink/70">{value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
