import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";
import { formatPrice, cx } from "@/lib/utils";

const STATUS_BADGE: Record<OrderStatus, string> = {
  Nouvelle: "bg-or-clair/50 text-ink",
  Confirmée: "bg-or/20 text-or-deep",
  "En préparation": "bg-or/20 text-or-deep",
  Expédiée: "bg-sauge/15 text-sauge",
  Livrée: "bg-sauge/20 text-sauge",
  Annulée: "bg-argile/15 text-argile",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  // PostgREST treats commas, parentheses and quotes as filter syntax inside
  // .or(), so strip them rather than interpolating raw user input.
  const rawSearch = (params.q ?? "").slice(0, 100);
  const safeSearch = rawSearch.replace(/[,()*:"'\\%]/g, "").trim();

  let query = supabase
    .from("orders")
    .select("id, order_number, customer_name, customer_phone, total_amount, status, created_at, items:order_items(id)");

  // Only accept a status that's actually one of ours.
  if (params.status && (ORDER_STATUSES as string[]).includes(params.status)) {
    query = query.eq("status", params.status);
  }

  if (safeSearch) {
    query = query.or(
      `order_number.ilike.%${safeSearch}%,customer_name.ilike.%${safeSearch}%,customer_phone.ilike.%${safeSearch}%`
    );
  }
  query = query.order("created_at", { ascending: params.sort === "asc" });
  
  const { data: orders } = await query;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl">Commandes</h1>
      </div>

      <form className="mb-6 flex flex-wrap items-center gap-3" action="/admin/commandes">
        <input
          type="text"
          name="q"
          defaultValue={params.q}
          placeholder="Rechercher (référence, nom, téléphone)…"
          className="min-w-[240px] flex-1 border border-ink/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-or-deep"
        />
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="border border-ink/20 bg-transparent px-4 py-2.5 text-sm"
        >
          <option value="">Tous les statuts</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          name="sort"
          defaultValue={params.sort ?? "desc"}
          className="border border-ink/20 bg-transparent px-4 py-2.5 text-sm"
        >
          <option value="desc">Plus récentes d&apos;abord</option>
          <option value="asc">Plus anciennes d&apos;abord</option>
        </select>
        <button type="submit" className="btn btn-dark">Filtrer</button>
        {(params.q || params.status || params.sort) && (
          <Link href="/admin/commandes" className="text-[12px] uppercase tracking-[0.06em] text-ink/45 hover:text-ink">
            Réinitialiser
          </Link>
        )}
      </form>

      {orders && orders.length > 0 ? (
        <div className="overflow-x-auto border border-border bg-ivoire">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-ivoire-2 text-[11px] uppercase tracking-[0.08em] text-ink/50">
              <tr>
                <th className="px-5 py-3">Référence</th>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Téléphone</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Articles</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3.5">
                    <Link href={`/admin/commandes/${o.id}`} className="font-medium hover:text-or-deep">
                      {o.order_number}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">{o.customer_name}</td>
                  <td className="px-5 py-3.5 text-ink/60">{o.customer_phone}</td>
                  <td className="px-5 py-3.5 text-ink/60">
                    {new Date(o.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5 text-ink/60">{o.items?.length ?? 0}</td>
                  <td className="px-5 py-3.5 font-medium">{formatPrice(o.total_amount)}</td>
                  <td className="px-5 py-3.5">
                    <span className={cx("rounded-full px-2.5 py-1 text-[11px] font-medium", STATUS_BADGE[o.status as OrderStatus])}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border border-dashed border-border px-8 py-16 text-center text-sm text-ink/50">
          {params.q || params.status ? "Aucune commande ne correspond à ces critères." : "Aucune commande pour le moment."}
        </div>
      )}
    </div>
  );
}
