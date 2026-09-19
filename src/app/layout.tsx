import type { Metadata } from "next";
import { Source_Serif_4, Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/components/site/Nav"; 
import Footer from "@/components/site/Footer";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import { getSiteSettings } from "@/lib/settings";
import { Providers } from "./providers";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

export const runtime = 'edge';


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
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [{ url: "/images/favicon.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/images/favicon.png",
    apple: [{ url: "/images/favicon.png", sizes: "512x512", type: "image/png" }],
  },
  title: {
    default: "Mary'sens — La marque tunisienne de référence des huiles essentielles et végétales",
    template: "%s | Mary'sens",
  },
  description:
    "Découvrez les huiles essentielles, huiles végétales et soins naturels Mary'sens, fabriqués en Tunisie.",
  keywords: [
    "huiles essentielles Tunisie",
    "huiles végétales Tunisie",
    "cosmétiques naturels Tunisie",
    "soins bio",
    "Mary'sens",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Mary'sens — La marque tunisienne de référence des huiles essentielles et végétales",
    description:
      "Huiles essentielles, huiles végétales et soins naturels fabriqués en Tunisie.",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ url: "/images/rollon.png", width: 1200, height: 1200, alt: "Produits naturels Mary'sens" }],
    locale: "fr_TN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mary'sens — Soins naturels tunisiens",
    description: "Huiles essentielles, huiles végétales et soins naturels fabriqués en Tunisie.",
    images: ["/images/rollon.png"],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: SITE_NAME,
                  url: SITE_URL,
                  logo: `${SITE_URL}/images/logo.png`,
                  address: { "@type": "PostalAddress", addressCountry: "TN" },
                },
                {
                  "@type": "WebSite",
                  name: SITE_NAME,
                  url: SITE_URL,
                  inLanguage: "fr-TN",
                },
              ],
            }),
          }}
        />
        <Providers>
          <Nav settings={settings} />
          {children}
          <Footer settings={settings} />
          {settings.whatsapp_enabled && <WhatsAppFloat whatsappNumber={settings.whatsapp_number} />}
        </Providers>
      </body>
      <Analytics />
      <SpeedInsights />
    </html>
  );
}