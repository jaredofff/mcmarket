# 🚀 IMPORT SYSTEM PROMPT - MC MARKET

## 📌 CONTEXTO

Estoy desarrollando un marketplace/hub VIP privado de recursos Minecraft usando mi stack actual y quiero mejorar mi sistema de importación automática de recursos desde páginas como BuiltByBit.

IMPORTANTE:
NO quiero rehacer el proyecto desde cero.
Quiero EXTENDER y MEJORAR mi arquitectura actual.

---

# 🧱 STACK ACTUAL

## FRONTEND

* Next.js 16 (App Router)
* React 19
* Tailwind CSS 4
* NextAuth v5
* Radix UI
* react-markdown

## BACKEND

* NestJS 11
* Prisma ORM
* PostgreSQL
* JWT + Passport
* Axios
* Cheerio
* DOMPurify

## INFRAESTRUCTURA

* Docker Compose
* Nginx reverse proxy
* pnpm workspace monorepo

---

# 🎯 OBJETIVO

Quiero un sistema de importación automática donde:

1. El admin pegue una URL de BuiltByBit.
2. El backend scrapee automáticamente el recurso.
3. Se copie visualmente el contenido casi idéntico al original.
4. Se creen automáticamente páginas dinámicas en mi marketplace.
5. Los usuarios VIP puedan descargar los archivos.

Quiero conservar:

* descripción HTML original
* imágenes
* changelogs
* estructura visual
* autor
* tags
* categorías
* compatibilidad
* sidebar informativa

La meta es que el recurso en mi página se vea prácticamente igual al original para mantener branding y autenticidad del creador.

---

# ⚠️ IMPORTANTE

NO uses MongoDB.
NO uses Express standalone.
NO uses pages router.
NO rehagas auth.
NO reemplaces Prisma.
NO generes arquitectura nueva innecesaria.

Debes trabajar sobre mi arquitectura actual.

---

# ✅ SISTEMA ACTUAL YA IMPLEMENTADO

Ya existe:

* plugins.service.ts
* plugins.controller.ts
* image-storage.service.ts
* ImportPluginDto
* JWT auth
* RolesGuard
* Prisma schema
* descarga de imágenes
* validaciones básicas

Actualmente el sistema:

* importa imágenes
* valida MIME types
* usa DTOs
* tiene roles CEO
* guarda temporalmente en Map<string>

Pero quiero hacerlo PROFESIONAL y ESCALABLE.

---

# 🔥 FUNCIONALIDADES NECESARIAS

---

# 1️⃣ REEMPLAZAR ALMACENAMIENTO TEMPORAL

Actualmente:

```ts
private importedPlugins: Map<string, StoredPlugin>
```

Quiero:

* persistencia real con Prisma
* guardar directamente en PostgreSQL
* relaciones con User y Category

---

# 2️⃣ SISTEMA DE SCRAPING PROFESIONAL

Quiero migrar de Cheerio a Playwright para:

* páginas dinámicas
* lazy loading
* imágenes JS
* contenido completo

Debe:

* abrir BuiltByBit
* esperar carga completa
* extraer HTML limpio
* sanitizar con DOMPurify
* mantener estructura visual

---

# 3️⃣ IMPORTACIÓN AUTOMÁTICA COMPLETA

Debe importar:

* title
* description HTML
* images
* banner
* author
* categories
* tags
* version
* compatibility
* changelog
* download links
* file metadata

---

# 4️⃣ SISTEMA DE SNAPSHOTS

Cuando se importa:

* guardar snapshot local
* no depender del sitio original
* almacenar HTML en DB
* almacenar imágenes localmente

---

# 5️⃣ GENERACIÓN AUTOMÁTICA DE PÁGINAS

Crear automáticamente:

```txt
/resources/[slug]
```

Usando:

* App Router
* Server Components
* SSR optimizado
* SEO optimizado

---

# 6️⃣ FRONTEND MARKETPLACE

Quiero diseño tipo:

* Steam
* Modrinth
* Netflix
* CurseForge

Con:

* cards modernas
* gallery slider
* sidebar sticky
* tags
* previews
* changelog tabs
* dark mode

---

# 7️⃣ SISTEMA VIP

Usuarios:

* USER
* VIP
* LEGEND
* CEO

Los VIP:

* pueden descargar archivos
* acceder a contenido premium

Usuarios normales:

* solo previews

---

# 8️⃣ DESCARGA DE ARCHIVOS PREMIUM

Crear:

```ts
plugin-file-storage.service.ts
```

Con:

* descarga .jar/.zip
* validación SHA-256
* almacenamiento seguro
* nombres únicos
* metadata
* versionado

---

# 9️⃣ SISTEMA DE VERSIONES

Crear modelo:

```prisma
model PluginVersion
```

Con:

* historial
* rollback
* múltiples versiones
* changelogs
* hashes únicos

---

# 🔟 QUEUE SYSTEM

Implementar BullMQ:

* cola de importaciones
* reintentos
* exponential backoff
* logging
* progreso en tiempo real

---

# 1️⃣1️⃣ SEGURIDAD

Agregar:

* sanitización XSS
* rate limiting
* validación de URLs
* protección SSRF
* límites de tamaño
* validación MIME
* timeouts

---

# 1️⃣2️⃣ APIS NECESARIAS

Crear:

```txt
POST /plugins/import-url
GET /plugins/:slug
POST /plugins/:id/resync
GET /plugins/import-status/:jobId
```

---

# 📌 IMPORTANTE SOBRE EL HTML

Quiero reutilizar el HTML original del recurso para mantener:

* branding del creador
* formato original
* autenticidad visual

Pero:

* sanitizado
* responsive
* dark mode compatible

---

# 📦 LO QUE QUIERO QUE GENERES

Quiero código REAL y COMPLETO para:

* Prisma models
* NestJS services
* Controllers
* DTOs
* Playwright scraper
* BullMQ queues
* Next.js frontend
* Dynamic routes
* React components
* Tailwind styles
* Auth middleware
* Prisma persistence
* File storage
* Download system
* Error handling
* Logging
* Security

NO quiero pseudocódigo.
Quiero implementación profesional lista para producción.

---

# 🎨 OBJETIVO FINAL

Quiero que mi marketplace funcione como un:

* hub VIP privado
* marketplace premium
* sistema de partnership Minecraft

Y que visualmente:

* los recursos se vean casi idénticos a BuiltByBit
* pero adaptados a mi branding
* manteniendo autenticidad del creador
* con sistema moderno y automatizado
