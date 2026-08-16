import { createClient } from "@/lib/supabase/server";
import { markMessageStatus, deleteMessage } from "@/lib/actions/messages";
import { cx } from "@/lib/utils";

export default async function AdminMessagesPage() {
  const supabase = createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl">Messages</h1>

      <div className="flex flex-col gap-4">
        {(messages ?? []).map((m) => (
          <div key={m.id} className="border border-border bg-ivoire p-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium">{m.name} · <span className="text-ink/50">{m.email}</span></p>
                {m.phone && <p className="text-sm text-ink/50">{m.phone}</p>}
              </div>
              <span
                className={cx(
                  "px-2.5 py-1 text-[10px] uppercase tracking-[0.08em]",
                  m.status === "new" && "bg-or-clair/40 text-ink",
                  m.status === "read" && "bg-ivoire-2 text-ink/60",
                  m.status === "handled" && "bg-sauge/20 text-sauge"
                )}
              >
                {m.status === "new" ? "Nouveau" : m.status === "read" ? "Lu" : "Traité"}
              </span>
            </div>
            {m.subject && <p className="mb-1 text-sm font-medium text-ink/70">{m.subject}</p>}
            <p className="whitespace-pre-line text-sm text-ink/75">{m.message}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-[12px] uppercase tracking-[0.06em]">
              <form action={markMessageStatus.bind(null, m.id, "read")}>
                <button type="submit" className="text-ink/60 hover:text-ink">Marquer lu</button>
              </form>
              <form action={markMessageStatus.bind(null, m.id, "handled")}>
                <button type="submit" className="text-sauge/80 hover:text-sauge">Marquer traité</button>
              </form>
              <form action={deleteMessage.bind(null, m.id)}>
                <button type="submit" className="text-argile/70 hover:text-argile">Supprimer</button>
              </form>
            </div>
          </div>
        ))}
        {(!messages || messages.length === 0) && (
          <p className="text-sm text-ink/45">Aucun message reçu pour le moment.</p>
        )}
      </div>
    </div>
  );
}
