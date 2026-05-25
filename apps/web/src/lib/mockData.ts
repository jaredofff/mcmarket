// ============================================================
// MC Market — Mock Data Layer
// This file simulates the backend API. When your partner
// finishes the real API, just swap the import source.
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

// ─── Creators ───────────────────────────────────────────────
export const MOCK_CREATORS: Creator[] = [
  {
    id: "creator-1",
    username: "StoneForge",
    avatar: "https://api.dicebear.com/8.x/pixel-art/svg?seed=StoneForge",
    verified: true,
    totalSales: 12400,
    joinedYear: 2020,
  },
  {
    id: "creator-2",
    username: "RedstoneWizard",
    avatar: "https://api.dicebear.com/8.x/pixel-art/svg?seed=RedstoneWizard",
    verified: true,
    totalSales: 8900,
    joinedYear: 2021,
  },
  {
    id: "creator-3",
    username: "CraftLabs",
    avatar: "https://api.dicebear.com/8.x/pixel-art/svg?seed=CraftLabs",
    verified: true,
    totalSales: 31000,
    joinedYear: 2019,
  },
  {
    id: "creator-4",
    username: "PixelDev",
    avatar: "https://api.dicebear.com/8.x/pixel-art/svg?seed=PixelDev",
    verified: false,
    totalSales: 450,
    joinedYear: 2023,
  },
  {
    id: "creator-5",
    username: "NetherForge",
    avatar: "https://api.dicebear.com/8.x/pixel-art/svg?seed=NetherForge",
    verified: true,
    totalSales: 5200,
    joinedYear: 2022,
  },
];

// ─── Plugins ────────────────────────────────────────────────
export const MOCK_PLUGINS: Plugin[] = [
  {
    id: "plugin-1",
    slug: "advanced-economy",
    title: "Advanced Economy",
    shortDescription: "Complete economy system with banks, shops, and auction house.",
    description:
      "The most complete economy plugin for your Minecraft server. Includes player banks with interest rates, a fully configurable shop system, an auction house with bidding, currency exchange, and a rich transaction history. Integrates with Vault and all major permission plugins.",
    category: "Economy",
    price: 14.99,
    isFree: false,
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=800&auto=format&fit=crop",
    ],
    rating: 4.9,
    reviewCount: 347,
    sales: 1200,
    downloads: 4500,
    version: "3.2.1",
    testedVersions: ["1.19", "1.20", "1.21"],
    dependencies: ["Vault", "LuckPerms"],
    tags: ["economy", "shop", "auction", "vault"],
    creator: MOCK_CREATORS[0],
    createdAt: "2021-03-15",
    updatedAt: "2024-11-20",
    featured: true,
    testServerUrl: "play.stoneforge.net",
  },
  {
    id: "plugin-2",
    slug: "mythic-mobs-pro",
    title: "Mythic Mobs Pro",
    shortDescription: "Create custom mobs with advanced AI, skills and loot tables.",
    description:
      "Design hundreds of custom mobs with powerful skill trees, complex AI behaviors, and configurable loot tables. Supports boss bars, custom models (ModelEngine compatible), and deep integration with MythicCraft's ecosystem.",
    category: "RPG",
    price: 24.99,
    isFree: false,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    ],
    rating: 4.8,
    reviewCount: 512,
    sales: 3400,
    downloads: 9800,
    version: "5.6.0",
    testedVersions: ["1.20", "1.21"],
    dependencies: ["ModelEngine"],
    tags: ["mobs", "rpg", "boss", "custom mobs"],
    creator: MOCK_CREATORS[2],
    createdAt: "2020-07-01",
    updatedAt: "2025-01-10",
    featured: true,
  },
  {
    id: "plugin-3",
    slug: "ultimate-anti-cheat",
    title: "Ultimate Anti-Cheat",
    shortDescription: "Server-side anti-cheat with low false positives and real-time alerts.",
    description:
      "Protect your server with our cutting-edge server-side anti-cheat. Detects fly, speed, kill-aura, reach, and 30+ other hacks without false positives. Sends real-time Discord alerts and maintains a detailed violation log.",
    category: "Admin",
    price: 19.99,
    isFree: false,
    image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800&auto=format&fit=crop",
    ],
    rating: 5.0,
    reviewCount: 891,
    sales: 5100,
    downloads: 14200,
    version: "2.1.4",
    testedVersions: ["1.19", "1.20", "1.21"],
    dependencies: [],
    tags: ["anti-cheat", "security", "admin", "protection"],
    creator: MOCK_CREATORS[2],
    createdAt: "2019-11-20",
    updatedAt: "2025-02-01",
    featured: true,
    testServerUrl: "test.craftlabs.io",
  },
  {
    id: "plugin-4",
    slug: "skyblock-core",
    title: "Skyblock Core",
    shortDescription: "Full Skyblock gamemode with islands, challenges and leaderboards.",
    description:
      "The definitive Skyblock core plugin. Handles island creation, island upgrades, a full challenge system, island leveling, cooperative islands, and global leaderboards. Highly optimized for servers with 500+ concurrent players.",
    category: "Skyblock",
    price: 29.99,
    isFree: false,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop",
    ],
    rating: 4.7,
    reviewCount: 203,
    sales: 850,
    downloads: 2100,
    version: "1.8.3",
    testedVersions: ["1.20", "1.21"],
    dependencies: ["Advanced Economy", "Vault"],
    tags: ["skyblock", "islands", "gamemode"],
    creator: MOCK_CREATORS[1],
    createdAt: "2022-06-10",
    updatedAt: "2024-12-05",
    featured: false,
  },
  {
    id: "plugin-5",
    slug: "custom-enchants-plus",
    title: "Custom Enchants+",
    shortDescription: "Over 80 unique enchantments with a custom enchanting table UI.",
    description:
      "Adds 80+ new and unique enchantments to your server through a beautiful custom UI. Includes powerful tiers (Common, Rare, Legendary), enchantment combining, and full compatibility with vanilla enchantments.",
    category: "Mechanics",
    price: 9.99,
    isFree: false,
    image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=800&auto=format&fit=crop",
    ],
    rating: 4.6,
    reviewCount: 178,
    sales: 2100,
    downloads: 6300,
    version: "4.0.1",
    testedVersions: ["1.19", "1.20", "1.21"],
    dependencies: [],
    tags: ["enchantments", "rpg", "items"],
    creator: MOCK_CREATORS[4],
    createdAt: "2021-09-05",
    updatedAt: "2024-09-30",
    featured: false,
  },
  {
    id: "plugin-6",
    slug: "guilds-and-parties",
    title: "Guilds & Parties",
    shortDescription: "Fully featured guild system with wars, alliances and chat.",
    description:
      "Create a thriving community with our Guilds & Parties plugin. Players can form guilds, declare war, form alliances, set guild homes, and communicate via a dedicated guild chat. Includes a rich guild hall upgrade system.",
    category: "Social",
    price: 12.99,
    isFree: false,
    image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop",
    ],
    rating: 4.9,
    reviewCount: 290,
    sales: 1500,
    downloads: 4800,
    version: "2.4.0",
    testedVersions: ["1.20", "1.21"],
    dependencies: ["LuckPerms"],
    tags: ["guilds", "social", "clans", "parties"],
    creator: MOCK_CREATORS[1],
    createdAt: "2022-01-18",
    updatedAt: "2025-01-25",
    featured: true,
  },
  {
    id: "plugin-7",
    slug: "pvp-arena-pro",
    title: "PvP Arena Pro",
    shortDescription: "1v1 and team arena system with rankings and spectator mode.",
    description:
      "Build a competitive PvP scene on your server. Supports 1v1 duels, 2v2, 5v5 team fights, and free-for-all. Includes an ELO ranking system, custom kits per arena, a spectator mode, and detailed match statistics.",
    category: "PvP",
    price: 17.99,
    isFree: false,
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=800&auto=format&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 134,
    sales: 780,
    downloads: 2200,
    version: "1.3.2",
    testedVersions: ["1.20", "1.21"],
    dependencies: [],
    tags: ["pvp", "duels", "arena", "competitive"],
    creator: MOCK_CREATORS[3],
    createdAt: "2023-04-22",
    updatedAt: "2024-10-15",
    featured: false,
  },
  {
    id: "plugin-8",
    slug: "better-spawn",
    title: "BetterSpawn",
    shortDescription: "Advanced spawn management with regions, rules and welcome screens.",
    description:
      "Take full control of your server spawn. Define protected regions, configure a welcome screen with server rules shown on first join, set per-world spawns, and handle respawn logic with precision. Lightweight and dependency-free.",
    category: "Utilities",
    price: 0,
    isFree: true,
    image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?q=80&w=800&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 88,
    sales: 0,
    downloads: 8900,
    version: "1.1.0",
    testedVersions: ["1.19", "1.20", "1.21"],
    dependencies: [],
    tags: ["spawn", "utilities", "free", "admin"],
    creator: MOCK_CREATORS[3],
    createdAt: "2023-08-01",
    updatedAt: "2024-07-20",
    featured: false,
  },
  {
    id: "plugin-9",
    slug: "world-builder-tools",
    title: "World Builder Tools",
    shortDescription: "Selection, brushes and schematic tools for builders.",
    description:
      "A powerful building toolkit for your server's build team. Includes a full selection wand, sphere/cylinder brushes, schematic import/export, and a history system (//undo, //redo). Lightweight alternative to full WorldEdit for build servers.",
    category: "Building",
    price: 7.99,
    isFree: false,
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 62,
    sales: 340,
    downloads: 1200,
    version: "2.0.0",
    testedVersions: ["1.20", "1.21"],
    dependencies: [],
    tags: ["building", "worldedit", "tools", "schematics"],
    creator: MOCK_CREATORS[4],
    createdAt: "2023-11-10",
    updatedAt: "2025-01-05",
    featured: false,
  },
  {
    id: "plugin-10",
    slug: "minigame-framework",
    title: "Minigame Framework",
    shortDescription: "API and base classes to build custom minigames rapidly.",
    description:
      "Stop reinventing the wheel. This framework provides all the boilerplate for minigames: lobby system, countdown, game state machine, team management, scoreboard integration, and a spectator API. Build your custom game in hours, not weeks.",
    category: "Minigames",
    price: 0,
    isFree: true,
    image: "https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=800&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=800&auto=format&fit=crop",
    ],
    rating: 4.8,
    reviewCount: 155,
    sales: 0,
    downloads: 12000,
    version: "3.1.0",
    testedVersions: ["1.20", "1.21"],
    dependencies: [],
    tags: ["minigames", "framework", "api", "free"],
    creator: MOCK_CREATORS[0],
    createdAt: "2020-12-01",
    updatedAt: "2024-08-30",
    featured: false,
  },
];

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
