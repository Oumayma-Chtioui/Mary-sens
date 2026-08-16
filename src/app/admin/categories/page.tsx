import { createClient } from "@/lib/supabase/server";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/categories";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("position");

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl">Catégories</h1>

      <div className="mb-10 border border-border bg-ivoire p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.08em] text-ink/60">Nouvelle catégorie</h2>
        <form action={createCategory} className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_2fr_auto]">
          <input name="name" required placeholder="Nom" className="border border-ink/20 bg-transparent px-4 py-2.5 text-sm" />
          <input name="description" placeholder="Description (optionnelle)" className="border border-ink/20 bg-transparent px-4 py-2.5 text-sm" />
          <button type="submit" className="btn btn-dark">Ajouter</button>
        </form>
      </div>

      <div className="flex flex-col gap-3">
        {(categories ?? []).map((c) => (
          <form key={c.id} action={updateCategory.bind(null, c.id)} className="grid grid-cols-1 items-center gap-3 border border-border bg-ivoire p-5 sm:grid-cols-[1fr_2fr_auto_auto_auto]">
            <input name="name" defaultValue={c.name} className="border border-ink/20 bg-transparent px-3 py-2 text-sm" />
            <input name="description" defaultValue={c.description ?? ""} className="border border-ink/20 bg-transparent px-3 py-2 text-sm" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_visible" defaultChecked={c.is_visible} className="h-4 w-4 accent-or-deep" /> Visible
            </label>
            <button type="submit" className="btn btn-ghost">Enregistrer</button>
            <button formAction={deleteCategory.bind(null, c.id)} className="text-[12px] uppercase tracking-[0.06em] text-argile/70 hover:text-argile">
              Supprimer
            </button>
          </form>
        ))}
        {(!categories || categories.length === 0) && (
          <p className="text-sm text-ink/45">Aucune catégorie pour le moment.</p>
        )}
      </div>
    </div>
  );
}
