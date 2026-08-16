-- ============================================================
-- Mary'sens — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- on a fresh project. Safe to re-run thanks to IF NOT EXISTS guards
-- where practical.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- categories ----------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  position int not null default 0,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- products ----------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  short_description text,
  full_description text,
  category_id uuid references categories(id) on delete set null,
  price numeric(10,2),
  price_visible boolean not null default false,
  is_available boolean not null default true,
  sku text,
  volume text,
  ingredients text,
  benefits text,
  usage_instructions text,
  precautions text,
  tags text[] not null default '{}',
  is_featured boolean not null default false,
  is_published boolean not null default true,
  position int not null default 0,
  whatsapp_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_category_idx on products(category_id);
create index if not exists products_published_idx on products(is_published);

-- ---------- product_images ----------
create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  position int not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists product_images_product_idx on product_images(product_id);

-- ---------- locations ----------
create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  city text,
  phone text,
  opening_hours text,
  maps_url text,
  latitude double precision,
  longitude double precision,
  description text,
  is_visible boolean not null default true,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- contact_messages ----------
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  status text not null default 'new' check (status in ('new','read','handled')),
  created_at timestamptz not null default now()
);

-- ---------- site_settings (single JSONB row) ----------
create table if not exists site_settings (
  id int primary key default 1,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);
insert into site_settings (id, data) values (1, '{}'::jsonb)
  on conflict (id) do nothing;

-- ---------- admin_users ----------
-- One row per person allowed into /admin. Insert a row here (with the
-- matching auth.users id) after creating the user in Supabase Auth.
create table if not exists admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

-- Helper used throughout the RLS policies below.
create or replace function is_admin() returns boolean as $$
  select exists (select 1 from admin_users where id = auth.uid());
$$ language sql stable security definer set search_path = public;

-- ============================================================
-- updated_at triggers
-- ============================================================
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_categories_updated_at on categories;
create trigger trg_categories_updated_at before update on categories
  for each row execute function set_updated_at();

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at before update on products
  for each row execute function set_updated_at();

drop trigger if exists trg_locations_updated_at on locations;
create trigger trg_locations_updated_at before update on locations
  for each row execute function set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table locations enable row level security;
alter table contact_messages enable row level security;
alter table site_settings enable row level security;
alter table admin_users enable row level security;

-- categories: public can read visible rows, admins can do everything
create policy "categories_public_read" on categories for select
  using (is_visible = true or is_admin());
create policy "categories_admin_write" on categories for all
  using (is_admin()) with check (is_admin());

-- products: public can read published rows, admins can do everything
create policy "products_public_read" on products for select
  using (is_published = true or is_admin());
create policy "products_admin_write" on products for all
  using (is_admin()) with check (is_admin());

-- product_images: readable alongside their product, admin-writable
create policy "product_images_public_read" on product_images for select
  using (
    is_admin() or exists (
      select 1 from products p where p.id = product_id and p.is_published = true
    )
  );
create policy "product_images_admin_write" on product_images for all
  using (is_admin()) with check (is_admin());

-- locations: public can read visible rows, admins can do everything
create policy "locations_public_read" on locations for select
  using (is_visible = true or is_admin());
create policy "locations_admin_write" on locations for all
  using (is_admin()) with check (is_admin());

-- contact_messages: anyone can submit (insert), only admins can read/manage
create policy "contact_messages_public_insert" on contact_messages for insert
  with check (true);
create policy "contact_messages_admin_read" on contact_messages for select
  using (is_admin());
create policy "contact_messages_admin_write" on contact_messages for update
  using (is_admin()) with check (is_admin());
create policy "contact_messages_admin_delete" on contact_messages for delete
  using (is_admin());

-- site_settings: publicly readable (drives the public site), admin-writable
create policy "site_settings_public_read" on site_settings for select
  using (true);
create policy "site_settings_admin_write" on site_settings for update
  using (is_admin()) with check (is_admin());

-- admin_users: admins can see the admin list; no public access
create policy "admin_users_admin_read" on admin_users for select
  using (is_admin());

-- ============================================================
-- Storage bucket for product & category images
-- ============================================================
insert into storage.buckets (id, name, public)
  values ('marysens-media', 'marysens-media', true)
  on conflict (id) do nothing;

create policy "media_public_read" on storage.objects for select
  using (bucket_id = 'marysens-media');
create policy "media_admin_write" on storage.objects for insert
  with check (bucket_id = 'marysens-media' and is_admin());
create policy "media_admin_update" on storage.objects for update
  using (bucket_id = 'marysens-media' and is_admin());
create policy "media_admin_delete" on storage.objects for delete
  using (bucket_id = 'marysens-media' and is_admin());
