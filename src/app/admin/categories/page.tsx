import { asc } from "drizzle-orm";
import { categories } from "@/db/schema";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/categories";
import CategoryForm from "@/components/admin/CategoryForm";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  await requireAdmin();
  const categoryRows = await getDb().select().from(categories).orderBy(asc(categories.position));
  const params = await searchParams;

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl">Catégories</h1>

      {params.success && (
        <p className="mb-6 border border-sauge/40 bg-sauge/10 px-4 py-3 text-sm text-sauge">
          Enregistré avec succès.
        </p>
      )}
      {params.error && (
        <p className="mb-6 border border-argile/40 bg-argile/10 px-4 py-3 text-sm text-argile">
          Erreur : {params.error}
        </p>
      )}

      <div className="mb-10 border border-border bg-ivoire p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.08em] text-ink/60">Nouvelle catégorie</h2>
        <CategoryForm action={createCategory} />
        <p className="mt-2 text-xs text-ink/40">
          Merci d'utiliser une image déjà de taille raisonnable (idéalement sous 500 Ko, format JPG, PNG ou WebP) — les images ne sont plus compressées automatiquement.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {categoryRows.map((c) => (
          <CategoryForm
            key={c.id}
            action={updateCategory.bind(null, c.id)}
            category={c}
            deleteAction={deleteCategory.bind(null, c.id)}
          />
        ))}
        {categoryRows.length === 0 && (
          <p className="text-sm text-ink/45">Aucune catégorie pour le moment.</p>
        )}
      </div>
    </div>
  );
}