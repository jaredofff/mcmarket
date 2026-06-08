// ============================================================
// MC Market - Empty catalog data layer
// Keep the shape of the future API data while real resources
// are loaded through admin/uploads.
// ============================================================

export type Category =
  | "Economy"
  | "RPG"
  | "Admin"
  | "Minigames"
  | "Mechanics"
  | "Social"
  | "Skyblock"
  | "PvP"
  | "Building"
  | "Utilities";

export interface Creator {
  id: string;
  username: string;
  avatar: string;
  verified: boolean;
  totalSales: number;
  joinedYear: number;
}

export interface Plugin {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: Category;
  price: number;
  isFree: boolean;
  tier: "vip" | "legend";
  coverImage: string;
  bannerImage: string;
  image: string;
  gallery: string[];
  rating: number;
  reviewCount: number;
  sales: number;
  downloads: number;
  version: string;
  testedVersions: string[];
  dependencies: string[];
  tags: string[];
  creator: Creator;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  testServerUrl?: string;
}

export const MOCK_CREATORS: Creator[] = [];

export const MOCK_PLUGINS: Plugin[] = [];

export const CATEGORIES: Category[] = [
  "Economy",
  "RPG",
  "Admin",
  "Minigames",
  "Mechanics",
  "Social",
  "Skyblock",
  "PvP",
  "Building",
  "Utilities",
];

export const MINECRAFT_VERSIONS = ["1.19", "1.20", "1.21"];
