// /src/lib/types/product.ts

export type ChangeType = 'added' | 'fixed' | 'improved' | 'removed';

export interface ChangelogChange {
  type: ChangeType;
  text: string;
}

export interface Changelog {
  version: string;
  date: string;
  title: string;
  description: string;
  changes: ChangelogChange[];
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  verified: boolean;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string; // Markdown
  price: number;
  rating: number; // 0-5
  reviewCount: number;
  downloads: number;
  image: string; // URL
  gallery?: string[];
  videoUrl?: string;
  compatible_versions: string[];
  dependencies: string[];
  current_version: string;
  current_hash: string; // SHA-256
  last_updated: string; // ISO date
  changelogs: Changelog[];
  features: string[];
  tags: string[];
  // Optional fields
  testimonials?: string[];
  videoDemo?: {
    url: string;
    title: string;
  };
  bundleInfo?: {
    name: string;
    savings: number; // percentage
    products: string[]; // product ids
  };
}

export interface ProductDetailPageProps {
  product: Product;
  isWishlisted?: boolean;
}
