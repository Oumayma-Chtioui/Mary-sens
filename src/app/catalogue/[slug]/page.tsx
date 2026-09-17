import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { formatPrice } from "@/lib/utils";
import OrderOnWhatsApp from "@/components/site/OrderOnWhatsApp";
import ProductAccordion from "@/components/site/ProductAccordion";
import AddToCartButton from "@/components/site/AddToCartButton";
import { SITE_URL } from "@/lib/site";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const description = product.short_description ?? product.full_description ?? `${product.name} de Mary'sens.`;
  const image = product.images?.find((item) => item.is_primary)?.url ?? product.images?.[0]?.url;
  return {
    title: `${product.name} — Mary'sens`,
    description,
    alternates: { canonical: `/catalogue/${product.slug}` },
    openGraph: {
      title: `${product.name} — Mary'sens`,
      description,
      url: `/catalogue/${product.slug}`,
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
  ]);

  if (!product) notFound();

  const related = await getRelatedProducts(product.category_id, product.id, 4);

  const primaryImage = product.images?.find((i) => i.is_primary)?.url ?? product.images?.[0]?.url;
  const gallery = product.images && product.images.length > 0 ? product.images : [];

  const sections = [
    { title: "Description", content: product.full_description },
    { title: "Bienfaits", content: product.benefits },
    { title: "Composition", content: product.ingredients },
    { title: "Mode d'emploi", content: product.usage_instructions },
    { title: "Précautions", content: product.precautions },
  ].filter((s): s is { title: string; content: string } => Boolean(s.content));

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.short_description ?? product.full_description ?? undefined,
    url: `${SITE_URL}/catalogue/${product.slug}`,
    image: gallery.map((image) => image.url),
    brand: { "@type": "Brand", name: "Mary'sens" },
    category: product.category?.name,
    sku: product.sku ?? undefined,
    offers:
      product.price_visible && product.price != null
        ? {
            "@type": "Offer",
            priceCurrency: "TND",
            price: product.price,
            availability: product.is_available
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            url: `${SITE_URL}/catalogue/${product.slug}`,
          }
        : undefined,
  };

  return (
    <div className="min-h-screen bg-black px-6 py-5 md:px-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="mb-5 flex items-center gap-2 text-xs text-white/50">
        <Link href="/">Accueil</Link>
        <ChevronRight className="size-3" />
        <Link href="/catalogue">Boutique</Link>
        <ChevronRight className="size-3" />
        <span className="text-white">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/15 bg-[#171717]">
            {primaryImage ? (
              <Image src={primaryImage} alt={product.name} fill className="object-cover" priority />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-white/30">Image à venir</div>
            )}
          </div>
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {gallery.map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden rounded-lg border border-white/10">
                  <Image src={img.url} alt={product.name} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-4xl font-bold leading-tight text-white">{product.name}</h1>
            <p className="text-xs text-white/50">{product.category?.name ?? "100% Pure et Bio"}</p>
          </div>

          {product.price_visible && product.price != null && (
            <span className="font-display text-4xl font-bold text-or">{formatPrice(product.price)}</span>
          )}

          {product.short_description && (
            <p className="text-sm leading-relaxed text-white/65">{product.short_description}</p>
          )}

          <div className="flex items-center gap-6">
            {product.volume && (
              <span className="text-sm text-white/55">{product.volume}</span>
            )}
            <span
              className={`flex items-center gap-2 text-sm ${product.is_available ? "text-sauge" : "text-argile"}`}
            >
              {product.is_available ? "En stock" : "Indisponible"}
            </span>
          </div>

          {product.is_available && (
            <div className="flex flex-wrap items-center gap-4">
              <AddToCartButton product={product} />
              {settings.whatsapp_enabled && product.whatsapp_enabled && (
                <div className="flex-1">
                  <OrderOnWhatsApp productName={product.name} whatsappNumber={settings.whatsapp_number} />
                </div>
              )}
            </div>
          )}

          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] uppercase tracking-[0.06em] text-white/55">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {sections.length > 0 && <ProductAccordion sections={sections} />}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-white">Produits Similaires</h2>
            <Link href="/catalogue" className="flex items-center gap-1 text-sm font-medium text-or">
              Voir tout
              <ChevronRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {related.map((p) => {
              const img = p.images?.find((i) => i.is_primary)?.url ?? p.images?.[0]?.url;
              return (
                <Link
                  key={p.id}
                  href={`/catalogue/${p.slug}`}
                  className="rounded-2xl border border-white/15 bg-[#0a0a0a] p-3"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-white/5">
                    {img ? (
                      <Image src={img} alt={p.name} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-white/30">
                        Image à venir
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 p-1 pt-3">
                    <h3 className="font-display text-sm font-semibold text-white">{p.name}</h3>
                    <p className="text-xs text-white/50">100% Pure et Bio</p>
                    {p.price_visible && p.price != null && (
                      <span className="text-base font-bold text-or">{formatPrice(p.price)}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}