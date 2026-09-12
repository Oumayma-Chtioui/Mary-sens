"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice, cx } from "@/lib/utils";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

const STATUS_BADGE: Record<OrderStatus, string> = {
  Nouvelle: "bg-or-clair/50 text-ink",
  Confirmée: "bg-or/20 text-or-deep",
  "En préparation": "bg-or/20 text-or-deep",
  Expédiée: "bg-sauge/15 text-sauge",
  Livrée: "bg-sauge/20 text-sauge",
  Annulée: "bg-argile/15 text-argile",
};

type RecentOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: OrderStatus;
};

export default function RecentOrdersList({ orders }: { orders: RecentOrder[] }) {
  const [statusFilter, setStatusFilter] = useState<string>("");

  const filtered = statusFilter ? orders.filter((o) => o.status === statusFilter) : orders;

  return (
    <div className="border border-border bg-ivoire p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-xl">Commandes récentes</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-ink/20 bg-transparent px-2.5 py-1.5 text-xs"
        >
          <option value="">Tous les statuts</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {filtered.length > 0 ? (
        <ul className="divide-y divide-border">
          {filtered.map((o) => (
            <li key={o.id} className="flex items-center justify-between gap-3 py-3 text-sm">
              <Link href={`/admin/commandes/${o.id}`} className="min-w-0 flex-1 truncate hover:text-or-deep">
                {o.order_number} — {o.customer_name}
              </Link>
              <span className="text-ink/50">{formatPrice(o.total_amount)}</span>
              <span className={cx("rounded-full px-2 py-0.5 text-[10px] font-medium whitespace-nowrap", STATUS_BADGE[o.status])}>
                {o.status}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-ink/45">
          {statusFilter ? "Aucune commande avec ce statut." : "Aucune commande pour le moment."}
        </p>
      )}
    </div>
  );
}