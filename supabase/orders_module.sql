-- ============================================================
-- Mary'sens — Orders module (additive migration)
-- Run this in the Supabase SQL editor AFTER the initial schema.sql has
-- already been applied (it relies on the is_admin() function and the
-- set_updated_at trigger pattern defined there). Safe to run once on an
-- existing, already-live project — it only adds two new tables and does
-- not touch products, categories, or anything else.
-- ============================================================

create sequence if not exists orders_number_seq start 1;

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('MS-' || lpad(nextval('orders_number_seq')::text, 6, '0')),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  customer_address text not null,
  customer_city text not null,
  notes text,
  status text not null default 'Nouvelle'
    check (status in ('Nouvelle','Confirmée','En préparation','Expédiée','Livrée','Annulée')),
  total_amount numeric(10,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  -- Kept as `set null` (not cascade) so an order's history survives even if
  -- the product it referenced is later deleted from the catalogue.
  product_id uuid references products(id) on delete set null,
  -- Name and price are captured at order time, not looked up live later —
  -- product prices can change after an order is placed.
  product_name text not null,
  unit_price numeric(10,2) not null,
  quantity int not null check (quantity > 0),
  subtotal numeric(10,2) not null,
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_idx on order_items(order_id);
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_created_idx on orders(created_at desc);

-- Re-declared defensively (idempotent) in case this file is ever run on a
-- database where schema.sql's version isn't already present.
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_orders_updated_at on orders;
create trigger trg_orders_updated_at before update on orders
  for each row execute function set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table orders enable row level security;
alter table order_items enable row level security;

-- Admin (session-based, via the existing admin_users / is_admin() check)
-- gets full access for the admin "Commandes" section.
create policy "orders_admin_all" on orders for all
  using (is_admin()) with check (is_admin());
create policy "order_items_admin_all" on order_items for all
  using (is_admin()) with check (is_admin());

-- Deliberately no public/anon policies here. Order creation and the
-- customer-facing order-status lookup both run through server-only Next.js
-- code using the Supabase service-role key (see src/app/api/orders/route.ts
-- and src/app/commande/confirmation/[id]/page.tsx), which bypasses RLS in a
-- fully trusted, server-only context — the anon/browser key never touches
-- these tables directly, so there is no public insert/select surface to
-- lock down here. This also satisfies "no browsing other customers' orders":
-- there is no listable public endpoint, only single-row server-side lookups
-- by the exact (unguessable) order id.
