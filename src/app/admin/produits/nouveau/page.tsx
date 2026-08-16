import { createClient } from "@/lib/supabase/server";
import { createProduct } from "@/lib/actions/products";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("position");

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl">Nouveau produit</h1>
      <ProductForm categories={categories ?? []} action={createProduct} />
    </div>
  );
}
