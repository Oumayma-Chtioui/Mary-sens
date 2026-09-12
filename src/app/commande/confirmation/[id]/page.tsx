import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CheckCircle2, ArrowRight, Camera } from "lucide-react";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";
import { ORDER_STATUSES } from "@/lib/types";

export const metadata: Metadata = { title: "Confirmation de commande — Mary'sens" };

const STATUS_COLORS: Record<OrderStatus, string> = {
  Nouvelle: "bg-white/15 text-white",
  Confirmée: "bg-or/20 text-or",
  "En préparation": "bg-or/20 text-or",
  Expédiée: "bg-sauge/20 text-sauge",
  Livrée: "bg-sauge/20 text-sauge",
  Annulée: "bg-argile/20 text-argile",
};

export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-black px-6 text-center text-white/60">
        Supabase n&apos;est pas encore configuré.
      </div>
    );
  }

  // Fetched with the service-role client, server-side only — never exposed
  // to the browser's anon key. Filtered to this exact id, so this can't be
  // used to list or browse other customers' orders.
  const supabase = createAdminClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", id)
    .single();

  if (error || !order) notFound();

  const typedOrder = order as Order;
  const currentStepIndex = ORDER_STATUSES.indexOf(typedOrder.status);

  return (
    <div className="min-h-screen bg-black px-6 py-14 md:px-12">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-or/15">
          <CheckCircle2 className="size-8 text-or" />
        </div>
        <h1 className="font-display text-3xl font-semibold text-white md:text-4xl">
          Votre commande a bien été enregistrée
        </h1>

        <div className="mt-2 flex flex-col items-center gap-3 rounded-2xl border-2 border-or bg-or/10 px-8 py-5">
          <span className="text-xs uppercase tracking-[0.2em] text-white/60">Référence de commande</span>
          <span className="font-display text-3xl font-bold tracking-wide text-or md:text-4xl">
            {typedOrder.order_number}
          </span>
          <span className="flex items-center gap-2 text-xs text-white/60">
            <Camera className="size-3.5 text-or" />
            Faites une capture d&apos;écran ou notez cette référence — elle vous sera demandée pour suivre votre commande.
          </span>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-or/30 bg-[#111111] p-6 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm text-white/60">Statut</span>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[typedOrder.status]}`}>
            {typedOrder.status}
          </span>
        </div>

        {typedOrder.status !== "Annulée" && (
          <div className="mb-8 flex items-center gap-1">
            {ORDER_STATUSES.filter((s) => s !== "Annulée").map((step, i) => (
              <div key={step} className="flex flex-1 items-center gap-1">
                <div
                  className={`h-1.5 flex-1 rounded-full ${
                    i <= currentStepIndex ? "bg-or" : "bg-white/10"
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {typedOrder.items?.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <span className="text-white/80">
                {item.product_name} <span className="text-white/40">× {item.quantity}</span>
              </span>
              <span className="font-medium text-or">{formatPrice(item.subtotal)}</span>
            </div>
          ))}
        </div>

        <div className="my-5 h-px w-full bg-white/10" />

        <div className="flex items-center justify-between">
          <span className="text-sm text-white/60">Total</span>
          <span className="font-display text-xl font-semibold text-or">{formatPrice(typedOrder.total_amount)}</span>
        </div>

        <div className="my-5 h-px w-full bg-white/10" />

        <div className="flex flex-col gap-1 text-sm text-white/70">
          <span className="text-xs uppercase tracking-[0.1em] text-white/40">Coordonnées</span>
          <span>{typedOrder.customer_name}</span>
          <span>{typedOrder.customer_phone}</span>
          <span>{typedOrder.customer_address}, {typedOrder.customer_city}</span>
          {typedOrder.customer_email && <span>{typedOrder.customer_email}</span>}
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center gap-3">
        <p className="text-xs text-white/40">
          Vous pouvez aussi retrouver votre commande à tout moment sur{" "}
          <Link href="/suivre-commande" className="text-or hover:underline">
            la page de suivi
          </Link>{" "}
          avec votre référence et votre numéro de téléphone.
        </p>
        <Link href="/catalogue" className="flex items-center gap-2 rounded-full bg-or px-8 py-3 font-medium text-black">
          Retour à la boutique
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}