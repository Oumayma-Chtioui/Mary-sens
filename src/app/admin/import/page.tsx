import CsvImport from "@/components/admin/CsvImport";

export default function AdminImportPage() {
  return (
    <div>
      <h1 className="mb-8 font-display text-3xl">Importer des produits (CSV)</h1>
      <CsvImport />
    </div>
  );
}
