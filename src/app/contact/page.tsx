import type { Metadata } from "next";
import { Mail, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp, FaTiktok } from "react-icons/fa";
import { getSiteSettings } from "@/lib/settings";
import ContactForm from "@/components/site/ContactForm";

export const metadata: Metadata = { title: "Contact — Mary'sens" };
export const revalidate = 300;

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const socials = [
    { label: "Instagram", href: settings.instagram_url, Icon: FaInstagram },
    { label: "Facebook", href: settings.facebook_url, Icon: FaFacebook },
    { label: "TikTok", href: settings.tiktok_url, Icon: FaTiktok },
  ].filter((s) => s.href);

  return (
    <div className="min-h-screen bg-black px-6 py-12 md:px-12">
      <div className="mb-12 flex flex-col items-center gap-2 text-center">
        <h1 className="font-display text-4xl font-semibold text-or">Contactez-Nous</h1>
        <p className="text-sm text-white/65">Nous sommes à votre écoute pour toute question sur nos produits</p>
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 md:grid-cols-2">
        <ContactForm />

        <div className="flex flex-col gap-6 rounded-2xl border border-or/45 bg-[#111111] p-8">
          <h2 className="font-display text-xl text-or">Nos coordonnées</h2>

          <InfoRow icon={Mail} label="Email" value={settings.email} href={`mailto:${settings.email}`} />
          <div className="h-px w-full bg-or/30" />

          {settings.phone && settings.phone !== "À compléter" && (
            <>
              <InfoRow icon={Phone} label="Téléphone" value={settings.phone} href={`tel:${settings.phone}`} />
              <div className="h-px w-full bg-or/30" />
            </>
          )}

          {settings.whatsapp_number && settings.whatsapp_number !== "À compléter" && (
            <>
              <InfoRow icon={Phone} label="WhatsApp" value={settings.whatsapp_number} href={`https://wa.me/${settings.whatsapp_number}`} />
              <div className="h-px w-full bg-or/30" />
            </>
          )}

          <div className="flex items-center gap-4">
            <span className="text-2xl">🇹🇳</span>
            <span className="text-sm text-white">Basée en Tunisie</span>
          </div>
          <div className="h-px w-full bg-or/30" />

          <div className="flex flex-col gap-3">
            <span className="text-xs text-white/55">Suivez-nous</span>
            <div className="flex items-center gap-4">
              {socials.length === 0 && <span className="text-xs text-white/35">À configurer</span>}
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full border border-or/30 bg-or/15 text-or"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex size-10 items-center justify-center rounded-full bg-or/15">
        <Icon className="size-5 text-or" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-white/55">{label}</span>
        <a href={href} className="text-sm text-white hover:text-or">{value}</a>
      </div>
    </div>
  );
}
