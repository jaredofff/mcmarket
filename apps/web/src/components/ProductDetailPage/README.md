# Product Detail Page (PDP) - MC Market

Componente profesional y completo de página de detalles del producto para el Studio Portal de MC Market, diseñado con máxima conversión en mente.

## 📋 Contenido

### Componentes Incluidos

1. **ProductDetailPage.tsx** - Componente raíz principal
2. **PricingCard.tsx** - Tarjeta sticky de precios con CTA
3. **TechnicalInfo.tsx** - Información técnica (versiones, dependencias, hash)
4. **ChangelogSection.tsx** - Timeline visual de changelogs
5. **ReviewsSection.tsx** - Sistema de reseñas y ratings

### Ejemplo de Página Implementada

- `/src/app/products/advanced-economy/page.tsx` - Página de ejemplo totalmente funcional

## 🎨 Características de Diseño

### Dark Mode Premium
- Palette: `zinc-950` → `zinc-50` (fondo oscuro a texto claro)
- Colores de acento: `emerald-400` (primary), `amber-400` (ratings)
- Bordes sutiles: `border-zinc-800`

### Tipografía
- Font-family: **Inter** o **Geist** (configurable en `globals.css`)
- Escala de pesos: `font-bold` (headings), `font-semibold` (subheadings), regular para body

### Componentes UI
- Construido con **shadcn/ui**: Badge, Button, Card, Tabs
- Iconos: **lucide-react** (ShieldCheck, Download, Heart, Share2, etc.)
- Sin dependencias adicionales más allá del stack existente

## 📐 Layout & Responsividad

### Desktop (lg+)
```
┌─────────────────────────────────────────┐
│        Sticky Header (top-0)            │
├─────────────────────────────────────────┤
│                                         │
│  Main Content (2/3)  │  Sidebar (1/3)  │
│  - Hero Image        │  Pricing Card   │
│  - Tabs              │  (sticky)       │
│  - Tech Info         │                 │
│  - Changelog         │                 │
│  - Reviews           │                 │
│                                         │
└─────────────────────────────────────────┘
```

### Mobile (< lg)
- Stack vertical automático
- Sidebar se posiciona al final
- Header permanece sticky
- Tabs se adaptan a scroll horizontal en versiones pequeñas

## 🚀 Uso

### Instalación Rápida

```tsx
import ProductDetailPage from '@/components/ProductDetailPage';

const product = {
  id: 'plugin-id',
  name: 'Plugin Name',
  slug: 'plugin-slug',
  description: '# Markdown Description...',
  price: 24.99,
  rating: 4.8,
  reviewCount: 512,
  downloads: 15420,
  image: 'https://...',
  compatible_versions: ['1.20', '1.21'],
  dependencies: ['Vault', 'PlaceholderAPI'],
  current_version: '3.2.1',
  current_hash: 'sha256hash...',
  last_updated: '2024-05-20',
  features: ['Feature 1', 'Feature 2'],
  tags: ['Economy', 'Premium'],
  changelogs: [
    {
      version: '3.2.1',
      date: '2024-05-20',
      title: 'Hotfix: Fixes and improvements',
      description: 'Description text',
      changes: [
        { type: 'fixed', text: 'Fixed bug X' },
        { type: 'added', text: 'Added feature Y' },
      ]
    }
  ]
};

export default function Page() {
  return (
    <ProductDetailPage
      product={product}
      onBuyClick={() => redirect('/checkout')}
      isWishlisted={false}
      onWishlistToggle={() => toggleWishlist()}
    />
  );
}
```

### Props API

```tsx
interface ProductDetailPageProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;  // Markdown
    price: number;
    rating: number;       // 0-5
    reviewCount: number;
    downloads: number;
    image: string;        // URL
    gallery?: string[];
    videoUrl?: string;
    compatible_versions: string[];  // e.g., ['1.20', '1.21']
    dependencies: string[];         // e.g., ['Vault', 'PlaceholderAPI']
    current_version: string;        // e.g., '3.2.1'
    current_hash: string;           // SHA-256
    last_updated: string;           // ISO date
    changelogs: Changelog[];
    features: string[];
    tags: string[];
  };
  onBuyClick: () => void;
  isWishlisted?: boolean;           // default: false
  onWishlistToggle?: () => void;
}
```

## 🎯 Optimizaciones para Conversión

### 1. **Sticky Pricing Card**
El precio y CTA siempre visible en el sidebar. No requiere scroll para ver opciones de compra.

### 2. **Trust Signals**
- Badge "Verified Official" 🔐
- Contador de descargas
- Rating con número de reviews
- Señales de confianza en pricing card:
  - ✓ Lifetime Updates
  - ✓ Multi-Server License
  - ✓ Priority Support
  - 🔒 Secure payment indicator

### 3. **UX Writing Profesional**
- CTA buttons: "Get [ProductName]" (específico, no genérico)
- Copy claro: "Lifetime access + future updates"
- Beneficios enfatizados (bullets con emojis)
- Descripciones técnicas sin jerga innecesaria

### 4. **Tabs Intuitivos**
- **Overview**: Descripción + features + tags
- **Technical**: Versiones compatibles, dependencias, hash
- **Changelog**: Timeline visual expandible
- **Reviews**: Ratings + reseñas con filtros

### 5. **Visual Hierarchy**
- Hero image prominente
- Precio grande y visible
- Features en cards con checkmarks verdes
- Colores de estado claros (green=good, amber=warning)

## 🔒 Seguridad & Integridad

### Hash Display
```tsx
<code className="font-mono break-all">
  {current_hash}
</code>
```
- Copiable al clipboard
- Verificable localmente por usuarios técnicos
- Refuerza confianza en integridad del producto

### Watermark Notice
Señal clara en TechnicalInfo sobre watermarking automático:
> "Every download includes a unique watermark for authentication and integrity verification. Your license is automatically linked to your server on first run."

## 📱 Datos de Ejemplo

El componente incluye data mock completa en `/products/advanced-economy/page.tsx`:
- Descripción en Markdown con secciones
- Changelog con 3 versiones
- Features con emojis descriptivos
- Reviews simuladas con avatares

## 🔧 Customización

### Cambiar Colores
Busca `zinc-950`, `emerald-400`, `amber-400` en los archivos y reemplaza con tu palette.

### Cambiar Tipografía
Asegúrate de que `font-family` esté configurada en tu `globals.css`:
```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter.woff2') format('woff2');
}

html {
  font-family: Inter, sans-serif;
}
```

### Integración con Backend
Reemplaza los arrays de `MOCK_PRODUCT` con llamadas a API:
```tsx
const product = await fetch(`/api/products/${slug}`).then(r => r.json());
```

### Comentarios en Reviews
Los reviews incluyen data mock. Para datos reales:
```tsx
const reviews = await fetch(`/api/products/${id}/reviews`).then(r => r.json());
setReviews(reviews);
```

## 📊 Métricas de Conversión Integradas

### Click Events
- `onBuyClick` - Dispara checkout
- `onWishlistToggle` - Agrega a lista de deseos
- Analytics trackeable en cada CTA

### Estados Interactivos
- Hash copy → feedback visual (color change)
- Review helpful → contador actualizado en tiempo real
- Wishlist → cambio de color del icono

## 🛠️ Requisitos

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "next": "^14.0.0",
    "tailwindcss": "^3.3.0",
    "@shadcn/ui/badge": "latest",
    "@shadcn/ui/button": "latest",
    "@shadcn/ui/card": "latest",
    "@shadcn/ui/tabs": "latest",
    "lucide-react": "^latest",
    "react-markdown": "^latest"
  }
}
```

Si no tienes shadcn/ui instalado:
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add badge button card tabs
```

## 📌 Notas Importantes

1. **Responsividad**: Probado en mobile, tablet y desktop. Usa TailwindCSS breakpoints: `sm:`, `lg:`, etc.

2. **Performance**: Todos los tabs son lazy-loaded. Las imágenes usan Next.js Image (configurable).

3. **Accesibilidad**: Buttons con `onClick`, Tabs con ARIA standards vía shadcn/ui.

4. **SEO**: Structure.json pode agregarse fácilmente para Product Rich Snippets.

5. **Analytics**: Todos los eventos (`onBuyClick`, etc.) pueden integrarse con Google Analytics, Mixpanel, etc.

## 📝 Changelog del Componente

**v1.0.0** (Mayo 2024)
- Release inicial
- Todos los componentes funcionales
- Dark mode optimizado
- Mobile-responsive
- Reviews + rating system
- Changelog expandible
- Technical info con hash copiable

---

**¿Preguntas?** Revisa los archivos de componentes. Cada uno está documentado inline.
