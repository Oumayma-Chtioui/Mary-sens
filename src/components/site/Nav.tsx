"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { buildWhatsAppLink, generalContactMessage } from "@/lib/whatsapp";
import type { SiteSettings } from "@/lib/types";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/a-propos", label: "La marque" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/points-de-vente", label: "Points de vente" },
  { href: "/contact", label: "Contact" },
];

export default function Nav({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const waLink = buildWhatsAppLink(settings.whatsapp_number, generalContactMessage());

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-ivoire/90 backdrop-blur-md">
      <nav className="wrap flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src={settings.logo_url} alt={settings.brand_name} width={28} height={28} className="h-7 w-auto" />
          <span className="font-display text-lg tracking-wide">{settings.brand_name.toUpperCase()}</span>
        </Link>

        <div className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium uppercase tracking-[0.12em] text-ink/85 transition-colors hover:text-or-deep"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-gold hidden md:inline-flex">
          Commander sur WhatsApp
        </a>

        <button
          className="text-[12px] font-medium uppercase tracking-[0.1em] md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Ouvrir le menu"
        >
          {open ? "Fermer" : "Menu"}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border bg-ivoire md:hidden">
          <div className="wrap flex flex-col gap-1 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-sm font-medium uppercase tracking-[0.1em] text-ink/85"
              >
                {l.label}
              </Link>
            ))}
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-gold mt-2 justify-center">
              Commander sur WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
