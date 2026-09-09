export interface Variant { id: string; sku: string; price: number; stockQuantity: number; image?: string | null; attributes: Record<string, string | number | boolean | null> }
export interface Category { id: string; name: string; slug: string }
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string | null;
  brand?: string | null;
  basePrice: number;
  thumbnail: string | null;
  images?: string[];
  videoUrls?: string[];
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  compareAtPrice?: number;
  saleEndsAt?: string | null;
  specifications?: Record<string, string>;
  careInstructions?: string | null;
  category?: Category;
  variants: Variant[];
}
