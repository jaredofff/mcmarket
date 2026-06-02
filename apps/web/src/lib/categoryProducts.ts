export interface CategoryProduct {
  id: string;
  title: string;
  slug: string;
  category: "Setups" | "Configs" | "Builds" | "Webs";
  price: number;
  isFree: boolean;
  rating: number;
  reviewCount: number;
  sales: number;
  downloads: number;
  image: string;
  shortDescription: string;
  longDescription?: string;
  features?: string[];
  version?: string;
  creator: {
    username: string;
    avatar: string;
    verified: boolean;
  };
  featured: boolean;
  tags: string[];
}

export const CATEGORY_PRODUCTS: CategoryProduct[] = [];

export const getCategoryProducts = (category: string) => {
  return CATEGORY_PRODUCTS.filter((p) => p.category === category);
};

export const getCategoryInfo = (category: string) => {
  const info: Record<string, { emoji: string; description: string; color: string }> = {
    Setups: {
      emoji: "🖥️",
      description: "Setups completos listos para desplegar en minutos",
      color: "from-blue-500 to-cyan-600",
    },
    Configs: {
      emoji: "⚙️",
      description: "Configuraciones profesionales y modelos 3D custom",
      color: "from-purple-500 to-pink-600",
    },
    Builds: {
      emoji: "🏗️",
      description: "Construcciones premium para lobbies y spawnpoints",
      color: "from-orange-500 to-red-600",
    },
    Webs: {
      emoji: "🌐",
      description: "Webs y tiendas Tebex listas para tu servidor",
      color: "from-green-500 to-emerald-600",
    },
  };
  return info[category] || info.Setups;
};
