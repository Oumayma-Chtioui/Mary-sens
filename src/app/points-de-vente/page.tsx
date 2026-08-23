import type { Metadata } from "next";
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import { getLocations } from "@/lib/queries";

export const metadata: Metadata = { title: "Points de vente — Mary'sens" };
export const revalidate = 300;

export default async function LocationsPage() {
  const locations = await getLocations();

  return (
    <div className="min-h-screen bg-black px-6 py-12 md:px-12">
      <div className="mb-12 flex flex-col items-center gap-2 text-center">
        <span className="text-xs uppercase tracking-[0.28em] text-or">Où nous trouver</span>
        <h1 className="font-display text-4xl font-semibold text-white">Nos points de vente</h1>
      </div>

      {locations.length > 0 ? (
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
          {locations.map((loc) => (
            <div key={loc.id} className="flex flex-col gap-5 rounded-2xl border border-or/30 bg-[#111111] p-8">
              <div>
                <h2 className="font-display text-2xl text-or">{loc.name}</h2>
                {loc.description && <p className="mt-2 text-sm text-white/55">{loc.description}</p>}
              </div>

              <div className="h-px w-full bg-or/20" />

              <div className="flex flex-col gap-4">
                {loc.address && (
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-or/15">
                      <MapPin className="size-4 text-or" />
                    </div>
                    <span className="pt-1.5 text-sm text-white/80">
                      {loc.address}{loc.city ? `, ${loc.city}` : ""}
                    </span>
                  </div>
                )}
                {loc.phone && (
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-or/15">
                      <Phone className="size-4 text-or" />
                    </div>
                    <a href={`tel:${loc.phone}`} className="text-sm text-white/80 hover:text-or">
                      {loc.phone}
                    </a>
                  </div>
                )}
                {loc.opening_hours && (
                  <div className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-or/15">
                      <Clock className="size-4 text-or" />
                    </div>
                    <span className="whitespace-pre-line pt-1.5 text-sm text-white/80">{loc.opening_hours}</span>
                  </div>
                )}
              </div>

              {loc.maps_url && (
                <a
                  href={loc.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex w-fit items-center gap-2 text-[12px] font-medium uppercase tracking-[0.1em] text-or"
                >
                  Voir sur Google Maps
                  <ArrowRight className="size-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-white/15 px-8 py-16 text-center">
          <p className="font-display text-xl text-white">Aucun point de vente publié</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-white/50">
            Ajoutez vos adresses depuis l&apos;administration (Points de vente).
          </p>
        </div>
      )}
    </div>
  );
}
