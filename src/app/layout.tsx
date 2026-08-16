import type { Metadata } from "next";
import { Bodoni_Moda, Petit_Formal_Script, Libre_Franklin } from "next/font/google";
import "./globals.css";
import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import { getSiteSettings } from "@/lib/settings";

// Display face: mirrors the high-contrast, chiselled serif Mary'sens already
// uses on packaging headlines ("ROLL-ON ANTI-ÂGE"). Deliberately not
// Fraunces/Playfair — chosen to match the brand's own type character.
const display = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

// Accent script: mirrors the flowing tagline lettering on packaging
// ("L'élixir de jeunesse"). Reserved for short taglines only.
const script = Petit_Formal_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
});

// Body / UI: warm editorial grotesque with full French diacritic support.
const sans = Libre_Franklin({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
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
    <html lang="fr" className={`${display.variable} ${script.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        <Nav settings={settings} />
        {children}
        <Footer settings={settings} />
        <WhatsAppFloat whatsappNumber={settings.whatsapp_number} />
      </body>
    </html>
  );
}
