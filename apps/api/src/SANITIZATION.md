# SanitizationService

El `SanitizationService` es un servicio de NestJS que utiliza `isomorphic-dompurify` para sanitizar contenido HTML, eliminar scripts, iframes y otros elementos peligrosos, mientras permite etiquetas de formato seguras.

## Características

- ✅ Elimina etiquetas `<script>` y `<iframe>`
- ✅ Remueve atributos peligrosos como `onmouseover`, `onclick`, etc.
- ✅ Permite solo etiquetas seguras: `p`, `h1-h6`, `ul`, `ol`, `li`, `b`, `strong`, `i`, `em`, `a`, `img`, `br`
- ✅ Automáticamente agrega `rel="nofollow"` a todos los enlaces
- ✅ Automáticamente agrega `target="_blank"` a todos los enlaces
- ✅ Extrae texto plano sin etiquetas HTML

## Instalación

El servicio está incluido en el módulo principal de la aplicación API. No requiere instalación adicional más allá de `isomorphic-dompurify`, que ya está instalado.

## Uso

### En un Servicio o Controlador

```typescript
import { Injectable } from '@nestjs/common';
import { SanitizationService } from './sanitization.service';

@Injectable()
export class ScraperService {
  constructor(private sanitizationService: SanitizationService) {}

  async processScrapedContent(html: string): Promise<string> {
    // Sanitizar el HTML obtenido del scraper
    const cleanHtml = this.sanitizationService.sanitizeHtml(html);
    return cleanHtml;
  }
}
```

### Métodos Disponibles

#### `sanitizeHtml(html: string): string`

Sanitiza un contenido HTML individual.

```typescript
const html = '<p>Hello</p><script>alert("xss")</script>';
const cleaned = this.sanitizationService.sanitizeHtml(html);
// Resultado: '<p>Hello</p>'
```

#### `sanitizeHtmlArray(htmlArray: string[]): string[]`

Sanitiza múltiples contenidos HTML.

```typescript
const htmlArray = [
  '<p>Content 1</p><script>alert(1)</script>',
  '<p>Content 2</p><iframe src="evil"></iframe>',
];
const cleaned = this.sanitizationService.sanitizeHtmlArray(htmlArray);
```

#### `stripHtml(html: string): string`

Extrae solo el texto plano sin etiquetas HTML.

```typescript
const html = '<p>Hello <strong>World</strong></p>';
const text = this.sanitizationService.stripHtml(html);
// Resultado: 'Hello World'
```

## Comportamiento de Enlaces

El servicio automáticamente modifica todos los enlaces para prevenir robo de tráfico y mejorar seguridad:

```typescript
// Entrada:
'<a href="https://example.com">Link</a>'

// Salida:
'<a href="https://example.com" rel="nofollow" target="_blank">Link</a>'
```

Si el enlace ya tiene un atributo `rel`, el servicio agrega `nofollow`:

```typescript
// Entrada:
'<a href="https://example.com" rel="external">Link</a>'

// Salida:
'<a href="https://example.com" rel="external nofollow" target="_blank">Link</a>'
```

## Etiquetas Permitidas

Las siguientes etiquetas HTML son permitidas después de la sanitización:

- **Formato de texto**: `<b>`, `<strong>`, `<i>`, `<em>`
- **Párrafos**: `<p>`
- **Encabezados**: `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`
- **Listas**: `<ul>`, `<ol>`, `<li>`
- **Imágenes**: `<img>` (con atributos `src` y `alt`)
- **Enlaces**: `<a>` (con atributos `href`, `title`, `rel`, `target`)
- **Saltos de línea**: `<br>`

## Atributos Permitidos

Los atributos permitidos en las etiquetas son:
- `href` - para enlaces
- `title` - para títulos descriptivos
- `src` - para imágenes
- `alt` - para texto alternativo de imágenes
- `rel` - para relaciones de enlaces
- `target` - para especificar dónde abrir enlaces

## Casos de Uso

### 1. Sanitizar Contenido de Web Scraping

```typescript
async scrapeAndSanitize(url: string): Promise<string> {
  const scrapedContent = await this.scraper.scrape(url);
  return this.sanitizationService.sanitizeHtml(scrapedContent);
}
```

### 2. Sanitizar Entrada de Usuario

```typescript
async createPost(body: CreatePostDto): Promise<Post> {
  const sanitizedContent = this.sanitizationService.sanitizeHtml(body.content);
  return this.db.posts.create({ content: sanitizedContent });
}
```

### 3. Extraer Resumen de Texto

```typescript
getTextSummary(html: string, maxLength: number): string {
  const text = this.sanitizationService.stripHtml(html);
  return text.substring(0, maxLength) + '...';
}
```

## Testing

El servicio incluye pruebas exhaustivas. Ejecuta los tests con:

```bash
pnpm test sanitization.service.spec
```

Los tests verifican:
- Remoción de scripts e iframes
- Remoción de atributos peligrosos
- Preservación de etiquetas permitidas
- Adición de `rel="nofollow"` y `target="_blank"` a enlaces
- Manejo de múltiples enlaces
- Entrada vacía/nula

## Seguridad

El servicio proporciona protección contra:

- **XSS (Cross-Site Scripting)**: Elimina scripts y event handlers
- **Iframe Injection**: Remueve todas las etiquetas iframe
- **Malicious Attributes**: Remueve atributos como `onclick`, `onmouseover`, etc.
- **Traffic Theft**: Agrega `rel="nofollow"` a enlaces externos
- **Referrer Leaking**: Agrega `target="_blank"` que abre enlaces en nueva pestaña

## Notas Técnicas

- El servicio utiliza `isomorphic-dompurify` que funciona tanto en Node.js como en navegadores
- La sanitización ocurre en dos fases: remoción de elementos peligrosos y luego DOMPurify
- Los enlaces se procesan post-sanitización para garantizar la adición correcta de atributos
