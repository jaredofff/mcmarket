import ProductDetailPage from '@/components/ProductDetailPage';

// Mock product data for demonstration
const MOCK_PRODUCT = {
  id: 'advanced-economy-1',
  name: 'Advanced Economy Pro',
  slug: 'advanced-economy-pro',
  price: 24.99,
  rating: 4.8,
  reviewCount: 512,
  downloads: 15420,
  image:
    'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=1200&h=675&fit=crop',
  compatible_versions: ['1.17', '1.18', '1.19', '1.20', '1.20.1', '1.21'],
  dependencies: ['Vault', 'PlaceholderAPI (Optional)'],
  current_version: '3.2.1',
  current_hash: 'a7f8b2c9e4d1f6a3b8c2e5f9d4a1b8e7c2f6a9d3e8b1c4f7a2d5e8c1f4a9b',
  last_updated: '2024-05-20',
  features: [
    '💰 Advanced Currency System with Multi-Currency Support',
    '📊 Real-time Economy Dashboard with Analytics',
    '🏦 Vault Integration for Seamless Payment Processing',
    '⚡ Performance Optimized for Large Networks',
    '🔐 Secure Transaction Logging & Audit Trails',
    '📈 Dynamic Pricing & Market Simulation',
    '🎯 Customizable Eco Events & Inflation Control',
    '🛠️ Extensive API for Custom Integrations',
  ],
  tags: ['Economy', 'Premium', 'Network-Ready', 'Multi-Version'],
  description: `# Advanced Economy Pro

Welcome to the next generation of Minecraft server economics. Advanced Economy Pro is a production-grade plugin designed for serious server operators who demand performance, security, and flexibility.

## Why Choose Advanced Economy Pro?

Unlike basic economy plugins, Advanced Economy Pro provides:

### 🚀 **Performance**
Built with multi-threaded database access and intelligent caching. Handles 500+ concurrent transactions per second without breaking a sweat.

### 🔒 **Enterprise Security**
- SHA-256 hashed transactions
- Audit logging for compliance
- Rate limiting to prevent exploits
- Support for encrypted storage

### 📊 **Advanced Features**
- Multi-currency support (USD, EUR, custom currencies)
- Dynamic market simulation
- Inflation/deflation controls
- Custom economic events
- Tax and fee systems
- Server-to-server transfers (Network mode)

### 🛠️ **Developer-Friendly**
Extensive REST API and webhook support. Integrate with external tools, bots, and dashboards.

## Installation

1. Drop the JAR into your plugins folder
2. Restart your server
3. Configure using the generated config file
4. Done! Economy is active immediately

## Configuration

The plugin works out-of-the-box, but offers deep customization:

\`\`\`yaml
# Advanced Economy Pro - config.yml
currency:
  name: "Coins"
  symbol: "💰"
  decimal_places: 2

database:
  driver: "mysql"  # or sqlite
  url: "jdbc:mysql://localhost:3306/economy"
  
performance:
  cache_enabled: true
  cache_ttl: 300
  thread_pool_size: 8
\`\`\`

## Support

- 📧 Email support with 24h response guarantee
- 💬 Discord community with 2K+ active members
- 📚 Comprehensive wiki with examples
- 🐛 Dedicated bug tracker

---

**Licensed & Protected:** This plugin includes watermark authentication and version verification. Your license is linked to your server on first activation.
`,
  changelogs: [
    {
      version: '3.2.1',
      date: '2024-05-20',
      title: 'Hotfix: Performance improvements & stability',
      description:
        'Minor patch addressing feedback from community regarding cache efficiency and MySQL connection pooling.',
      changes: [
        {
          type: 'fixed',
          text: 'Fixed memory leak in cache eviction system under high load',
        },
        {
          type: 'improved',
          text: 'Improved MySQL connection pooling for networks with 50+ servers',
        },
        {
          type: 'improved',
          text: 'Optimized transaction logging for servers with 1M+ players',
        },
      ],
    },
    {
      version: '3.2.0',
      date: '2024-05-10',
      title: 'Release: Multi-Currency System & API v2',
      description:
        'Major feature release introducing native multi-currency support and completely redesigned REST API with webhook support.',
      changes: [
        {
          type: 'added',
          text: 'Multi-currency system supporting 20+ predefined currencies',
        },
        {
          type: 'added',
          text: 'REST API v2 with full OpenAPI/Swagger documentation',
        },
        {
          type: 'added',
          text: 'Webhook system for real-time transaction notifications',
        },
        {
          type: 'added',
          text: 'Server-to-server transfer system for network economies',
        },
        {
          type: 'improved',
          text: 'Database schema migration tool for seamless upgrades',
        },
        {
          type: 'removed',
          text: 'Deprecated REST API v1 (v2 replacement available)',
        },
      ],
    },
    {
      version: '3.1.0',
      date: '2024-04-15',
      title: 'Feature: Dashboard & Analytics',
      description:
        'Introduced comprehensive in-game and web dashboard with real-time analytics and player economy tracking.',
      changes: [
        {
          type: 'added',
          text: 'In-game dashboard with /economy dashboard command',
        },
        {
          type: 'added',
          text: 'Web-based analytics portal with 30-day history',
        },
        {
          type: 'added',
          text: 'Player transaction history with filters and export',
        },
        {
          type: 'improved',
          text: 'Better error messages for permission denied scenarios',
        },
      ],
    },
  ],
};

export default function ProductPage() {
  return (
    <ProductDetailPage
      product={MOCK_PRODUCT}
      isWishlisted={false}
    />
  );
}
