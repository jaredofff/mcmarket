// Mock data para todas las categorías

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

export const CATEGORY_PRODUCTS: CategoryProduct[] = [
  // SETUPS
  {
    id: "setup-1",
    title: "Survival Server Pro Setup",
    slug: "survival-server-pro",
    category: "Setups",
    price: 24.99,
    isFree: false,
    rating: 4.9,
    reviewCount: 312,
    sales: 856,
    downloads: 2400,
    image: "https://images.unsplash.com/photo-1538481143235-a9e0fc25c6c9?w=500&h=300&fit=crop",
    shortDescription: "Setup completo optimizado para servidores survival con economía integrada",
    longDescription: "Setup profesional para servidores Survival de Minecraft con todas las características necesarias: sistema de economía, roles, protecciones y más. Completamente configurado y listo para usar.",
    features: ["Economía integrada", "Sistema de roles", "Protecciones avanzadas", "Teletransporte", "Hogar seguro", "PVP personalizable"],
    version: "1.20.1+",
    creator: { username: "ServerMaster", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ServerMaster", verified: true },
    featured: true,
    tags: ["survival", "economía", "completo"],
  },
  {
    id: "setup-2",
    title: "RPG World Complete",
    slug: "rpg-world-complete",
    category: "Setups",
    price: 34.99,
    isFree: false,
    rating: 4.7,
    reviewCount: 287,
    sales: 645,
    downloads: 1890,
    image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=300&fit=crop",
    shortDescription: "Mundo RPG completamente configurado con mobs, dungeons y bosses",
    longDescription: "Experienza RPG completa con dungeons personalizados, bosses épicos y sistema de misiones totalmente integrado. Para jugadores que buscan una aventura desafiante.",
    features: ["Dungeons personalizados", "Bosses épicos", "Sistema de misiones", "Drop especiales", "Artefactos únicos", "Balanceo PvP"],
    version: "1.20+",
    creator: { username: "RPGBuilder", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=RPGBuilder", verified: true },
    featured: false,
    tags: ["rpg", "mobs", "dungeons"],
  },
  {
    id: "setup-3",
    title: "Skywars Arena Setup",
    slug: "skywars-arena",
    category: "Setups",
    price: 19.99,
    isFree: false,
    rating: 4.8,
    reviewCount: 456,
    sales: 1203,
    downloads: 3100,
    image: "https://images.unsplash.com/photo-1578482346150-fb3b3e6b8667?w=500&h=300&fit=crop",
    shortDescription: "Arena de Skywars lista para jugar con 12 islas personalizadas",
    longDescription: "Arena competitiva de Skywars con 12 islas únicamente diseñadas, sistemas de eliminación y balance perfecto para partidas emocionantes.",
    features: ["12 islas únicas", "Sistema de eliminación", "Balance perfecto", "Música ambiental", "Efectos visuales", "Modo espectador"],
    version: "1.19+",
    creator: { username: "GameDev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=GameDev", verified: true },
    featured: false,
    tags: ["pvp", "arena", "skywars"],
  },

  // CONFIGS
  {
    id: "config-1",
    title: "Advanced Server Config Pack",
    slug: "advanced-config-pack",
    category: "Configs",
    price: 12.99,
    isFree: false,
    rating: 4.9,
    reviewCount: 534,
    sales: 1856,
    downloads: 4200,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    shortDescription: "Configuraciones profesionales optimizadas para máximo rendimiento",
    longDescription: "Pack completo de configuraciones para obtener máximo rendimiento en tu servidor. Incluye optimizaciones de paper.yml, spigot.yml, bukkit.yml y configuración de mundo.",
    features: ["Optimización máxima", "Bajo lag", "Paper optimizado", "Configuración de mundo", "Seguridad mejorada", "Rendimiento 60 TPS"],
    version: "Paper 1.20+",
    creator: { username: "ConfigMaster", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ConfigMaster", verified: true },
    featured: true,
    tags: ["performance", "configs", "optimización"],
  },
  {
    id: "config-2",
    title: "Custom Enchantments Config",
    slug: "custom-enchantments",
    category: "Configs",
    price: 9.99,
    isFree: false,
    rating: 4.6,
    reviewCount: 287,
    sales: 945,
    downloads: 2100,
    image: "https://images.unsplash.com/photo-1578482346150-fb3b3e6b8667?w=500&h=300&fit=crop",
    shortDescription: "Sistema de encantamientos personalizados con 50+ opciones",
    longDescription: "Sistema completo de encantamientos personalizados que permite crear y editar encantamientos únicos. Incluye 50+ opciones predefinidas y totalmente personalizable.",
    features: ["50+ encantamientos", "Totalmente personalizable", "Balanceo justo", "Rareza visual", "Efectos especiales", "Limitaciones configurables"],
    version: "1.18+",
    creator: { username: "EnchantPro", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=EnchantPro", verified: false },
    featured: false,
    tags: ["enchantments", "custom", "sistemas"],
  },
  {
    id: "config-3",
    title: "Economy System Config",
    slug: "economy-system",
    category: "Configs",
    price: 14.99,
    isFree: false,
    rating: 4.8,
    reviewCount: 412,
    sales: 1203,
    downloads: 3500,
    image: "https://images.unsplash.com/photo-1460925895917-adf4e566c072?w=500&h=300&fit=crop",
    shortDescription: "Sistema de economía completo con shops, bancos y transacciones",
    longDescription: "Sistema económico profesional con soporte para shops, bancos, moneda dual, y transacciones. Compatible con Vault y la mayoría de plugins de economía.",
    features: ["Economía dual", "Shops configurables", "Bancos con intereses", "Transacciones seguras", "Impuestos", "Historial de transacciones"],
    version: "1.17+",
    creator: { username: "EconDev", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=EconDev", verified: true },
    featured: false,
    tags: ["economía", "shops", "bancos"],
  },

  // BUILDS
  {
    id: "build-1",
    title: "Premium Lobby Castle",
    slug: "premium-lobby",
    category: "Builds",
    price: 29.99,
    isFree: false,
    rating: 4.9,
    reviewCount: 678,
    sales: 2341,
    downloads: 5600,
    image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=300&fit=crop",
    shortDescription: "Castillo premium para lobby con efectos de partículas y animaciones",
    longDescription: "Castillo premium totalmente construido y listo para usar como lobby de servidor. Incluye efectos de partículas, animaciones, NPCs decorativos y zona de espera.",
    features: ["Castillo completo", "Efectos de partículas", "Animaciones fluidas", "NPCs decorativos", "Zona de espera", "Iluminación profesional"],
    version: "1.16+",
    creator: { username: "BuildGods", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=BuildGods", verified: true },
    featured: true,
    tags: ["lobby", "castillo", "premium"],
  },
  {
    id: "build-2",
    title: "Nether Throne Build",
    slug: "nether-throne",
    category: "Builds",
    price: 22.99,
    isFree: false,
    rating: 4.7,
    reviewCount: 445,
    sales: 1678,
    downloads: 3800,
    image: "https://images.unsplash.com/photo-1538481143235-a9e0fc25c6c9?w=500&h=300&fit=crop",
    shortDescription: "Trono del Nether con estructuras oscuras y lava animada",
    longDescription: "Estructura impresionante del trono del Nether con detalles oscuros, lava animada y atmósfera ominosa. Perfecto para arenas de boss o salas especiales.",
    features: ["Lava animada", "Detalles oscuros", "Atmósfera épica", "Resistentes a grietas", "Luz ambiental", "Sonidos ambientales"],
    version: "1.15+",
    creator: { username: "ArchitectPro", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ArchitectPro", verified: true },
    featured: false,
    tags: ["nether", "trono", "oscuro"],
  },
  {
    id: "build-3",
    title: "Spawn Point Futuristic",
    slug: "spawn-futuristic",
    category: "Builds",
    price: 19.99,
    isFree: false,
    rating: 4.8,
    reviewCount: 523,
    sales: 1923,
    downloads: 4200,
    image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=300&fit=crop",
    shortDescription: "Spawn point futurista con tecnología holográfica",
    longDescription: "Diseño futurista de spawn con elementos holográficos, plataformas flotantes y tecnología de vanguardia. Transmite modernidad y profesionalismo.",
    features: ["Diseño futurista", "Plataformas flotantes", "Hologramas", "Iluminación LED", "Música de fondo", "Zona VIP"],
    version: "1.18+",
    creator: { username: "FutureBuild", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FutureBuild", verified: true },
    featured: false,
    tags: ["spawn", "futurista", "tech"],
  },

  // WEBS
  {
    id: "web-1",
    title: "Premium Shop Website",
    slug: "premium-shop-web",
    category: "Webs",
    price: 39.99,
    isFree: false,
    rating: 4.9,
    reviewCount: 234,
    sales: 567,
    downloads: 1200,
    image: "https://images.unsplash.com/photo-1460925895917-adf4e566c072?w=500&h=300&fit=crop",
    shortDescription: "Página web premium con tienda Tebex integrada y diseño moderno",
    longDescription: "Página web profesional con tienda Tebex completamente integrada, carritos de compra y procesamiento de pagos. Diseño responsivo y moderno.",
    features: ["Tienda Tebex integrada", "Carrito de compras", "Pagos seguros", "Responsiva", "SEO optimizado", "Soporte 24/7"],
    version: "HTML5/CSS3",
    creator: { username: "WebDesigner", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=WebDesigner", verified: true },
    featured: true,
    tags: ["web", "tienda", "tebex"],
  },
  {
    id: "web-2",
    title: "Community Portal",
    slug: "community-portal",
    category: "Webs",
    price: 34.99,
    isFree: false,
    rating: 4.7,
    reviewCount: 189,
    sales: 423,
    downloads: 890,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop",
    shortDescription: "Portal de comunidad con foro, estadísticas y rankings",
    longDescription: "Portal completo de comunidad con foro integrado, estadísticas de jugadores, rankings en vivo y sistema de reputación para fomentar la interacción.",
    features: ["Foro integrado", "Rankings en vivo", "Estadísticas", "Sistema de reputación", "Perfiles de usuario", "Notificaciones"],
    version: "PHP/MySQL",
    creator: { username: "CommunityPro", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=CommunityPro", verified: false },
    featured: false,
    tags: ["comunidad", "foro", "rankings"],
  },
  {
    id: "web-3",
    title: "Modern Store Theme",
    slug: "modern-store",
    category: "Webs",
    price: 29.99,
    isFree: false,
    rating: 4.8,
    reviewCount: 312,
    sales: 834,
    downloads: 1540,
    image: "https://images.unsplash.com/photo-1460925895917-adf4e566c072?w=500&h=300&fit=crop",
    shortDescription: "Tema de tienda moderno y responsivo para servidores",
    longDescription: "Tema moderno y responsivo para tiendas de servidores. Incluye galería de productos, carrito dinámico y pasarela de pagos integrada.",
    features: ["Diseño moderno", "Responsivo", "Galería de productos", "Carrito dinámico", "Pasarela de pagos", "Actualización automática"],
    version: "React/Node.js",
    creator: { username: "ModernWeb", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ModernWeb", verified: true },
    featured: false,
    tags: ["web", "tienda", "responsive"],
  },
];

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
