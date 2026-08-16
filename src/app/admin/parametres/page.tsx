import { getSiteSettings } from "@/lib/settings";
import { updateSettings } from "@/lib/actions/settings";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl">Paramètres du site</h1>

      <form action={updateSettings} className="flex max-w-2xl flex-col gap-10">
        <Section title="Général">
          <Field label="Nom de la marque" name="brand_name" defaultValue={settings.brand_name} />
          <Field label="Description" name="description" defaultValue={settings.description} textarea />
          <Field label="Téléphone" name="phone" defaultValue={settings.phone} />
          <Field label="Numéro WhatsApp (format international, sans +)" name="whatsapp_number" defaultValue={settings.whatsapp_number} />
          <Field label="E-mail" name="email" defaultValue={settings.email} />
          <Field label="Adresse" name="address" defaultValue={settings.address} />
        </Section>

        <Section title="Page d'accueil">
          <Field label="Titre du hero" name="hero_title" defaultValue={settings.hero_title} />
          <Field label="Accroche (tagline)" name="hero_tagline" defaultValue={settings.hero_tagline} />
          <Field label="Texte du hero" name="hero_description" defaultValue={settings.hero_description} textarea />
          <Field label="Bouton principal" name="hero_cta_primary" defaultValue={settings.hero_cta_primary} />
          <Field label="Bouton secondaire" name="hero_cta_secondary" defaultValue={settings.hero_cta_secondary} />
        </Section>

        <Section title="La marque">
          <Field label="Notre histoire" name="about_story" defaultValue={settings.about_story} textarea rows={5} />
          <Field label="Notre mission" name="about_mission" defaultValue={settings.about_mission} textarea rows={3} />
          <Field label="Nos valeurs" name="about_values" defaultValue={settings.about_values} textarea rows={3} />
        </Section>

        <Section title="Réseaux sociaux">
          <Field label="Instagram (URL)" name="instagram_url" defaultValue={settings.instagram_url} />
          <Field label="Facebook (URL)" name="facebook_url" defaultValue={settings.facebook_url} />
          <Field label="TikTok (URL)" name="tiktok_url" defaultValue={settings.tiktok_url} />
        </Section>

        <Section title="SEO">
          <Field label="Titre du site" name="seo_title" defaultValue={settings.seo_title} />
          <Field label="Meta description" name="seo_description" defaultValue={settings.seo_description} textarea />
        </Section>

        <button type="submit" className="btn btn-dark w-fit">Enregistrer les paramètres</button>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-border pt-6 first:border-0 first:pt-0">
      <h2 className="mb-5 font-display text-xl">{title}</h2>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  textarea,
  rows = 3,
}: {
  label: string;
  name: string;
  defaultValue: string;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[12px] uppercase tracking-[0.08em] text-ink/55">{label}</span>
      {textarea ? (
        <textarea name={name} defaultValue={defaultValue} rows={rows} className="border border-ink/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-or-deep" />
      ) : (
        <input name={name} defaultValue={defaultValue} className="border border-ink/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-or-deep" />
      )}
    </label>
  );
}
