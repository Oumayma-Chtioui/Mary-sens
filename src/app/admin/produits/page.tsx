import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteProduct, duplicateProduct, togglePublish } from "@/lib/actions/products";

export default async function AdminProductsPage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id,name,is_published,is_featured,is_available,price,category:categories(name)")
    .order("position", { ascending: true });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl">Produits</h1>
        <Link href="/admin/produits/nouveau" className="btn btn-dark">Nouveau produit</Link>
      </div>

      {products && products.length > 0 ? (
        <div className="overflow-x-auto border border-border bg-ivoire">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-ivoire-2 text-[11px] uppercase tracking-[0.08em] text-ink/50">
              <tr>
                <th className="px-5 py-3">Nom</th>
                <th className="px-5 py-3">Catégorie</th>
                <th className="px-5 py-3">Statut</th>
                <th className="px-5 py-3">Mis en avant</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/produits/${p.id}`} className="hover:text-or-deep">{p.name}</Link>
                  </td>
                  <td className="px-5 py-3.5 text-ink/60">{p.category?.name ?? "—"}</td>
                  <td className="px-5 py-3.5">
                    <form action={togglePublish.bind(null, p.id, !p.is_published)}>
                      <button
                        type="submit"
                        className={p.is_published ? "text-sauge" : "text-ink/40"}
                      >
                        {p.is_published ? "Publié" : "Brouillon"}
                      </button>
                    </form>
                  </td>
                  <td className="px-5 py-3.5 text-ink/60">{p.is_featured ? "Oui" : "—"}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex justify-end gap-4 text-[12px] uppercase tracking-[0.06em]">
                      <Link href={`/admin/produits/${p.id}`} className="text-ink/60 hover:text-ink">Modifier</Link>
                      <form action={duplicateProduct.bind(null, p.id)}>
                        <button type="submit" className="text-ink/60 hover:text-ink">Dupliquer</button>
                      </form>
                      <form action={deleteProduct.bind(null, p.id)}>
                        <button type="submit" className="text-argile/70 hover:text-argile">Supprimer</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border border-dashed border-border px-8 py-16 text-center text-sm text-ink/50">
          Aucun produit. <Link href="/admin/produits/nouveau" className="text-or-deep">Créez le premier</Link> ou
          utilisez l&apos;import CSV.
        </div>
      )}
    </div>
  );
}
