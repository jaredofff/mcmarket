# 📖 Guía de Uso - Admin Interface MC Market

## 🎯 Descripción General

Se ha implementado una **interfaz de administración completa** en Next.js 16 para el proyecto mcmarket. La interfaz incluye:

- **5 páginas** (layout, dashboard, plugins list, crear, editar)
- **4 componentes reutilizables** (sidebar, tabla, formulario, editor)
- **1 middleware de protección** (rutas con autenticación + rol)
- **Validación completa** con Zod + React Hook Form
- **UI responsiva** 100% Tailwind CSS
- **Dark theme** con paleta de colores ámbar

---

## 📍 Rutas Disponibles

```
/admin                          Dashboard principal
/admin/plugins                  Listado de plugins con tabla
/admin/plugins/new              Formulario crear plugin
/admin/plugins/[id]/edit        Formulario editar plugin
/admin/resources                Placeholder para recursos (por completar)
/admin/users                    Placeholder para usuarios (por completar)
```

---

## 🔐 Protección de Rutas

### Middleware (src/middleware.ts)
```typescript
// Protege todas las rutas /admin/*
- Verifica que el usuario esté autenticado (session)
- Verifica que tenga rol 'admin' o 'CEO'
- Redirige a '/' si no está autorizado
```

### Verificación en Sidebar
```typescript
// AdminSidebar.tsx realiza verificación adicional client-side
- Oculta el sidebar si no está autorizado
- Valida roles antes de renderizar
```

---

## 📋 Descripción de Componentes

### 1️⃣ AdminSidebar.tsx
**Propósito**: Navegación principal del admin

```typescript
Props:
- Ninguno (obtiene session de next-auth automáticamente)

Features:
✓ Sidebar responsivo (collapse en mobile)
✓ Menú dinámico con active states
✓ Info de usuario y logout
✓ Verificación de rol
✓ Hamburger menu en mobile
```

**Uso**: Importado en `admin/layout.tsx`

---

### 2️⃣ PluginForm.tsx
**Propósito**: Formulario para crear/editar plugins

```typescript
Props:
- initialData?: Partial<PluginFormData> & { id?: string }
- onSubmit: (data, files) => Promise<void>
- isLoading?: boolean
- submitLabel?: string

Features:
✓ Validación con Zod
✓ React Hook Form integration
✓ Campos dinamicos (básicos, media, opciones)
✓ Upload con preview de imágenes
✓ Rich text editor para descripción
✓ Manejo de archivos con FormData
```

**Validación Zod**:
```typescript
- title: min 3 caracteres
- version: requerido
- price: >= 0
- description: min 10 caracteres
- category: requerido
- tier: enum['free', 'premium', 'elite']
- testedVersions: requerido
```

**Uso**:
```typescript
// Crear
<PluginForm
  onSubmit={handleCreate}
  submitLabel="Create Plugin"
/>

// Editar
<PluginForm
  initialData={pluginData}
  onSubmit={handleUpdate}
  submitLabel="Update Plugin"
/>
```

---

### 3️⃣ PluginTable.tsx
**Propósito**: Tabla de listado de plugins

```typescript
Props:
- plugins: Plugin[]
- isLoading?: boolean
- onDelete?: (id: string) => Promise<void>
- onPublish?: (id: string) => Promise<void>

Features:
✓ Tabla responsiva
✓ Skeleton loading
✓ Acciones: editar, publicar, eliminar
✓ Estados visuales (published/draft)
✓ Manejo asincrónico de acciones
```

**Columnas**:
| Título | Autor | Precio | Estado | Creado | Acciones |
|--------|-------|--------|--------|--------|----------|

**Uso**:
```typescript
<PluginTable
  plugins={plugins}
  isLoading={loading}
  onDelete={handleDelete}
  onPublish={handlePublish}
/>
```

---

### 4️⃣ RichTextEditor.tsx
**Propósito**: Editor Markdown con preview

```typescript
Props:
- value: string
- onChange: (value: string) => void
- placeholder?: string

Features:
✓ Toolbar: Bold, Italic, Code, Link
✓ Preview en tiempo real
✓ Markdown syntax support
✓ Toggle edit/preview mode
✓ Inserción automática de sintaxis
```

**Soporte Markdown**:
```markdown
**bold**
_italic_
`code`
[link](url)
# Headings
- Lists
> Blockquotes
```

**Uso**:
```typescript
<RichTextEditor
  value={description}
  onChange={setDescription}
  placeholder="Write markdown..."
/>
```

---

## 🎨 Paleta de Colores

```css
/* Fondos */
--bg-primary: #141311      /* Fondo global */
--bg-secondary: #1a1714    /* Componentes */
--bg-tertiary: #0f0e0b     /* Overlays */

/* Textos */
--text-primary: #e8e4db    /* Texto principal */
--text-secondary: #a89968   /* Texto secundario */

/* Acentos */
--accent-amber: #f59e0b    /* Primario */
--accent-green: #10b981    /* Success */
--accent-red: #ef4444      /* Error */
--accent-blue: #3b82f6     /* Info */
--accent-yellow: #eab308   /* Warning */
```

---

## 📡 Endpoints API Requeridos

Para que la interfaz funcione correctamente, necesitas implementar estos endpoints en `/apps/api/`:

### Dashboard Stats
```
GET /api/admin/stats
Response: {
  totalPlugins: number
  publishedPlugins: number
  draftPlugins: number
  totalDownloads: number
  recentPlugins: Array<{id, title, author, createdAt}>
}
```

### Plugins CRUD
```
GET /api/admin/plugins?page=1&limit=10&search=&status=
Response: {
  plugins: Plugin[]
  totalPages: number
}

GET /api/admin/plugins/:id
Response: Plugin

POST /api/admin/plugins (FormData)
Body: FormData {
  title, version, price, description, category, tier,
  testedVersions, isVipOnly, published,
  coverImage?, bannerImage?, pluginFile?
}

PUT /api/admin/plugins/:id (FormData)
Body: Same as POST

DELETE /api/admin/plugins/:id

PATCH /api/admin/plugins/:id/publish
Response: Plugin (con estado actualizado)
```

---

## 🔑 Variables de Entorno

```env
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu_secret_key

# Discord OAuth
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
```

---

## 📦 Estructura de Datos

### Plugin Type
```typescript
interface Plugin {
  id: string
  title: string
  version: string
  price: number
  description: string        // Markdown
  category: string
  tier: 'free' | 'premium' | 'elite'
  testedVersions: string     // "1.19, 1.20, 1.20.1"
  coverImage?: string        // URL
  bannerImage?: string       // URL
  pluginFile?: string        // URL
  isVipOnly: boolean
  published: boolean
  createdAt: string          // ISO date
  author: string
  status: 'published' | 'draft'
}
```

---

## 🚀 Ejemplo de Implementación

### 1. Crear Plugin

```typescript
// admin/plugins/new/page.tsx
const handleSubmit = async (data, files) => {
  const formData = new FormData()
  
  // Agregar campos
  formData.append('title', data.title)
  formData.append('version', data.version)
  // ... más campos
  
  // Agregar archivos
  if (files.coverImage) formData.append('coverImage', files.coverImage)
  if (files.pluginFile) formData.append('pluginFile', files.pluginFile)
  
  const res = await fetch('/api/admin/plugins', {
    method: 'POST',
    body: formData
  })
  
  if (res.ok) router.push('/admin/plugins')
}
```

### 2. Editar Plugin

```typescript
// admin/plugins/[id]/edit/page.tsx
const handleSubmit = async (data, files) => {
  const formData = new FormData()
  // ... mismo procedimiento que crear
  
  const res = await fetch(`/api/admin/plugins/${id}`, {
    method: 'PUT',
    body: formData
  })
}
```

### 3. Listar Plugins

```typescript
// admin/plugins/page.tsx
useEffect(() => {
  const params = new URLSearchParams({
    page: currentPage.toString(),
    limit: '10',
    search: searchTerm,
    status: filterStatus
  })
  
  const res = await fetch(`/api/admin/plugins?${params}`)
  const { plugins, totalPages } = await res.json()
  setPlugins(plugins)
  setTotalPages(totalPages)
}, [currentPage, searchTerm, filterStatus])
```

---

## ✨ Features Especiales

### 🔄 Responsive Design
- Mobile-first approach
- Sidebar colapsable
- Tablas con scroll horizontal
- Grid adaptativos

### 🎯 Loading States
- Skeleton loaders en tablas
- Loading spinners en botones
- Disabled states durante async operations

### ❌ Error Handling
- Try/catch en todas las llamadas API
- Mensajes de error amigables
- Validación Zod en formularios

### 🎨 UX Improvements
- Hover effects en elementos interactivos
- Transiciones suaves
- Preview de imágenes
- Estados visuales claros

---

## 🧪 Testing

Para verificar que todo funciona:

```bash
# Desarrollo
cd apps/web
npm run dev

# Build
npm run build

# Lint
npm run lint
```

---

## 📝 Notas Importantes

1. **Autenticación**: Usa NextAuth v5 con Discord OAuth
2. **Protección**: Middleware + Client-side validation
3. **Validación**: Zod schemas completos
4. **Archivos**: Usa FormData para uploads
5. **Errores**: Manejo completo con try/catch

---

## 🔮 Próximas Mejoras

- [ ] Agregar tests unitarios
- [ ] Integrar validación de tamaño de archivos
- [ ] Agregar compresión de imágenes
- [ ] Completar páginas Resources y Users
- [ ] Agregar auditoria/logs
- [ ] Internacionalización (i18n)
- [ ] Dark/Light mode toggle
