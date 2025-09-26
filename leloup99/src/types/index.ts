export interface Product {
  id: number;
  name: string;
  description: string;
  category_id: number;
  farm_id: number;
  image_url: string;
  video_url: string;
  price: number;
  stock: number;
  prices: string;
  is_available: boolean;
  features: string;
  tags: string;
  created_at: string;
  category?: Category;
  farm?: Farm;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  created_at: string;
}

export interface Farm {
  id: number;
  name: string;
  description: string;
  location: string;
  contact: string;
  created_at: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  icon: string;
  is_available: boolean;
  created_at: string;
}

export interface Settings {
  id: number;
  background_image: string;
  background_opacity: number;
  background_blur: number;
  info_content: string;
  contact_content: string;
  shop_title: string;
  whatsapp_link: string;
  whatsapp_number: string;
  scrolling_text: string;
  theme_color: string;
  created_at: string;
}