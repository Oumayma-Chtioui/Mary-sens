import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

const navItems = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/produits", label: "Produits" },
  { href: "/admin/categories", label: "Catégories" },
  { href: "/admin/points-de-vente", label: "Points de vente" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/import", label: "Importer (CSV)" },
  { href: "/admin/parametres", label: "Paramètres" },
];

async function logout() {
  "use server";
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return <div className="min-h-screen bg-ivoire">{children}</div>;
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No signed-in user: this is /admin/login rendering without chrome.
  // (The middleware already blocks unauthenticated access to every other
  // /admin route, so this branch is only ever the login screen.)
  if (!user) {
    return <div className="min-h-screen bg-noir">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-ivoire text-ink">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="border-r border-border bg-ivoire-2 px-6 py-8 md:min-h-screen">
          <p className="font-display text-lg">Mary&apos;sens</p>
          <p className="mb-8 text-[11px] uppercase tracking-[0.1em] text-ink/45">Administration</p>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-sm px-3 py-2.5 text-sm text-ink/75 hover:bg-ivoire hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={logout} className="mt-10">
            <button type="submit" className="text-[12px] uppercase tracking-[0.08em] text-ink/45 hover:text-argile">
              Se déconnecter
            </button>
          </form>
        </aside>
        <main className="px-6 py-10 md:px-12 md:py-12">{children}</main>
      </div>
    </div>
  );
}
