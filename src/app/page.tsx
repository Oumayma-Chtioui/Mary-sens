import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Leaf, ShieldCheck, Truck } from "lucide-react";
import { getCategories, getProducts } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { buildWhatsAppLink, generalContactMessage } from "@/lib/whatsapp";

export const revalidate = 300;

export default async function HomePage() {
  const settings = await getSiteSettings();
  const categories = await getCategories();
  const featured = await getProducts({ featuredOnly: true });
  const waLink = buildWhatsAppLink(settings.whatsapp_number, generalContactMessage());

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[430px] w-full overflow-hidden md:h-[520px]">
        <Image
          src={settings.hero_image}
          alt={settings.hero_title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
        <div className="absolute inset-0 flex flex-col justify-center gap-6 px-6 md:px-16">
          <span className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-or-clair">
            <Leaf className="size-4" />
            100% Pure &amp; Bio
          </span>
          <h1 className="max-w-xl font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
            {settings.hero_title}
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-white/80">
            {settings.hero_description}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/catalogue"
              className="flex h-11 items-center gap-2 rounded-full bg-or px-8 font-medium text-black transition-opacity hover:opacity-90"
            >
              {settings.hero_cta_primary}
              <ArrowRight className="size-4" />
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 items-center rounded-full border border-white/60 px-6 text-white transition-colors hover:bg-white/10"
            >
              {settings.hero_cta_secondary}
            </a>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="bg-black px-6 py-12 md:px-12">
        <div className="mb-8 flex items-end justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-or">Nos Catégories</span>
            <h2 className="font-display text-2xl font-semibold text-white">Explorez notre univers</h2>
          </div>
          <div className="hidden h-px w-40 bg-gradient-to-r from-transparent to-or md:block" />
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/catalogue?categorie=${c.slug}`}
                className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-[#0a0a0a] p-4"
              >
                <div className="relative size-28 overflow-hidden rounded-full border-2 border-white/10 md:size-32">
                  {c.image_url ? (
                    <Image src={c.image_url} alt={c.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-or/10">
                      <Leaf className="size-8 text-or" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <span className="text-sm font-medium text-white">{c.name}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 px-8 py-14 text-center text-sm text-white/45">
            Aucune catégorie pour le moment. Ajoutez-en depuis l&apos;administration.
          </div>
        )}

        {/* FEATURED PRODUCTS */}
        {featured.length > 0 && (
          <div className="mt-14">
            <div className="mb-8 flex items-end justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-[0.2em] text-or">Sélection</span>
                <h2 className="font-display text-2xl font-semibold text-white">Nos essentiels</h2>
              </div>
              <Link href="/catalogue" className="flex items-center gap-1 text-sm font-medium text-or">
                Voir tout
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {featured.map((p) => {
                const image = p.images?.find((i) => i.is_primary)?.url ?? p.images?.[0]?.url;
                return (
                  <Link
                    key={p.id}
                    href={`/catalogue/${p.slug}`}
                    className="overflow-hidden rounded-lg border border-white/10 bg-[#0a0a0a]"
                  >
                    <div className="relative h-36 bg-white/5">
                      {image ? (
                        <Image src={image} alt={p.name} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-white/30">
                          Image à venir
                        </div>
                      )}
                      <span className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-black/70">
                        <Heart className="size-4 text-white/70" />
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 p-3">
                      <h3 className="text-sm font-medium text-white">{p.name}</h3>
                      <p className="text-xs text-white/45">100% Pure et Bio</p>
                      {p.price_visible && p.price != null && (
                        <span className="pt-1 font-semibold text-or">{p.price.toFixed(2)} DT</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* TRUST ROW */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          <TrustItem icon={Leaf} title="100% Bio & Naturel" desc="Sans additifs ni conservateurs" />
          <TrustItem icon={Truck} title="Livraison Tunisie" desc="Partout en 48h" />
          <TrustItem icon={ShieldCheck} title="Qualité Garantie" desc="Pureté certifiée" />
        </div>
      </section>
    </div>
  );
}

function TrustItem({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Leaf;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#0a0a0a] p-4">
      <div className="flex size-11 items-center justify-center rounded-full bg-or/15 text-or">
        <Icon className="size-5" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white">{title}</span>
        <span className="text-xs text-white/50">{desc}</span>
      </div>
    </div>
  );
}
