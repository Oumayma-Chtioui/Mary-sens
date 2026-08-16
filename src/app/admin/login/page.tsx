import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

async function login(formData: FormData) {
  "use server";
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/admin/login?error=${encodeURIComponent(error.message)}`);
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
            Identifiants incorrects. Réessayez.
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
