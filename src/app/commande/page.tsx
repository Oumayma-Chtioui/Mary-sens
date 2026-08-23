"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const { items, total, hasHiddenPrices, clear } = useCart();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (items.length === 0 && status !== "submitting") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-black px-6 text-center">
        <p className="font-display text-2xl text-white">Votre panier est vide</p>
        <p className="max-w-sm text-sm text-white/50">Ajoutez des produits avant de passer commande.</p>
        <Link href="/catalogue" className="rounded-full bg-or px-8 py-3 font-medium text-black">
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: formData.get("customer_name"),
          customer_phone: formData.get("customer_phone"),
          customer_email: formData.get("customer_email") || null,
          customer_address: formData.get("customer_address"),
          customer_city: formData.get("customer_city"),
          notes: formData.get("notes") || null,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? "Une erreur est survenue. Veuillez réessayer.");
        setStatus("error");
        return;
      }

      clear();
      router.push(`/commande/confirmation/${data.id}`);
    } catch {
      setErrorMessage("Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-black px-6 py-10 md:px-12">
      <div className="mb-8 flex flex-col items-center gap-1 text-center">
        <span className="text-xs uppercase tracking-[0.28em] text-or">Dernière étape</span>
        <h1 className="font-display text-4xl font-semibold text-white">Finaliser la commande</h1>
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 md:grid-cols-[1.1fr_1fr]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <Field label="Nom complet" name="customer_name" placeholder="Votre nom et prénom" required />
          <Field label="Téléphone" name="customer_phone" type="tel" placeholder="XX XXX XXX" required />
          <Field label="Email (optionnel)" name="customer_email" type="email" placeholder="votre@email.com" />
          <Field label="Adresse" name="customer_address" placeholder="Rue, numéro, quartier..." required />
          <Field label="Ville" name="customer_city" placeholder="Votre ville" required />
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-white">Notes (optionnel)</span>
            <textarea
              name="notes"
              rows={3}
              placeholder="Précisions pour la livraison, disponibilités..."
              className="resize-none rounded-lg border border-white/35 bg-black px-4 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-or"
            />
          </label>

          {status === "error" && (
            <p className="rounded-lg border border-argile/40 bg-argile/10 px-4 py-3 text-sm text-argile">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-or py-4 text-base font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {status === "submitting" ? "Envoi en cours…" : "Confirmer la commande"}
            {status !== "submitting" && <ArrowRight className="size-5" />}
          </button>
          <p className="text-center text-xs text-white/40">
            Votre commande sera transmise directement à Mary&apos;sens. Aucun paiement en ligne n&apos;est requis à cette étape.
          </p>
        </form>

        <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0a0a0a] p-6">
          <h2 className="font-display text-lg text-white">Récapitulatif</h2>
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-white/5">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="text-sm text-white">{item.name}</span>
                  <span className="text-xs text-white/45">Qté : {item.quantity}</span>
                </div>
                <span className="text-sm font-medium text-or">
                  {item.priceVisible && item.unitPrice != null
                    ? formatPrice(item.unitPrice * item.quantity)
                    : "—"}
                </span>
              </div>
            ))}
          </div>
          <div className="h-px w-full bg-white/10" />
          {hasHiddenPrices && (
            <p className="text-xs text-white/50">
              Le prix de certains articles vous sera confirmé par Mary&apos;sens.
            </p>
          )}
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">Total</span>
            <span className="font-display text-2xl font-semibold text-or">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-white">{label}</span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        className="rounded-lg border border-white/35 bg-black px-4 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-or"
      />
    </label>
  );
}
