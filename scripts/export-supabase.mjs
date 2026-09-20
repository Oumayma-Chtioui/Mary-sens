import pg from 'pg';
import fs from 'fs';
import path from 'path';

pg.types.setTypeParser(1700, parseFloat); // numeric -> number
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
await client.connect();

const lit = (v) => {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'boolean') return v ? '1' : '0';
  if (typeof v === 'number') return String(v);
  if (v instanceof Date) return `'${v.toISOString()}'`;
  if (typeof v === 'object') v = JSON.stringify(v); // arrays + jsonb
  return `'${String(v).replace(/'/g, "''")}'`;
};

fs.mkdirSync('public/uploads', { recursive: true });
const seen = new Map();
async function localize(url) {
  if (!url || !url.startsWith('http')) return url;
  if (seen.has(url)) return seen.get(url);
  const res = await fetch(url);
  if (!res.ok) { console.warn('SKIPPED', res.status, url); return url; }
  const file = `${seen.size}-${path.basename(new URL(url).pathname)}`;
  fs.writeFileSync(path.join('public/uploads', file), Buffer.from(await res.arrayBuffer()));
  seen.set(url, `/uploads/${file}`);
  return `/uploads/${file}`;
}

// order matters (foreign keys)
const tables = ['categories', 'products', 'product_images', 'orders', 'order_items',
                'locations', 'contact_messages', 'site_settings'];
let out = '';
for (const t of tables) {
  const { rows } = await client.query(`select * from public.${t}`);
  for (const r of rows) {
    if (t === 'categories') r.image_url = await localize(r.image_url);
    if (t === 'product_images') r.url = await localize(r.url);
    const cols = Object.keys(r);
    out += `INSERT INTO ${t} (${cols.join(',')}) VALUES (${cols.map((c) => lit(r[c])).join(',')});\n`;
  }
  console.log(t, rows.length);
}
fs.writeFileSync('seed.sql', out);
await client.end();