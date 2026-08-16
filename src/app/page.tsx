import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { buildWhatsAppLink, generalContactMessage } from "@/lib/whatsapp";
import ProductCard from "@/components/site/ProductCard";
import DropMark from "@/components/site/DropMark";

export const revalidate = 300;

export default async function HomePage() {
  const settings = await getSiteSettings();
  const featured = await getProducts({ featuredOnly: true });
  const waLink = buildWhatsAppLink(settings.whatsapp_number, generalContactMessage());

  return (
    <>
      {/* HERO */}
      <section className="grid min-h-[86vh] grid-cols-1 md:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-center gap-6 px-6 py-16 md:px-16">
          <div className="eyebrow flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-or-deep" />
            Marque tunisienne · 🇹🇳 Fabriqué en Tunisie
          </div>
          <h1 className="font-display text-[52px] font-medium leading-[0.95] md:text-[88px]">
            {settings.hero_title}
          </h1>
          <p className="font-script text-3xl text-or-deep md:text-[34px]">{settings.hero_tagline}</p>
          <p className="max-w-[440px] text-[16.5px] leading-relaxed text-ink/75">
            {settings.hero_description}
          </p>
          <div className="mt-2 flex flex-wrap gap-4">
            <Link href="/catalogue" className="btn btn-dark">{settings.hero_cta_primary}</Link>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              {settings.hero_cta_secondary}
            </a>
          </div>
        </div>
        <div className="relative flex min-h-[380px] items-center justify-center overflow-hidden bg-[radial-gradient(120%_120%_at_30%_20%,#1c1915_0%,#141210_60%)] p-6">
          <DropMark className="absolute -right-14 -top-14 w-64 opacity-10" />
          <Image
            src="/images/rollon.png"
            alt="Roll-on Anti-Âge Mary'sens"
            width={420}
            height={560}
            className="h-auto max-h-[640px] w-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
            priority
          />
        </div>
      </section>

      <div className="divider-motif">
        <DropMark />
      </div>

      {/* BRAND INTRO */}
      <section className="bg-noir py-24 md:py-32">
        <div className="wrap grid grid-cols-1 gap-12 md:grid-cols-[1.2fr_1fr] md:gap-20">
          <p className="font-display text-3xl font-normal leading-[1.28] text-ivoire md:text-[44px]">
            La marque tunisienne de référence des huiles essentielles et végétales,{" "}
            <em className="font-script not-italic text-or-clair">100% pures et bio</em> — pensée pour ceux qui
            préfèrent la matière première à la promesse marketing.
          </p>
          <div className="flex flex-col gap-8">
            <div className="border-t border-or-clair/25 pt-5">
              <h3 className="mb-2 font-display text-xl text-or-clair">Pureté</h3>
              <p className="max-w-[380px] text-[14.5px] leading-relaxed text-ivoire/70">
                Aucun additif superflu. Chaque huile est sélectionnée pour sa qualité botanique avant tout le reste.
              </p>
            </div>
            <div className="border-t border-or-clair/25 pt-5">
              <h3 className="mb-2 font-display text-xl text-or-clair">Origine tunisienne</h3>
              <p className="max-w-[380px] text-[14.5px] leading-relaxed text-ivoire/70">
                Conçue et fabriquée en Tunisie, avec des matières locales : néroli, figue de barbarie, amande douce.
              </p>
            </div>
            <div className="border-t border-or-clair/25 pt-5">
              <h3 className="mb-2 font-display text-xl text-or-clair">Expertise sensorielle</h3>
              <p className="max-w-[380px] text-[14.5px] leading-relaxed text-ivoire/70">
                Chaque formule est pensée comme un rituel — texture, parfum et usage travaillés ensemble.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-border py-16">
          <h2 className="font-display text-4xl font-medium md:text-5xl">Nos essentiels</h2>
          <p className="max-w-[340px] text-sm leading-relaxed text-ink/60">
            Une sélection resserrée plutôt qu&apos;un catalogue infini — chaque produit a une raison d&apos;être
            dans la routine.
          </p>
        </div>
      </section>

      <section className="wrap !px-0 md:!px-12">
        {featured.length > 0 ? (
          <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border px-8 py-16 text-center text-sm text-ink/50">
            Aucun produit mis en avant pour le moment. Ajoutez-en depuis l&apos;administration
            (Produits → Mettre en avant).
          </div>
        )}
      </section>

      {/* PROMISE STRIP */}
      <div className="mt-24 border-y border-border bg-ivoire-2 py-9">
        <div className="wrap flex flex-wrap justify-between gap-6">
          {["100% pur & bio", "Fabriqué en Tunisie", "Sans sels d'aluminium", "Commande par WhatsApp"].map((t) => (
            <span key={t} className="flex items-center gap-2.5 text-[12.5px] font-medium uppercase tracking-[0.08em]">
              <DropMark className="h-4 w-4" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* CTA BAND */}
      <section className="py-32 text-center">
        <div className="wrap">
          <div className="eyebrow mb-5 flex justify-center">Simple & direct</div>
          <h2 className="mx-auto max-w-[760px] font-display text-4xl font-medium leading-[1.15] md:text-6xl">
            Un produit qui vous parle ? On finalise ça sur WhatsApp.
          </h2>
          <p className="mx-auto mt-5 max-w-[480px] text-[15px] leading-relaxed text-ink/60">
            Pas de panier compliqué — écrivez-nous le nom du produit et on s&apos;occupe du reste.
          </p>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-9 inline-flex">
            Commander sur WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
