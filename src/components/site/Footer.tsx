import Link from "next/link";
import { Mail, Phone, Heart, Send, PackageSearch } from "lucide-react";
import { FaInstagram, FaFacebookF, FaTiktok } from "react-icons/fa";
import type { SiteSettings } from "@/lib/types";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const socials = [
    { label: "Instagram", href: settings.instagram_url, Icon: FaInstagram },
    { label: "Facebook", href: settings.facebook_url, Icon: FaFacebookF },
    { label: "TikTok", href: settings.tiktok_url, Icon: FaTiktok },
  ].filter((s) => s.href);

  return (
    <footer className="border-t-2 border-or/70 bg-[#0a0a0a] px-6 py-8 md:px-12">
      <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-8 md:flex-row md:items-start">
        <div className="flex flex-col gap-2">
          <span className="font-display text-2xl font-semibold text-or">{settings.brand_name}</span>
          <span className="max-w-xs text-xs leading-relaxed text-white/55">{settings.description}</span>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-white">Contact</span>
          <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-sm text-white/55 hover:text-or">
            <Mail className="size-4 text-or" />
            {settings.email}
          </a>
          {settings.phone && settings.phone !== "À compléter" && (
            <a href={`tel:${settings.phone}`} className="flex items-center gap-2 text-sm text-white/55 hover:text-or">
              <Phone className="size-4 text-or" />
              {settings.phone}
            </a>
          )}
          <Link href="/suivre-commande" className="flex items-center gap-2 text-sm text-white/55 hover:text-or">
            <PackageSearch className="size-4 text-or" />
            Suivre ma commande
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-white">Suivez-nous</span>
          <div className="flex items-center gap-3">
            {socials.length === 0 && <span className="text-xs text-white/35">À configurer</span>}
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white hover:border-or hover:text-or"
              >
                <Icon className="size-5" />
              </a>
            ))}
            
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 h-px max-w-[1400px] bg-gradient-to-r from-transparent via-or/50 to-transparent" />

      <div className="mx-auto mt-4 flex max-w-[1400px] items-center justify-between text-xs text-white/45">
        <span>© {new Date().getFullYear()} {settings.brand_name}. Tous droits réservés.</span>
        
      </div>
    </footer>
  );
}