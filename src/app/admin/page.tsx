import Link from "next/link";
import { and, asc, count, desc, eq } from "drizzle-orm";
import { categories, contactMessages, locations, orders, products } from "@/db/schema";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import type { OrderStatus } from "@/lib/types";
import RecentOrdersList from "@/components/admin/RecentOrdersList";

export default async function AdminDashboard() {
  await requireAdmin();
  const db = getDb();

  const [
    [{ c: productCount }],
    [{ c: categoryCount }],
    [{ c: locationCount }],
    [{ c: messageCount }],
    [{ c: newOrderCount }],
    recentProducts,
    recentMessages,
    recentOrders,
  ] = await Promise.all([
    db.select({ c: count() }).from(products),
    db.select({ c: count() }).from(categories),
    db.select({ c: count() }).from(locations),
    db.select({ c: count() }).from(contactMessages).where(eq(contactMessages.status, "new")),
    db.select({ c: count() }).from(orders).where(eq(orders.status, "Nouvelle")),
    db.select({ id: products.id, name: products.name, created_at: products.created_at }).from(products).orderBy(desc(products.created_at)).limit(5),
    db.select({ id: contactMessages.id, name: contactMessages.name, subject: contactMessages.subject, created_at: contactMessages.created_at }).from(contactMessages).orderBy(desc(contactMessages.created_at)).limit(5),
    db.select({ id: orders.id, order_number: orders.order_number, customer_name: orders.customer_name, total_amount: orders.total_amount, status: orders.status, created_at: orders.created_at }).from(orders).orderBy(desc(orders.created_at)).limit(15),
  ]);

  const stats = [
    { label: "Commandes nouvelles", value: newOrderCount ?? 0, href: "/admin/commandes" },
    { label: "Produits", value: productCount ?? 0, href: "/admin/produits" },
    { label: "Catégories", value: categoryCount ?? 0, href: "/admin/categories" },
    { label: "Points de vente", value: locationCount ?? 0, href: "/admin/points-de-vente" },
    { label: "Messages non lus", value: messageCount ?? 0, href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl">Tableau de bord</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="border border-border bg-ivoire p-6 transition-colors hover:bg-ivoire-2">
            <p className="font-display text-4xl">{s.value}</p>
            <p className="mt-1 text-[12px] uppercase tracking-[0.08em] text-ink/50">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <RecentOrdersList orders={recentOrders.map((order) => ({ ...order, status: order.status as OrderStatus }))} />
        <div className="border border-border bg-ivoire p-6">
          <h2 className="mb-4 font-display text-xl">Produits récents</h2>
          {recentProducts.length > 0 ? (
            <ul className="divide-y divide-border">
              {recentProducts.map((p) => (
                <li key={p.id} className="py-3 text-sm">
                  <Link href={`/admin/produits/${p.id}`} className="hover:text-or-deep">{p.name}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink/45">Aucun produit pour le moment.</p>
          )}
        </div>
        <div className="border border-border bg-ivoire p-6">
          <h2 className="mb-4 font-display text-xl">Messages récents</h2>
          {recentMessages.length > 0 ? (
            <ul className="divide-y divide-border">
              {recentMessages.map((m) => (
                <li key={m.id} className="py-3 text-sm">
                  <Link href="/admin/messages" className="hover:text-or-deep">
                    {m.name} {m.subject ? `— ${m.subject}` : ""}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink/45">Aucun message pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
}