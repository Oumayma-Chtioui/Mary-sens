import { asc } from "drizzle-orm";
import { categories } from "@/db/schema";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/require-admin";
import { createProduct } from "@/lib/actions/products";
import ProductForm from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  await requireAdmin();
  const categoryRows = await getDb().select().from(categories).orderBy(asc(categories.position));

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl">Nouveau produit</h1>
      <ProductForm categories={categoryRows} action={createProduct} />
    </div>
  );
}
