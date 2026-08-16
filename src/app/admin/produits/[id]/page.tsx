import Image from "next/image";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateProduct, addProductImage, deleteProductImage, setPrimaryImage } from "@/lib/actions/products";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*, images:product_images(*)").eq("id", params.id).single(),
    supabase.from("categories").select("*").order("position"),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl">{product.name}</h1>

      <div className="mb-10 border border-border bg-ivoire p-6">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.08em] text-ink/60">Images du produit</h2>
        <div className="mb-5 flex flex-wrap gap-4">
          {(product.images ?? [])
            .sort((a: any, b: any) => a.position - b.position)
            .map((img: any) => (
              <div key={img.id} className="relative h-28 w-28 overflow-hidden border border-border">
                <Image src={img.url} alt="" fill className="object-cover" />
                {img.is_primary && (
                  <span className="absolute left-1 top-1 bg-noir px-1.5 py-0.5 text-[9px] text-or-clair">Principale</span>
                )}
                <div className="absolute bottom-0 flex w-full justify-between bg-noir/70 px-1 py-1">
                  {!img.is_primary && (
                    <form action={setPrimaryImage.bind(null, product.id, img.id)}>
                      <button type="submit" className="text-[9px] text-ivoire/80 hover:text-or-clair">Principale</button>
                    </form>
                  )}
                  <form action={deleteProductImage.bind(null, product.id, img.id)} className="ml-auto">
                    <button type="submit" className="text-[9px] text-ivoire/80 hover:text-argile">Suppr.</button>
                  </form>
                </div>
              </div>
            ))}
        </div>
        <form action={addProductImage.bind(null, product.id)} className="flex items-center gap-3">
          <input type="file" name="file" accept="image/*" required className="text-sm" />
          <button type="submit" className="btn btn-ghost">Ajouter une image</button>
        </form>
      </div>

      <ProductForm categories={categories ?? []} product={product} action={updateProduct.bind(null, product.id)} />
    </div>
  );
}
