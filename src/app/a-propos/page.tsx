import Image from "next/image";
import type { Metadata } from "next";
import { BadgeCheck, MapPin, Sprout, Target, Heart } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "À propos — Mary'sens" };
export const revalidate = 300;

const ingredientStrip = [
  { src: "/images/image1.png", alt: "Overview Image1" },
  { src: "/images/image3.png", alt: "Overview Image3" },
  { src: "/images/image2.png", alt: "Overview Image2" },
  { src: "/images/image4.png", alt: "Overview Image4" },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const storyParagraphs = settings.about_story.split("\n\n").filter(Boolean);

  return (
    <div className="min-h-screen bg-[#0b0b0a] font-display">
      {/* HERO BANNER */}
      <div className="relative h-64 w-full overflow-hidden md:h-72">
        <Image src="/images/banner.png" alt={settings.brand_name} fill className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6">
          <span className="text-xs uppercase tracking-[0.28em] text-or">{settings.brand_name}</span>
          <h1 className="text-4xl font-semibold tracking-wide text-white md:text-5xl">Notre Histoire</h1>
          <div className="my-2 h-px w-full max-w-md bg-or/30" />
        </div>
      </div>

      {/* STORY + VALUE CARDS */}
      <div className="grid grid-cols-1 gap-10 bg-[#11110f] px-6 py-10 md:grid-cols-[1.5fr_1fr] md:gap-12 md:px-12 md:py-12">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-or">La Marque tunisienne de référence</h2>
          <div className="h-px w-16 bg-or" />
          {storyParagraphs.map((p, i) => (
            <p key={i} className="font-sans text-sm leading-relaxed text-white/85">
              {p}
            </p>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <ValueCard icon={Sprout} title="100% Naturel" desc="Des ingrédients purs, sans additifs ni produits chimiques." />
          <ValueCard icon={MapPin} title="Fabriqué en Tunisie 🇹🇳" desc="Un savoir-faire artisanal ancré dans notre terroir." />
          <ValueCard icon={BadgeCheck} title="Qualité Certifiée Bio" desc="Une certification biologique garantie à chaque étape." />
        </div>
      </div>

      {/* MISSION + VALEURS */}
      <div className="grid grid-cols-1 gap-10 bg-[#0b0b0a] px-6 py-10 md:grid-cols-2 md:gap-12 md:px-12 md:py-12">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Target className="size-5 text-or" />
            <h2 className="text-xl font-semibold text-or">Notre mission</h2>
          </div>
          <p className="whitespace-pre-line font-sans text-sm leading-relaxed text-white/80">
            {settings.about_mission}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Heart className="size-5 text-or" />
            <h2 className="text-xl font-semibold text-or">Nos valeurs</h2>
          </div>
          <p className="whitespace-pre-line font-sans text-sm leading-relaxed text-white/80">
            {settings.about_values}
          </p>
        </div>
      </div>

      {/* INGREDIENT STRIP */}
      <div className="bg-[#0b0b0a] px-6 pb-8 md:px-12">
        <div className="mb-4 flex items-center gap-4">
          <div className="h-px flex-1 bg-or/50" />
          <span className="font-sans text-sm uppercase tracking-[0.2em] text-or">De la nature au flacon</span>
          <div className="h-px flex-1 bg-or/50" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {ingredientStrip.map((img) => (
            <div key={img.src} className="relative aspect-square overflow-hidden rounded-sm border-2 border-or/70">
              <Image src={img.src} alt={img.alt} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ValueCard({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Sprout;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-white/10 p-4">
      <Icon className="size-7 shrink-0 text-or" strokeWidth={1.4} />
      <div className="flex flex-col gap-1">
        <span className="font-sans text-base font-semibold text-white">{title}</span>
        <span className="font-sans text-xs text-white/65">{desc}</span>
      </div>
    </div>
  );
}