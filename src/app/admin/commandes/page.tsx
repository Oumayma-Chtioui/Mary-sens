import Link from "next/link";
import { and, desc, asc, eq, like, or } from "drizzle-orm";
import { orders, orderItems } from "@/db/schema";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
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
  await requireAdmin();
  const params = await searchParams;
  const db = getDb();
  const rawSearch = (params.q ?? "").slice(0, 100);
  const safeSearch = rawSearch.replace(/[%,]/g, "").trim();

  const conditions = [];

  // Only accept a status that's actually one of ours.
  if (params.status && (ORDER_STATUSES as string[]).includes(params.status)) {
    conditions.push(eq(orders.status, params.status));
  }

  if (safeSearch) {
    const pattern = `%${safeSearch}%`;
    conditions.push(or(like(orders.order_number, pattern), like(orders.customer_name, pattern), like(orders.customer_phone, pattern))!);
  }
  const orderRows = await db.select().from(orders).where(conditions.length ? and(...conditions) : undefined).orderBy(params.sort === "asc" ? asc(orders.created_at) : desc(orders.created_at));
  const itemRows = orderRows.length ? await db.select({ id: orderItems.id, order_id: orderItems.order_id }).from(orderItems) : [];
  const itemCountByOrder = new Map<string, number>();
  for (const item of itemRows) itemCountByOrder.set(item.order_id, (itemCountByOrder.get(item.order_id) ?? 0) + 1);

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

      {orderRows.length > 0 ? (
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
              {orderRows.map((o) => (
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
                  <td className="px-5 py-3.5 text-ink/60">{itemCountByOrder.get(o.id) ?? 0}</td>
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
