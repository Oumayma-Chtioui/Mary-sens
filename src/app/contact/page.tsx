import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import { buildWhatsAppLink, generalContactMessage } from "@/lib/whatsapp";
import ContactForm from "@/components/site/ContactForm";

export const metadata: Metadata = { title: "Contact — Mary'sens" };
export const revalidate = 300;

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const waLink = buildWhatsAppLink(settings.whatsapp_number, generalContactMessage());

  return (
    <div className="wrap py-16">
      <span className="eyebrow">Contact</span>
      <h1 className="mt-3 font-display text-4xl font-medium md:text-5xl">Parlons-en</h1>

      <div className="mt-14 grid grid-cols-1 gap-16 md:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-8">
          <InfoRow label="WhatsApp" value="Réponse rapide" href={waLink} />
          <InfoRow label="E-mail" value={settings.email} href={`mailto:${settings.email}`} />
          {settings.phone && settings.phone !== "À compléter" && (
            <InfoRow label="Téléphone" value={settings.phone} href={`tel:${settings.phone}`} />
          )}
          <InfoRow label="Adresse" value={settings.address} />
        </div>
        <ContactForm />
      </div>
    </div>
  );
}

function InfoRow({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-or-deep">{value}</a>
  ) : (
    value
  );
  return (
    <div className="border-t border-border pt-5">
      <span className="text-[11px] uppercase tracking-[0.1em] text-ink/45">{label}</span>
      <p className="mt-1.5 text-[15px]">{content}</p>
    </div>
  );
}
