import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/rate-limit";

async function login(formData: FormData) {
  "use server";
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  // 5 attempts per IP per 15 minutes.
  const { allowed } = await checkRateLimit(`login:${ip}`, 5, 15 * 60);
  if (!allowed) {
    redirect("/admin/login?error=rate");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect("/admin/login?error=1");
  }
  redirect("/admin");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirectTo?: string }>;
}) {
  const params = await searchParams;

  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-noir px-6 text-ivoire">
        <div className="max-w-sm text-center">
          <p className="font-display text-2xl">Supabase non configuré</p>
          <p className="mt-3 text-sm text-ivoire/60">
            Ajoutez vos identifiants Supabase dans <code>.env.local</code> pour activer
            l&apos;administration. Voir le README.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-noir px-6 text-ivoire">
      <form action={login} className="w-full max-w-sm">
        <p className="eyebrow mb-2 text-or-clair">Administration</p>
        <h1 className="mb-8 font-display text-3xl">Mary&apos;sens</h1>

        {params.error && (
          <p className="mb-5 border border-argile/40 bg-argile/10 px-4 py-3 text-sm text-argile">
            {params.error === "rate"
              ? "Trop de tentatives. Réessayez dans 15 minutes."
              : "Identifiants incorrects. Réessayez."}
          </p>
        )}

        <label className="mb-4 flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-[0.1em] text-ivoire/50">E-mail</span>
          <input
            type="email"
            name="email"
            required
            className="border border-ivoire/25 bg-transparent px-4 py-3 text-sm outline-none focus:border-or-clair"
          />
        </label>
        <label className="mb-6 flex flex-col gap-2">
          <span className="text-[11px] uppercase tracking-[0.1em] text-ivoire/50">Mot de passe</span>
          <input
            type="password"
            name="password"
            required
            className="border border-ivoire/25 bg-transparent px-4 py-3 text-sm outline-none focus:border-or-clair"
          />
        </label>
        <button type="submit" className="btn btn-gold w-full justify-center">Se connecter</button>
      </form>
    </div>
  );
}