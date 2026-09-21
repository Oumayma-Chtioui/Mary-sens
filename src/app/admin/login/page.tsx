"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState(params.get("error"));
  const [pending, setPending] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    const formData = new FormData(event.currentTarget);
    const result = await authClient.signIn.email({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });
    if (result.error) {
      setError("1");
      setPending(false);
      return;
    }
    router.push("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-noir px-6 text-ivoire">
      <form onSubmit={login} className="w-full max-w-sm">
        <p className="eyebrow mb-2 text-or-clair">Administration</p>
        <h1 className="mb-8 font-display text-3xl">Mary&apos;sens</h1>

        {error && (
          <p className="mb-5 border border-argile/40 bg-argile/10 px-4 py-3 text-sm text-argile">
            {error === "rate"
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
        <button type="submit" disabled={pending} className="btn btn-gold w-full justify-center">Se connecter</button>
      </form>
    </div>
  );
}