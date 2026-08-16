"use client";

import { buildWhatsAppLink, generalContactMessage } from "@/lib/whatsapp";

export default function WhatsAppFloat({ whatsappNumber }: { whatsappNumber: string }) {
  const link = buildWhatsAppLink(whatsappNumber, generalContactMessage());
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Commander sur WhatsApp"
      className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full border border-or-deep bg-noir shadow-[0_12px_30px_rgba(0,0,0,0.35)] md:hidden"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-or-clair">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.77.46 3.45 1.28 4.9L2 22l5.29-1.38a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.78 14.02c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.13.11-1.83-.12-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.17-4.94-4.36-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.29.57-.36.76-.36h.55c.18 0 .42-.07.65.5.24.58.81 2.01.88 2.16.07.15.12.32.02.51-.1.19-.15.31-.29.48-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.29.75 1.24 1.61 2.01 1.11.99 2.04 1.3 2.34 1.44.29.14.46.12.63-.07.17-.19.71-.83.9-1.11.19-.29.38-.24.63-.14.26.1 1.66.78 1.94.92.29.14.48.22.55.34.07.12.07.7-.17 1.38Z" />
      </svg>
    </a>
  );
}
