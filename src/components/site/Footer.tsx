import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { buildWhatsAppLink, generalContactMessage } from "@/lib/whatsapp";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const waLink = buildWhatsAppLink(settings.whatsapp_number, generalContactMessage());
  const socials = [
    { label: "Instagram", href: settings.instagram_url },
    { label: "Facebook", href: settings.facebook_url },
    { label: "TikTok", href: settings.tiktok_url },
  ].filter((s) => s.href);

  return (
    <footer className="bg-noir py-20 text-ivoire/75">
      <div className="wrap">
        <div className="grid grid-cols-2 gap-10 border-b border-ivoire/10 pb-16 md:grid-cols-4 md:gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <Image src={settings.logo_url} alt={settings.brand_name} width={26} height={26} className="h-[26px] w-auto" />
              <span className="font-display text-base tracking-wide text-ivoire">{settings.brand_name.toUpperCase()}</span>
            </div>
            <p className="mt-4 max-w-[280px] text-[13.5px] leading-relaxed text-ivoire/55">
              {settings.description}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-or-clair">Explorer</h4>
            <ul className="space-y-3 text-[13.5px] text-ivoire/65">
              <li><Link href="/catalogue" className="hover:text-or-clair">Catalogue</Link></li>
              <li><Link href="/a-propos" className="hover:text-or-clair">La marque</Link></li>
              <li><Link href="/points-de-vente" className="hover:text-or-clair">Points de vente</Link></li>
              <li><Link href="/contact" className="hover:text-or-clair">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-or-clair">Suivez-nous</h4>
            <ul className="space-y-3 text-[13.5px] text-ivoire/65">
              {socials.length === 0 && <li className="text-ivoire/35">À configurer</li>}
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-or-clair">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-[11px] font-medium uppercase tracking-[0.14em] text-or-clair">Contact</h4>
            <ul className="space-y-3 text-[13.5px] text-ivoire/65">
              <li><a href={waLink} target="_blank" rel="noopener noreferrer" className="hover:text-or-clair">WhatsApp</a></li>
              <li><a href={`mailto:${settings.email}`} className="hover:text-or-clair">{settings.email}</a></li>
              <li>{settings.address}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-7 text-xs text-ivoire/35">
          <span>© {new Date().getFullYear()} {settings.brand_name}. Tous droits réservés.</span>
          <Link href="/admin" className="hover:text-ivoire/60">Espace administration</Link>
        </div>
      </div>
    </footer>
  );
}
