import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

const now = sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`;
const id = () => text('id').primaryKey().$defaultFn(() => crypto.randomUUID());
const createdAt = () => text('created_at').notNull().default(now);
const updatedAt = () =>
  text('updated_at').notNull().default(now).$onUpdate(() => new Date().toISOString());

export const adminUsers = sqliteTable('admin_users', {
  id: text('id').primaryKey(), // = Better Auth user id
  full_name: text('full_name'),
  created_at: createdAt(),
});

export const categories = sqliteTable('categories', {
  id: id(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  image_url: text('image_url'),
  position: integer('position').notNull().default(0),
  is_visible: integer('is_visible', { mode: 'boolean' }).notNull().default(true),
  created_at: createdAt(),
  updated_at: updatedAt(),
});

export const products = sqliteTable('products', {
  id: id(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  short_description: text('short_description'),
  full_description: text('full_description'),
  category_id: text('category_id').references(() => categories.id, { onDelete: 'set null' }),
  price: real('price'),
  price_visible: integer('price_visible', { mode: 'boolean' }).notNull().default(false),
  is_available: integer('is_available', { mode: 'boolean' }).notNull().default(true),
  sku: text('sku'),
  volume: text('volume'),
  ingredients: text('ingredients'),
  benefits: text('benefits'),
  usage_instructions: text('usage_instructions'),
  precautions: text('precautions'),
  tags: text('tags', { mode: 'json' }).$type<string[]>().notNull().default(sql`'[]'`),
  is_featured: integer('is_featured', { mode: 'boolean' }).notNull().default(false),
  is_published: integer('is_published', { mode: 'boolean' }).notNull().default(true),
  position: integer('position').notNull().default(0),
  whatsapp_enabled: integer('whatsapp_enabled', { mode: 'boolean' }).notNull().default(true),
  created_at: createdAt(),
  updated_at: updatedAt(),
}, (t) => [index('products_category_idx').on(t.category_id)]);

export const productImages = sqliteTable('product_images', {
  id: id(),
  product_id: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  position: integer('position').notNull().default(0),
  is_primary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),
  created_at: createdAt(),
}, (t) => [index('product_images_product_idx').on(t.product_id)]);

export const orders = sqliteTable('orders', {
  id: id(),
  order_number: text('order_number').notNull().unique(),
  customer_name: text('customer_name').notNull(),
  customer_phone: text('customer_phone').notNull(),
  customer_email: text('customer_email'),
  customer_address: text('customer_address').notNull(),
  customer_city: text('customer_city').notNull(),
  notes: text('notes'),
  status: text('status').notNull().default('Nouvelle'),
  total_amount: real('total_amount').notNull().default(0),
  created_at: createdAt(),
  updated_at: updatedAt(),
});

export const orderItems = sqliteTable('order_items', {
  id: id(),
  order_id: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  product_id: text('product_id').references(() => products.id, { onDelete: 'set null' }),
  product_name: text('product_name').notNull(),
  unit_price: real('unit_price').notNull(),
  quantity: integer('quantity').notNull(),
  subtotal: real('subtotal').notNull(),
  created_at: createdAt(),
});

export const locations = sqliteTable('locations', {
  id: id(),
  name: text('name').notNull(),
  address: text('address'),
  city: text('city'),
  phone: text('phone'),
  opening_hours: text('opening_hours'),
  maps_url: text('maps_url'),
  latitude: real('latitude'),
  longitude: real('longitude'),
  description: text('description'),
  is_visible: integer('is_visible', { mode: 'boolean' }).notNull().default(true),
  position: integer('position').notNull().default(0),
  created_at: createdAt(),
  updated_at: updatedAt(),
});

export const contactMessages = sqliteTable('contact_messages', {
  id: id(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject'),
  message: text('message').notNull(),
  status: text('status').notNull().default('new'),
  created_at: createdAt(),
});

export const siteSettings = sqliteTable('site_settings', {
  id: integer('id').primaryKey().default(1),
  data: text('data', { mode: 'json' }).$type<Record<string, unknown>>().notNull().default(sql`'{}'`),
  updated_at: updatedAt(),
});

export const rateLimits = sqliteTable('rate_limits', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull(),
  created_at: createdAt(),
}, (t) => [index('rate_limits_key_idx').on(t.key, t.created_at)]);
export * from './auth-schema';