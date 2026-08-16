import type { Metadata } from "next";
import { getLocations } from "@/lib/queries";

export const metadata: Metadata = { title: "Points de vente — Mary'sens" };
export const revalidate = 300;

export default async function LocationsPage() {
  const locations = await getLocations();

  return (
    <div className="wrap py-16">
      <span className="eyebrow">Où nous trouver</span>
      <h1 className="mt-3 font-display text-4xl font-medium md:text-5xl">Nos points de vente</h1>

      {locations.length > 0 ? (
        <div className="mt-12 grid grid-cols-1 gap-px border border-border bg-border md:grid-cols-2">
          {locations.map((loc) => (
            <div key={loc.id} className="bg-ivoire p-8">
              <h2 className="font-display text-2xl">{loc.name}</h2>
              {loc.description && <p className="mt-2 text-sm text-ink/60">{loc.description}</p>}
              <dl className="mt-5 space-y-2 text-[14px] text-ink/75">
                {loc.address && (
                  <div className="flex gap-2">
                    <dt className="text-ink/45">Adresse</dt>
                    <dd>{loc.address}{loc.city ? `, ${loc.city}` : ""}</dd>
                  </div>
                )}
                {loc.phone && (
                  <div className="flex gap-2">
                    <dt className="text-ink/45">Téléphone</dt>
                    <dd><a href={`tel:${loc.phone}`} className="hover:text-or-deep">{loc.phone}</a></dd>
                  </div>
                )}
                {loc.opening_hours && (
                  <div className="flex gap-2">
                    <dt className="text-ink/45">Horaires</dt>
                    <dd className="whitespace-pre-line">{loc.opening_hours}</dd>
                  </div>
                )}
              </dl>
              {loc.maps_url && (
                <a
                  href={loc.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.1em] text-or-deep"
                >
                  Voir sur Google Maps
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12 border border-dashed border-border px-8 py-20 text-center">
          <p className="font-display text-xl">Aucun point de vente publié</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-ink/55">
            Ajoutez vos adresses depuis l&apos;administration (Points de vente).
          </p>
        </div>
      )}
    </div>
  );
}
