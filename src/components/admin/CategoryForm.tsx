"use client";

import Image from "next/image";
import { useState } from "react";
import type { Category } from "@/lib/types";

type ActionResult = { error: string } | void;
type CategoryAction = (formData: FormData) => Promise<ActionResult>;

type CategoryFormProps = {
  action: CategoryAction;
  category?: Category;
  deleteAction?: () => Promise<void>;
};

export default function CategoryForm({ action, category, deleteAction }: CategoryFormProps) {
  const [error, setError] = useState<string>();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(undefined);
    const result = await action(new FormData(event.currentTarget));
    if (result?.error) setError(result.error);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={category
        ? "grid grid-cols-1 items-center gap-3 border border-border bg-ivoire p-5 sm:grid-cols-[56px_1fr_1.5fr_auto_auto_auto]"
        : "grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1.5fr_auto_auto]"}
    >
      {category && (
        <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-border bg-ivoire-2">
          {category.image_url ? (
            <Image src={category.image_url} alt={category.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-[9px] text-ink/35">Aucune</div>
          )}
        </div>
      )}
      <input name="name" required={!category} defaultValue={category?.name} placeholder={category ? undefined : "Nom"} className="border border-ink/20 bg-transparent px-4 py-2.5 text-sm" />
      <input name="description" defaultValue={category?.description ?? ""} placeholder={category ? undefined : "Description (optionnelle)"} className="border border-ink/20 bg-transparent px-4 py-2.5 text-sm" />
      <label className="flex items-center border border-ink/20 px-4 py-2.5 text-sm text-ink/60">
        <input type="file" name="image" accept="image/*" className="w-full text-xs" />
      </label>
      {category && (
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_visible" defaultChecked={category.is_visible} className="h-4 w-4 accent-or-deep" /> Visible
        </label>
      )}
      <div className={category ? "flex flex-col gap-2" : undefined}>
        {error && <p className="col-span-full border border-argile/40 bg-argile/10 px-3 py-2 text-sm text-argile">{error}</p>}
        <div className="flex items-center gap-4">
          <button type="submit" className={category ? "btn btn-ghost" : "btn btn-dark"}>
            {category ? "Enregistrer" : "Ajouter"}
          </button>
          {category && deleteAction && (
            <button type="button" onClick={() => void deleteAction()} className="text-[12px] uppercase tracking-[0.06em] text-argile/70 hover:text-argile">
              Supprimer
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
