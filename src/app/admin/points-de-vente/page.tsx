import { createClient } from "@/lib/supabase/server";
import { createLocation, updateLocation, deleteLocation } from "@/lib/actions/locations";

export default async function AdminLocationsPage() {
  const supabase = createClient();
  const { data: locations } = await supabase.from("locations").select("*").order("position");

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl">Points de vente</h1>

      <div className="mb-10 border border-border bg-ivoire p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.08em] text-ink/60">Nouveau point de vente</h2>
        <form action={createLocation} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input name="name" required placeholder="Nom" className="border border-ink/20 bg-transparent px-4 py-2.5 text-sm" />
          <input name="city" placeholder="Ville" className="border border-ink/20 bg-transparent px-4 py-2.5 text-sm" />
          <input name="address" placeholder="Adresse" className="border border-ink/20 bg-transparent px-4 py-2.5 text-sm sm:col-span-2" />
          <input name="phone" placeholder="Téléphone" className="border border-ink/20 bg-transparent px-4 py-2.5 text-sm" />
          <input name="maps_url" placeholder="Lien Google Maps" className="border border-ink/20 bg-transparent px-4 py-2.5 text-sm" />
          <input name="opening_hours" placeholder="Horaires" className="border border-ink/20 bg-transparent px-4 py-2.5 text-sm sm:col-span-2" />
          <textarea name="description" placeholder="Description (optionnelle)" className="border border-ink/20 bg-transparent px-4 py-2.5 text-sm sm:col-span-2" />
          <button type="submit" className="btn btn-dark w-fit">Ajouter</button>
        </form>
      </div>

      <div className="flex flex-col gap-4">
        {(locations ?? []).map((loc) => (
          <form key={loc.id} action={updateLocation.bind(null, loc.id)} className="grid grid-cols-1 gap-3 border border-border bg-ivoire p-5 sm:grid-cols-2">
            <input name="name" defaultValue={loc.name} className="border border-ink/20 bg-transparent px-3 py-2 text-sm" />
            <input name="city" defaultValue={loc.city ?? ""} className="border border-ink/20 bg-transparent px-3 py-2 text-sm" />
            <input name="address" defaultValue={loc.address ?? ""} className="border border-ink/20 bg-transparent px-3 py-2 text-sm sm:col-span-2" />
            <input name="phone" defaultValue={loc.phone ?? ""} className="border border-ink/20 bg-transparent px-3 py-2 text-sm" />
            <input name="maps_url" defaultValue={loc.maps_url ?? ""} className="border border-ink/20 bg-transparent px-3 py-2 text-sm" />
            <input name="opening_hours" defaultValue={loc.opening_hours ?? ""} className="border border-ink/20 bg-transparent px-3 py-2 text-sm sm:col-span-2" />
            <textarea name="description" defaultValue={loc.description ?? ""} className="border border-ink/20 bg-transparent px-3 py-2 text-sm sm:col-span-2" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_visible" defaultChecked={loc.is_visible} className="h-4 w-4 accent-or-deep" /> Visible
            </label>
            <div className="flex gap-4 sm:col-span-2">
              <button type="submit" className="btn btn-ghost">Enregistrer</button>
              <button formAction={deleteLocation.bind(null, loc.id)} className="text-[12px] uppercase tracking-[0.06em] text-argile/70 hover:text-argile">
                Supprimer
              </button>
            </div>
          </form>
        ))}
        {(!locations || locations.length === 0) && (
          <p className="text-sm text-ink/45">Aucun point de vente pour le moment.</p>
        )}
      </div>
    </div>
  );
}
