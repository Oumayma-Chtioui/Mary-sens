"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, PackageSearch } from "lucide-react";

export default function TrackOrderForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "searching" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("searching");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const orderNumber = String(formData.get("orderNumber") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();

    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? "Commande introuvable.");
        setStatus("error");
        return;
      }

      router.push(`/commande/confirmation/${data.id}`);
    } catch {
      setErrorMessage("Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.");
      setStatus("error");
    }
  }

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-black px-6 py-14">
      <div className="flex size-16 items-center justify-center rounded-full bg-or/15">
        <PackageSearch className="size-8 text-or" />
      </div>
      <h1 className="mt-4 font-display text-3xl font-semibold text-white md:text-4xl">Suivre ma commande</h1>
      <p className="mt-2 max-w-sm text-center text-sm text-white/55">
        Entrez la référence de votre commande et le numéro de téléphone utilisé lors de la commande.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex w-full max-w-sm flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white">Référence de commande</span>
          <input
            type="text"
            name="orderNumber"
            placeholder="MS-000123"
            required
            className="rounded-lg border border-white/35 bg-black px-4 py-2.5 text-sm uppercase tracking-wide text-white outline-none placeholder:text-white/35 placeholder:normal-case focus:border-or"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white">Numéro de téléphone</span>
          <input
            type="tel"
            name="phone"
            placeholder="XX XXX XXX"
            required
            className="rounded-lg border border-white/35 bg-black px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-or"
          />
        </label>

        {status === "error" && (
          <p className="rounded-lg border border-argile/40 bg-argile/10 px-4 py-3 text-sm text-argile">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "searching"}
          className="mt-2 flex items-center justify-center gap-2 rounded-full bg-or py-3.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <Search className="size-4" />
          {status === "searching" ? "Recherche en cours…" : "Trouver ma commande"}
        </button>
      </form>
    </div>
  );
}