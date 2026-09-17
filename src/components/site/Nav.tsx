"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Home, Leaf, Info, Mail, MessageCircle, Menu, X, ShoppingBag } from "lucide-react";
import { buildWhatsAppLink, generalContactMessage } from "@/lib/whatsapp";
import type { SiteSettings } from "@/lib/types";
import CartIndicator from "@/components/site/CartIndicator";
import { useCart } from "@/lib/cart/CartContext";

const links = [
  { href: "/", label: "Accueil", icon: Home },
  { href: "/catalogue", label: "Boutique", icon: Leaf },
  { href: "/a-propos", label: "À propos", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
];

export default function Nav({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const { itemCount } = useCart();
  const waLink = buildWhatsAppLink(settings.whatsapp_number, generalContactMessage());

  return (
    <header className="border-b border-white/10 bg-black">
      <nav className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 md:px-12">
        <Link href="/" className="flex items-center gap-3 h-full py-1">
        <div className="relative h-20 w-20 shrink-0">
          <Image 
            src={settings.logo_url} 
            alt={settings.brand_name} 
            fill 
            priority
            unoptimized
            className="object-contain" 
          />
        </div>   
        {/* <span className="font-display text-2xl font-semibold tracking-wide text-or select-none">
          {settings.brand_name}
        </span> */}
      </Link>


        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-2 pb-1 text-sm text-white/75 transition-colors hover:text-white"
              >
                <Icon className="size-4 text-or" />
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-xl md:inline">🇹🇳</span>
          <CartIndicator />
          {settings.whatsapp_enabled && (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden size-10 items-center justify-center rounded-full border border-or/50 text-or transition-colors hover:bg-or hover:text-black md:flex"
              aria-label="Commander sur WhatsApp"
            >
              <MessageCircle className="size-4" />
            </a>
          )}
          <button className="text-white md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-black md:hidden">
          <div className="flex flex-col gap-1 px-6 py-4">
            {links.map((l) => {
              const Icon = l.icon;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 py-3 text-sm text-white/85"
                >
                  <Icon className="size-4 text-or" />
                  {l.label}
                </Link>
              );
            })}
            <Link
              href="/panier"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between py-3 text-sm text-white/85"
            >
              <span className="flex items-center gap-2.5">
                <ShoppingBag className="size-4 text-or" />
                Panier
              </span>
              {itemCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-or text-[10px] font-semibold text-black">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>
            {settings.whatsapp_enabled && (
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-or px-6 py-3 text-sm font-medium text-black"
              >
                <MessageCircle className="size-4" />
                Commander sur WhatsApp
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  );
}