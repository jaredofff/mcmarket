import type { Product } from "@/lib/types/product";

export const MOCK_PRODUCTS: Product[] = [];

export function getProductBySlug(slug: string): Product | undefined {
  return MOCK_PRODUCTS.find((product) => product.slug === slug);
}

export function getAllProductSlugs(): string[] {
  return MOCK_PRODUCTS.map((product) => product.slug);
}
