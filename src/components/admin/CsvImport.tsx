"use client";

import { useState } from "react";
import Papa from "papaparse";
import { importProducts, type ImportRow, type ImportResult } from "@/lib/actions/import";

export default function CsvImport() {
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [result, setResult] = useState<ImportResult | null>(null);
  const [importing, setImporting] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);

    Papa.parse<ImportRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => setRows(res.data),
    });
  }

  async function handleImport() {
    setImporting(true);
    const res = await importProducts(rows);
    setResult(res);
    setImporting(false);
  }

  const invalidRowNames = new Set((result?.errors ?? []).map((e) => e.name));

  return (
    <div className="flex flex-col gap-8">
      <div className="border border-border bg-ivoire p-6">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-[0.08em] text-ink/60">1. Importer un fichier CSV</h2>
        <p className="mb-4 text-sm text-ink/55">
          Colonnes attendues : <code>name, category, description, price, volume, ingredients, benefits, usage,
          precautions, availability, featured</code>. Les produits importés sont créés en brouillon pour relecture.
        </p>
        <input type="file" accept=".csv" onChange={handleFile} className="text-sm" />
      </div>

      {rows.length > 0 && !result && (
        <div className="border border-border bg-ivoire p-6">
          <h2 className="mb-1 text-sm font-medium uppercase tracking-[0.08em] text-ink/60">2. Aperçu</h2>
          <p className="mb-4 text-sm text-ink/55">
            <strong>{rows.length}</strong> produits détectés dans <em>{fileName}</em>.
          </p>
          <div className="max-h-80 overflow-auto border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-ivoire-2 uppercase tracking-[0.05em] text-ink/50">
                <tr>
                  <th className="px-3 py-2">Nom</th>
                  <th className="px-3 py-2">Catégorie</th>
                  <th className="px-3 py-2">Prix</th>
                  <th className="px-3 py-2">Disponible</th>
                  <th className="px-3 py-2">Mis en avant</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-3 py-2">{r.name || <span className="text-argile">manquant</span>}</td>
                    <td className="px-3 py-2">{r.category || "—"}</td>
                    <td className="px-3 py-2">{r.price || "—"}</td>
                    <td className="px-3 py-2">{r.availability || "—"}</td>
                    <td className="px-3 py-2">{r.featured || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={handleImport} disabled={importing} className="btn btn-dark mt-5 disabled:opacity-50">
            {importing ? "Import en cours…" : `Importer ${rows.length} produits`}
          </button>
        </div>
      )}

      {result && (
        <div className="border border-border bg-ivoire p-6">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.08em] text-ink/60">Résultat de l&apos;import</h2>
          <div className="mb-5 flex gap-8 text-sm">
            <span><strong className="font-display text-2xl">{result.totalDetected}</strong> produits détectés</span>
            <span className="text-sauge"><strong className="font-display text-2xl">{result.importedCount}</strong> importés</span>
            <span className="text-argile"><strong className="font-display text-2xl">{result.errorCount}</strong> erreurs</span>
          </div>
          {result.errors.length > 0 && (
            <div className="border border-argile/30 bg-argile/5 p-4">
              <p className="mb-2 text-sm font-medium text-argile">Lignes en erreur</p>
              <ul className="space-y-1 text-xs text-ink/70">
                {result.errors.map((e, i) => (
                  <li key={i}>Ligne {e.row} — {e.name} : {e.reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
