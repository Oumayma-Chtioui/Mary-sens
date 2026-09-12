import type { Metadata } from "next";
import { Source_Serif_4, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import { getSiteSettings } from "@/lib/settings";
import { Providers } from "./providers";

const display = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
});

const sans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Mary'sens — Soin & bien-être naturel",
  description:
    "Mary'sens, la marque tunisienne de référence des huiles essentielles et végétales 100% pures et bio.",
  metadataBase: new URL("https://www.marysens.tn"),
  openGraph: {
    title: "Mary'sens — Soin & bien-être naturel",
    description:
      "Huiles essentielles et végétales 100% pures et bio, pensées et fabriquées en Tunisie.",
    locale: "fr_TN",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
      <body className="bg-black font-sans text-white antialiased">
        <Providers>
          <Nav settings={settings} />
          {children}
          <Footer settings={settings} />
          {settings.whatsapp_enabled && <WhatsAppFloat whatsappNumber={settings.whatsapp_number} />}
        </Providers>
      </body>
    </html>
  );
}