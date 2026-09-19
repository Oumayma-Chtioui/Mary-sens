"use client";

import { useState } from "react";
import Papa from "papaparse";
import { importProducts, type ImportRow, type ImportResult } from "@/lib/actions/import";

export default function CsvImport() {
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [zipFileName, setZipFileName] = useState<string>("");
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

  function handleZip(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setZipFile(file);
    setZipFileName(file.name);
  }

  async function handleImport() {
    setImporting(true);
    const res = await importProducts(rows, zipFile);
    setResult(res);
    setImporting(false);
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="border border-border bg-ivoire p-6">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-[0.08em] text-ink/60">1. Fichier CSV des produits</h2>
        <p className="mb-4 text-sm text-ink/55">
          Colonnes attendues : <code>name, category, description, price, volume, ingredients, benefits, usage,
          precautions, availability, featured, image</code>. La colonne <code>image</code> est optionnelle : mettez
          soit le nom exact d&apos;un fichier dans le ZIP ci-dessous (ex. <code>roll-on.jpg</code>), soit une URL
          d&apos;image directe (https://...). Les produits importés sont créés en brouillon pour relecture.
        </p>
        <input type="file" accept=".csv" onChange={handleFile} className="text-sm" />
      </div>

      <div className="border border-border bg-ivoire p-6">
        <h2 className="mb-3 text-sm font-medium uppercase tracking-[0.08em] text-ink/60">
          2. Photos des produits (optionnel)
        </h2>
        <p className="mb-4 text-sm text-ink/55">
          Regroupez les photos dans un seul fichier <strong>.zip</strong> et téléversez-le ici. Chaque nom de
          fichier doit correspondre exactement à la colonne <code>image</code> du CSV. Gardez les lots raisonnables
          (une quinzaine de photos compressées à la fois) — les très gros ZIP peuvent dépasser la limite de
          l&apos;hébergeur.
        </p>
        <input type="file" accept=".zip" onChange={handleZip} className="text-sm" />
        {zipFileName && <p className="mt-2 text-xs text-sauge">{zipFileName} sélectionné</p>}
      </div>

      {rows.length > 0 && !result && (
        <div className="border border-border bg-ivoire p-6">
          <h2 className="mb-1 text-sm font-medium uppercase tracking-[0.08em] text-ink/60">3. Aperçu</h2>
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
                  <th className="px-3 py-2">Image</th>
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
                    <td className="px-3 py-2">{r.image || "—"}</td>
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
          <div className="mb-5 flex flex-wrap gap-8 text-sm">
            <span><strong className="font-display text-2xl">{result.totalDetected}</strong> produits détectés</span>
            <span className="text-sauge"><strong className="font-display text-2xl">{result.importedCount}</strong> importés</span>
            <span className="text-argile"><strong className="font-display text-2xl">{result.errorCount}</strong> erreurs</span>
            {zipFile && (
              <>
                <span className="text-sauge"><strong className="font-display text-2xl">{result.imagesMatchedCount}</strong> images associées</span>
                {result.imagesMissingCount > 0 && (
                  <span className="text-argile"><strong className="font-display text-2xl">{result.imagesMissingCount}</strong> images non trouvées</span>
                )}
              </>
            )}
          </div>
          {result.errors.length > 0 && (
            <div className="border border-argile/30 bg-argile/5 p-4">
              <p className="mb-2 text-sm font-medium text-argile">Détails</p>
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