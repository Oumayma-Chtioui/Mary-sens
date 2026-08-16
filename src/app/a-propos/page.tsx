import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/settings";
import DropMark from "@/components/site/DropMark";

export const metadata: Metadata = { title: "La marque — Mary'sens" };
export const revalidate = 300;

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <section className="bg-noir py-24 text-ivoire md:py-32">
        <div className="wrap max-w-3xl">
          <span className="eyebrow">La marque</span>
          <h1 className="mt-4 font-display text-4xl font-medium leading-tight md:text-6xl">
            Mary&apos;sens, {settings.hero_tagline.toLowerCase()}
          </h1>
        </div>
      </section>

      <div className="divider-motif"><DropMark /></div>

      <section className="wrap grid grid-cols-1 gap-16 py-20 md:grid-cols-3">
        <div>
          <h2 className="mb-3 font-display text-2xl">Notre histoire</h2>
          <p className="whitespace-pre-line text-[14.5px] leading-relaxed text-ink/70">{settings.about_story}</p>
        </div>
        <div>
          <h2 className="mb-3 font-display text-2xl">Notre mission</h2>
          <p className="whitespace-pre-line text-[14.5px] leading-relaxed text-ink/70">{settings.about_mission}</p>
        </div>
        <div>
          <h2 className="mb-3 font-display text-2xl">Nos valeurs</h2>
          <p className="whitespace-pre-line text-[14.5px] leading-relaxed text-ink/70">{settings.about_values}</p>
        </div>
      </section>

      <section className="border-t border-border bg-ivoire-2 py-20">
        <div className="wrap max-w-2xl text-center">
          <p className="font-display text-2xl leading-relaxed md:text-3xl">
            &laquo; {settings.description} &raquo;
          </p>
        </div>
      </section>
    </div>
  );
}
