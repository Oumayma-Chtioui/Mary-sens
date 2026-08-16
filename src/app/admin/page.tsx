import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = createClient();

  const [{ count: productCount }, { count: categoryCount }, { count: locationCount }, { count: messageCount }, recentProducts, recentMessages] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("locations").select("*", { count: "exact", head: true }),
      supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("products").select("id,name,created_at").order("created_at", { ascending: false }).limit(5),
      supabase.from("contact_messages").select("id,name,subject,created_at").order("created_at", { ascending: false }).limit(5),
    ]);

  const stats = [
    { label: "Produits", value: productCount ?? 0, href: "/admin/produits" },
    { label: "Catégories", value: categoryCount ?? 0, href: "/admin/categories" },
    { label: "Points de vente", value: locationCount ?? 0, href: "/admin/points-de-vente" },
    { label: "Messages non lus", value: messageCount ?? 0, href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl">Tableau de bord</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="border border-border bg-ivoire p-6 transition-colors hover:bg-ivoire-2">
            <p className="font-display text-4xl">{s.value}</p>
            <p className="mt-1 text-[12px] uppercase tracking-[0.08em] text-ink/50">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="border border-border bg-ivoire p-6">
          <h2 className="mb-4 font-display text-xl">Produits récents</h2>
          {recentProducts.data && recentProducts.data.length > 0 ? (
            <ul className="divide-y divide-border">
              {recentProducts.data.map((p) => (
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
          {recentMessages.data && recentMessages.data.length > 0 ? (
            <ul className="divide-y divide-border">
              {recentMessages.data.map((m) => (
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
