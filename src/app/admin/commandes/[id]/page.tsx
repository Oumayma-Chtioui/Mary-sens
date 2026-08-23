import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateOrderStatus } from "@/lib/actions/orders";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/lib/types";
import { formatPrice, cx } from "@/lib/utils";

const STATUS_BADGE: Record<OrderStatus, string> = {
  Nouvelle: "bg-or-clair/50 text-ink",
  Confirmée: "bg-or/20 text-or-deep",
  "En préparation": "bg-or/20 text-or-deep",
  Expédiée: "bg-sauge/15 text-sauge",
  Livrée: "bg-sauge/20 text-sauge",
  Annulée: "bg-argile/15 text-argile",
};

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", id)
    .single();

  if (!order) notFound();

  const typedOrder = order as Order;

  async function setStatus(formData: FormData) {
    "use server";
    const status = String(formData.get("status")) as OrderStatus;
    await updateOrderStatus(id, status);
  }

  return (
    <div>
      <Link href="/admin/commandes" className="mb-6 inline-block text-[12px] uppercase tracking-[0.06em] text-ink/45 hover:text-ink">
        ← Toutes les commandes
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">{typedOrder.order_number}</h1>
          <p className="mt-1 text-sm text-ink/50">
            {new Date(typedOrder.created_at).toLocaleDateString("fr-FR", {
              day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>
        <span className={cx("rounded-full px-3 py-1.5 text-sm font-medium", STATUS_BADGE[typedOrder.status])}>
          {typedOrder.status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-6">
          <div className="border border-border bg-ivoire p-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.08em] text-ink/60">Articles commandés</h2>
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-[11px] uppercase tracking-[0.06em] text-ink/45">
                <tr>
                  <th className="pb-2">Produit</th>
                  <th className="pb-2">Prix unitaire</th>
                  <th className="pb-2">Quantité</th>
                  <th className="pb-2 text-right">Sous-total</th>
                </tr>
              </thead>
              <tbody>
                {typedOrder.items?.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="py-3">{item.product_name}</td>
                    <td className="py-3 text-ink/60">{formatPrice(item.unit_price)}</td>
                    <td className="py-3 text-ink/60">{item.quantity}</td>
                    <td className="py-3 text-right font-medium">{formatPrice(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-ink/60">Total</span>
              <span className="font-display text-xl">{formatPrice(typedOrder.total_amount)}</span>
            </div>
          </div>

          <div className="border border-border bg-ivoire p-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.08em] text-ink/60">Mettre à jour le statut</h2>
            <form action={setStatus} className="flex flex-wrap items-center gap-3">
              <select
                name="status"
                defaultValue={typedOrder.status}
                className="border border-ink/20 bg-transparent px-4 py-2.5 text-sm"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button type="submit" className="btn btn-dark">Enregistrer</button>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="border border-border bg-ivoire p-6">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.08em] text-ink/60">Client</h2>
            <dl className="flex flex-col gap-3 text-sm">
              <Row label="Nom" value={typedOrder.customer_name} />
              <Row label="Téléphone" value={typedOrder.customer_phone} href={`tel:${typedOrder.customer_phone}`} />
              {typedOrder.customer_email && (
                <Row label="Email" value={typedOrder.customer_email} href={`mailto:${typedOrder.customer_email}`} />
              )}
              <Row label="Adresse" value={typedOrder.customer_address} />
              <Row label="Ville" value={typedOrder.customer_city} />
              {typedOrder.notes && <Row label="Notes" value={typedOrder.notes} />}
            </dl>
          </div>

          <Link
            href={`/commande/confirmation/${typedOrder.id}`}
            target="_blank"
            className="text-center text-[12px] uppercase tracking-[0.06em] text-or-deep hover:underline"
          >
            Voir la page de confirmation client ↗
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex flex-col gap-1 border-t border-border pt-3 first:border-0 first:pt-0">
      <dt className="text-[11px] uppercase tracking-[0.08em] text-ink/40">{label}</dt>
      <dd>
        {href ? (
          <a href={href} className="hover:text-or-deep">{value}</a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
