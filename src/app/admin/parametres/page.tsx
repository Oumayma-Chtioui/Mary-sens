import Image from "next/image";
import { getSiteSettings } from "@/lib/settings";
import { updateSettings, updateHeroImage } from "@/lib/actions/settings";

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string; heroError?: string; heroSuccess?: string }>;
}) {
  const settings = await getSiteSettings();
  const params = await searchParams;

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl">Paramètres du site</h1>

      {/* Hero image — its own isolated form. A failure here never affects the rest. */}
      <div className="mb-10 max-w-2xl border border-border bg-ivoire p-6">
        <h2 className="mb-4 font-display text-xl">Image du hero</h2>

        {params.heroSuccess && (
          <p className="mb-4 border border-sauge/40 bg-sauge/10 px-4 py-3 text-sm text-sauge">
            Image mise à jour avec succès.
          </p>
        )}
        {params.heroError && (
          <p className="mb-4 border border-argile/40 bg-argile/10 px-4 py-3 text-sm text-argile">
            Erreur : {params.heroError}
          </p>
        )}

        <form action={updateHeroImage} className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded border border-border bg-ivoire-2">
              <Image src={settings.hero_image} alt="Image du hero actuelle" fill className="object-cover" />
            </div>
            <input type="file" name="hero_image_file" accept="image/*" required className="text-sm" />
          </div>
          <p className="text-xs text-ink/45">
            L&apos;image est automatiquement redimensionnée et compressée à l&apos;envoi.
          </p>
          <button type="submit" className="btn btn-dark w-fit">Mettre à jour l&apos;image</button>
        </form>
      </div>

      {/* Everything else. */}
      {params.success && (
        <p className="mb-6 max-w-2xl border border-sauge/40 bg-sauge/10 px-4 py-3 text-sm text-sauge">
          Paramètres enregistrés avec succès.
        </p>
      )}
      {params.error && (
        <p className="mb-6 max-w-2xl border border-argile/40 bg-argile/10 px-4 py-3 text-sm text-argile">
          Erreur : {params.error}
        </p>
      )}

      <form action={updateSettings} className="flex max-w-2xl flex-col gap-10">
        <Section title="Général">
          <Field label="Nom de la marque" name="brand_name" defaultValue={settings.brand_name} />
          <Field label="Description" name="description" defaultValue={settings.description} textarea />
          <Field label="Téléphone" name="phone" defaultValue={settings.phone} />

          <div className="flex flex-col gap-2">
            <span className="text-[12px] uppercase tracking-[0.08em] text-ink/55">
              Numéro WhatsApp (format international, sans +)
            </span>
            <input
              name="whatsapp_number"
              defaultValue={settings.whatsapp_number}
              className="border border-ink/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-or-deep"
            />
            <div className="mt-1 flex items-center gap-6">
              <span className="text-xs text-ink/50">Bouton et bulle WhatsApp sur le site :</span>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="whatsapp_enabled" value="true" defaultChecked={settings.whatsapp_enabled} className="accent-or-deep" />
                Afficher
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="whatsapp_enabled" value="false" defaultChecked={!settings.whatsapp_enabled} className="accent-or-deep" />
                Masquer partout
              </label>
            </div>
          </div>

          <Field label="E-mail" name="email" defaultValue={settings.email} />
          <Field label="Adresse" name="address" defaultValue={settings.address} />
        </Section>

        <Section title="Page d'accueil">
          <Field label="Titre du hero" name="hero_title" defaultValue={settings.hero_title} />
          <Field label="Accroche (tagline)" name="hero_tagline" defaultValue={settings.hero_tagline} />
          <Field label="Texte du hero" name="hero_description" defaultValue={settings.hero_description} textarea />
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