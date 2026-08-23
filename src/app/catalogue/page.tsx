import Link from "next/link";
import type { Metadata } from "next";
import { Search } from "lucide-react";
import { getCategories, getProducts } from "@/lib/queries";
import ProductCard from "@/components/site/ProductCard";
import { cx } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Boutique — Mary'sens",
  description: "Huiles essentielles, huiles végétales, soins et bien-être Mary'sens.",
};

export const revalidate = 120;

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string; q?: string }>;
}) {
  const params = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug: params.categorie, search: params.q }),
  ]);

  return (
    <div className="min-h-screen bg-black px-6 py-10 md:px-12">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-[10px] uppercase tracking-[0.28em] text-or">
          Collection naturelle · 100% pure &amp; bio
        </p>
        <h1 className="font-display text-4xl font-semibold text-white">Notre Boutique</h1>
        <p className="text-sm text-white/50">Découvrez nos huiles et soins 100% naturels et bio</p>
      </div>

      <form
        className="mx-auto mt-6 flex w-full max-w-sm items-center rounded-full border border-white/15 bg-[#0a0a0a] px-4"
        action="/catalogue"
      >
        {params.categorie && <input type="hidden" name="categorie" value={params.categorie} />}
        <Search className="size-4 text-white/40" />
        <input
          type="text"
          name="q"
          defaultValue={params.q}
          placeholder="Rechercher un produit…"
          className="w-full bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/35"
        />
      </form>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/catalogue"
          className={cx(
            "rounded-full border px-5 py-2 text-sm",
            !params.categorie ? "border-or bg-or text-black" : "border-white/15 text-white/75 hover:border-white/40"
          )}
        >
          Tous
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/catalogue?categorie=${c.slug}`}
            className={cx(
              "rounded-full border px-5 py-2 text-sm",
              params.categorie === c.slug
                ? "border-or bg-or text-black"
                : "border-white/15 text-white/75 hover:border-white/40"
            )}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 px-8 py-20 text-center">
            <p className="font-display text-xl text-white">Aucun produit trouvé</p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-white/50">
              {categories.length === 0
                ? "La boutique est vide pour le moment. Ajoutez vos produits depuis l'administration."
                : "Essayez une autre recherche ou une autre catégorie."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
