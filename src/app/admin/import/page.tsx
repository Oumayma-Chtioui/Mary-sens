import CsvImport from "@/components/admin/CsvImport";
import { requireAdmin } from "@/lib/require-admin";

export default async function AdminImportPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="mb-8 font-display text-3xl">Importer des produits (CSV)</h1>
      <CsvImport />
    </div>
  );
}
