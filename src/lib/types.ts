export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  position: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  position: number;
  is_primary: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  category_id: string | null;
  category?: Category | null;
  price: number | null;
  price_visible: boolean;
  is_available: boolean;
  sku: string | null;
  volume: string | null;
  ingredients: string | null;
  benefits: string | null;
  usage_instructions: string | null;
  precautions: string | null;
  tags: string[];
  is_featured: boolean;
  is_published: boolean;
  position: number;
  whatsapp_enabled: boolean;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
};

export type Location = {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  opening_hours: string | null;
  maps_url: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  is_visible: boolean;
  position: number;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: "new" | "read" | "handled";
  created_at: string;
};

export type SiteSettings = {
  brand_name: string;
  logo_url: string;
  description: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  hero_title: string;
  hero_tagline: string;
  hero_description: string;
  hero_image: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;
  about_story: string;
  about_mission: string;
  about_values: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  address: string;
  seo_title: string;
  seo_description: string;
};
