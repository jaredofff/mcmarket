# 🎯 Admin Interface - Quick Reference

## 📋 Archivos Creados

### Pages (5 archivos)
```
admin/
├── layout.tsx                    → Layout principal con sidebar
├── page.tsx                      → Dashboard (stats + acciones)
└── plugins/
    ├── page.tsx                  → Tabla de plugins
    ├── new/page.tsx              → Formulario crear
    └── [id]/edit/page.tsx        → Formulario editar
```

### Components (4 archivos)
```
admin/components/
├── AdminSidebar.tsx              → Navegación + menu
├── PluginForm.tsx                → Formulario (create/edit)
├── PluginTable.tsx               → Tabla con paginación
└── RichTextEditor.tsx            → Editor Markdown
```

### Middleware (1 archivo)
```
middleware.ts                      → Protección /admin/*
```

---

## 🎨 Componentes - Uso Rápido

### AdminSidebar
```typescript
// Automático en layout.tsx
<AdminSidebar />
```

### PluginForm
```typescript
<PluginForm
  initialData={plugin}        // Opcional (editar)
  onSubmit={handleSubmit}     // Requerido
  isLoading={loading}         // Opcional
  submitLabel="Save"          // Opcional
/>
```

### PluginTable
```typescript
<PluginTable
  plugins={plugins}           // Requerido
  isLoading={loading}         // Opcional
  onDelete={handleDelete}     // Opcional
  onPublish={handlePublish}   // Opcional
/>
```

### RichTextEditor
```typescript
<RichTextEditor
  value={text}                // Requerido
  onChange={setText}          // Requerido
  placeholder="..."           // Opcional
/>
```

---

## 🔐 Protección

### Middleware
- Verifica en `/admin/*`
- Requiere session
- Requiere rol `admin` o `CEO`

### Client-side
- AdminSidebar valida rol
- Sidebar no renderiza si no autorizado

---

## 📡 API Calls

### Get Stats
```typescript
const res = await fetch('/api/admin/stats')
const data = await res.json()
// { totalPlugins, publishedPlugins, draftPlugins, totalDownloads, recentPlugins }
```

### List Plugins
```typescript
const url = new URLSearchParams({
  page: '1',
  limit: '10',
  search: 'term',
  status: 'published' // o 'draft'
})
const res = await fetch(`/api/admin/plugins?${url}`)
const { plugins, totalPages } = await res.json()
```

### Get Plugin
```typescript
const res = await fetch(`/api/admin/plugins/${id}`)
const plugin = await res.json()
```

### Create Plugin
```typescript
const formData = new FormData()
formData.append('title', 'My Plugin')
formData.append('version', '1.0.0')
// ... más campos
formData.append('coverImage', fileInput.files[0])

const res = await fetch('/api/admin/plugins', {
  method: 'POST',
  body: formData
})
```

### Update Plugin
```typescript
const formData = new FormData()
formData.append('title', 'Updated Title')
// ... campos a actualizar

const res = await fetch(`/api/admin/plugins/${id}`, {
  method: 'PUT',
  body: formData
})
```

### Delete Plugin
```typescript
const res = await fetch(`/api/admin/plugins/${id}`, {
  method: 'DELETE'
})
```

### Publish Plugin
```typescript
const res = await fetch(`/api/admin/plugins/${id}/publish`, {
  method: 'PATCH'
})
```

---

## 🎯 Flujos Comunes

### Crear Plugin
1. `/admin/plugins/new`
2. PluginForm completa
3. POST `/api/admin/plugins`
4. Redirect `/admin/plugins`

### Editar Plugin
1. `/admin/plugins/{id}/edit`
2. GET `/api/admin/plugins/{id}` (precarga)
3. PluginForm completa
4. PUT `/api/admin/plugins/{id}`
5. Redirect `/admin/plugins`

### Publicar Plugin
1. Tabla: click checkmark
2. PATCH `/api/admin/plugins/{id}/publish`
3. Estado se actualiza en tabla

### Eliminar Plugin
1. Tabla: click X
2. Confirmación
3. DELETE `/api/admin/plugins/{id}`
4. Se remueve de tabla

---

## 🎨 Estilos Tailwind

### Colores Principales
```css
bg-[#141311]    /* Fondo global */
bg-[#1a1714]    /* Componentes */
text-amber-500  /* Primario */
text-[#e8e4db]  /* Texto principal */
text-[#a89968]  /* Texto secundario */
```

### Ejemplos
```tsx
// Botón primario
<button className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-500">
  Acción
</button>

// Input
<input className="bg-[#1a1714] border border-amber-500/20 text-[#e8e4db]" />

// Card
<div className="p-6 bg-[#1a1714] border border-amber-500/20 rounded-lg">
  Content
</div>
```

---

## ✅ Validación Zod

```typescript
const schema = z.object({
  title: z.string().min(3),
  price: z.coerce.number().min(0),
  description: z.string().min(10),
  category: z.string(),
  tier: z.enum(['free', 'premium', 'elite']),
  testedVersions: z.string(),
  isVipOnly: z.boolean().default(false),
  published: z.boolean().default(false),
  coverImage: z.instanceof(FileList).optional(),
  bannerImage: z.instanceof(FileList).optional(),
  pluginFile: z.instanceof(FileList).optional(),
})
```

---

## 📱 Responsive

### Mobile (sm)
```css
display: block;
width: 100%;
grid-cols-1;
```

### Tablet (md)
```css
grid-cols-2;
width: 100%;
```

### Desktop (lg+)
```css
grid-cols-4;
width: calc(100% - 16rem);
```

---

## 🚀 Deploy

### Requerimientos
- Node.js >= 18
- pnpm >= 8
- NextAuth configurado
- Endpoints API implementados

### Build
```bash
cd apps/web
npm run build
npm run start
```

### Environment
```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your_secret
DISCORD_CLIENT_ID=your_id
DISCORD_CLIENT_SECRET=your_secret
```

---

## 🧪 Testing

### Manual
```bash
# Desarrollo
npm run dev

# Abrir
http://localhost:3000/admin

# Test login → necesita role 'admin' o 'CEO'
```

### Checklist
- [ ] Acceso /admin redirige si no autenticado
- [ ] Acceso /admin redirige si rol != admin/CEO
- [ ] Crear plugin funciona
- [ ] Editar plugin funciona
- [ ] Publicar plugin funciona
- [ ] Eliminar plugin funciona
- [ ] Búsqueda funciona
- [ ] Paginación funciona
- [ ] Upload imágenes funciona
- [ ] Markdown preview funciona

---

## 🔧 Troubleshooting

### Sidebar no aparece
- Verifica session en NextAuth
- Verifica rol en session.user.role

### Formulario no valida
- Revisa console.log(errors) en useForm
- Verifica tipos en Zod schema

### Tabla vacía
- Verifica endpoint /api/admin/plugins
- Revisa response en Network tab

### Upload no funciona
- Verifica FormData construction
- Revisa Content-Type headers
- Verifica backend accept files

### Markdown no renderiza
- Verifica sintaxis markdown
- Abre browser DevTools
- Busca errores en console

---

## 📚 Documentos Relacionados

- `IMPLEMENTATION_SUMMARY.md` - Overview completo
- `ADMIN_INTERFACE_GUIDE.md` - Guía detallada
- `QUICK_START.md` - Instrucciones de inicio
- `admin/README.md` - Documentación técnica

---

*Última actualización: 24 de Mayo, 2026*
