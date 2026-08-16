import type { Category, Product } from "@/lib/types";

export default function ProductForm({
  categories,
  product,
  action,
}: {
  categories: Category[];
  product?: Product;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
      <div className="flex flex-col gap-5">
        <Field label="Nom du produit" name="name" defaultValue={product?.name} required />
        <Field label="Description courte" name="short_description" defaultValue={product?.short_description ?? ""} textarea rows={2} />
        <Field label="Description complète" name="full_description" defaultValue={product?.full_description ?? ""} textarea rows={5} />
        <Field label="Bienfaits" name="benefits" defaultValue={product?.benefits ?? ""} textarea rows={3} />
        <Field label="Mode d'utilisation" name="usage_instructions" defaultValue={product?.usage_instructions ?? ""} textarea rows={3} />
        <Field label="Composition / ingrédients" name="ingredients" defaultValue={product?.ingredients ?? ""} textarea rows={3} />
        <Field label="Précautions" name="precautions" defaultValue={product?.precautions ?? ""} textarea rows={3} />
      </div>

      <div className="flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="text-[12px] uppercase tracking-[0.08em] text-ink/55">Catégorie</span>
          <select name="category_id" defaultValue={product?.category_id ?? ""} className="border border-ink/20 bg-transparent px-4 py-2.5 text-sm">
            <option value="">Aucune</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        <Field label="Prix (TND)" name="price" type="number" defaultValue={product?.price ?? ""} />
        <Field label="Volume / taille" name="volume" defaultValue={product?.volume ?? ""} />
        <Field label="Référence (SKU)" name="sku" defaultValue={product?.sku ?? ""} />
        <Field label="Tags (séparés par une virgule)" name="tags" defaultValue={product?.tags?.join(", ") ?? ""} />

        <div className="flex flex-col gap-3 border-t border-border pt-5">
          <Checkbox label="Publié" name="is_published" defaultChecked={product?.is_published ?? true} />
          <Checkbox label="Disponible" name="is_available" defaultChecked={product?.is_available ?? true} />
          <Checkbox label="Mis en avant (page d'accueil)" name="is_featured" defaultChecked={product?.is_featured ?? false} />
          <Checkbox label="Afficher le prix" name="price_visible" defaultChecked={product?.price_visible ?? false} />
          <Checkbox label="Commande WhatsApp activée" name="whatsapp_enabled" defaultChecked={product?.whatsapp_enabled ?? true} />
        </div>

        <button type="submit" className="btn btn-dark mt-2">
          {product ? "Enregistrer les modifications" : "Créer le produit"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  textarea,
  rows,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[12px] uppercase tracking-[0.08em] text-ink/55">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue ?? ""}
          rows={rows}
          className="border border-ink/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-or-deep"
        />
      ) : (
        <input
          type={type}
          name={name}
          step={type === "number" ? "0.01" : undefined}
          defaultValue={defaultValue ?? ""}
          required={required}
          className="border border-ink/20 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-or-deep"
        />
      )}
    </label>
  );
}

function Checkbox({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2.5 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-or-deep" />
      {label}
    </label>
  );
}
