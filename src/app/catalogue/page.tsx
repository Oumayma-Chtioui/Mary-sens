import Link from "next/link";
import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/queries";
import ProductCard from "@/components/site/ProductCard";
import { cx } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Catalogue — Mary'sens",
  description: "Huiles essentielles, huiles végétales, soins et bien-être Mary'sens.",
};

export const revalidate = 120;

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: { categorie?: string; q?: string };
}) {
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug: searchParams.categorie, search: searchParams.q }),
  ]);

  return (
    <div className="wrap py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-border pb-10">
        <div>
          <span className="eyebrow">Catalogue</span>
          <h1 className="mt-3 font-display text-4xl font-medium md:text-5xl">Tous nos produits</h1>
        </div>
        <form className="flex w-full max-w-xs items-center border border-ink/20 md:w-auto" action="/catalogue">
          {searchParams.categorie && <input type="hidden" name="categorie" value={searchParams.categorie} />}
          <input
            type="text"
            name="q"
            defaultValue={searchParams.q}
            placeholder="Rechercher un produit…"
            className="w-full bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-ink/40"
          />
          <button type="submit" className="px-4 text-ink/60" aria-label="Rechercher">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
        </form>
      </div>

      <div className="mb-12 flex flex-wrap gap-2.5">
        <Link
          href="/catalogue"
          className={cx(
            "px-4 py-2 text-[12.5px] uppercase tracking-[0.08em]",
            !searchParams.categorie ? "bg-noir text-or-clair" : "border border-ink/20 text-ink/70 hover:border-ink/40"
          )}
        >
          Tous
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/catalogue?categorie=${c.slug}`}
            className={cx(
              "px-4 py-2 text-[12.5px] uppercase tracking-[0.08em]",
              searchParams.categorie === c.slug
                ? "bg-noir text-or-clair"
                : "border border-ink/20 text-ink/70 hover:border-ink/40"
            )}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-border px-8 py-20 text-center">
          <p className="font-display text-xl">Aucun produit trouvé</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink/55">
            {categories.length === 0
              ? "Le catalogue est vide pour le moment. Ajoutez vos produits depuis l'administration."
              : "Essayez une autre recherche ou une autre catégorie."}
          </p>
        </div>
      )}
    </div>
  );
}
