# 🚀 Quick Start - Admin Interface

## Acceso Rápido

### URL
```
http://localhost:3000/admin
```

### Requisitos
- Usuario autenticado con NextAuth (Discord OAuth)
- Rol: `admin` o `CEO`

---

## 📍 Rutas Disponibles

```
Dashboard:     /admin
Plugins:       /admin/plugins
Crear Plugin:  /admin/plugins/new
Editar Plugin: /admin/plugins/{id}/edit
Resources:     /admin/resources (placeholder)
Users:         /admin/users (placeholder)
```

---

## 🔐 Protección

### Middleware (src/middleware.ts)
```typescript
// Verificar en cada request a /admin/*
1. ¿Session existe?
2. ¿user.role es 'admin' o 'CEO'?
3. Si no → redirige a '/'
```

### Client-Side (AdminSidebar.tsx)
```typescript
// Verificación adicional al renderizar
1. Obtiene session de useSession()
2. Valida rol
3. No renderiza si no autorizado
```

---

## 📝 Usar el Formulario

### Crear Plugin

```typescript
// Se abre en: /admin/plugins/new
// Campos disponibles:
- Title (min 3 caracteres)
- Version (ej: 1.0.0)
- Price (número, >= 0)
- Description (Markdown, min 10 caracteres)
- Category (select: utilities, economy, gameplay, etc)
- Tier (select: free, premium, elite)
- Tested Versions (ej: 1.19, 1.20, 1.20.1)
- Cover Image (upload con preview)
- Banner Image (upload con preview)
- Plugin File (upload .jar)
- VIP Only (checkbox)
- Publish Immediately (checkbox)
```

### Editar Plugin

```typescript
// Se abre en: /admin/plugins/{id}/edit
// Precarga datos del plugin
// Soporta actualizar cualquier campo
// Archivos son opcionales (solo los que cambien)
```

---

## 🎯 Usar el Dashboard

```typescript
// GET /api/admin/stats
// Muestra:
- Total de plugins
- Plugins publicados
- Borradores
- Total descargas
- Últimos plugins creados
```

### Respuesta esperada:
```json
{
  "totalPlugins": 42,
  "publishedPlugins": 35,
  "draftPlugins": 7,
  "totalDownloads": 15230,
  "recentPlugins": [
    {
      "id": "abc123",
      "title": "My Plugin",
      "author": "John Doe",
      "createdAt": "2024-05-20T10:30:00Z"
    }
  ]
}
```

---

## 📊 Usar la Tabla

```typescript
// GET /api/admin/plugins?page=1&limit=10&search=&status=
// Soporta:
- Paginación (page, limit)
- Búsqueda (search en title)
- Filtro estado (status: 'published' | 'draft')
```

### Respuesta esperada:
```json
{
  "plugins": [
    {
      "id": "abc123",
      "title": "Plugin Name",
      "author": "Author Name",
      "price": 9.99,
      "status": "published",
      "createdAt": "2024-05-20T10:30:00Z"
    }
  ],
  "totalPages": 5
}
```

### Acciones en Tabla:
- **Editar** (lápiz azul) → /admin/plugins/{id}/edit
- **Publicar** (checkmark verde) → PATCH /api/admin/plugins/{id}/publish
- **Eliminar** (X rojo) → DELETE /api/admin/plugins/{id}

---

## ✍️ Usar el Editor Markdown

```markdown
# Heading 1
## Heading 2

**Bold text**
_Italic text_
`code inline`

[Link text](https://example.com)

- Bullet point 1
- Bullet point 2

> Blockquote

```

### Toolbar Buttons:
- **B** (Bold): Envuelve texto en `**...**`
- **I** (Italic): Envuelve texto en `_..._`
- **<>** (Code): Envuelve texto en `` `...` ``
- **🔗** (Link): Convierte en `[...](url)`

### Preview:
Click "Preview" para ver el resultado Markdown en tiempo real.

---

## 📸 Upload de Imágenes

### Cover Image
- Recomendado: 400x300px mínimo
- Formatos: JPG, PNG, WebP
- Max: 5MB (implementar en backend)

### Banner Image
- Recomendado: 1200x400px mínimo
- Formatos: JPG, PNG, WebP
- Max: 10MB (implementar en backend)

### Preview
Después de seleccionar archivo, muestra miniatura inmediatamente.

---

## 🔗 Flujos Principales

### Crear Nuevo Plugin
```
1. Click "New Plugin" (botón verde en /admin)
2. Abre /admin/plugins/new
3. Completa formulario
4. Click "Create Plugin"
5. POST a /api/admin/plugins con FormData
6. Redirige a /admin/plugins
```

### Editar Plugin Existente
```
1. En /admin/plugins, click ícono editar (lápiz)
2. Abre /admin/plugins/{id}/edit
3. Precarga datos
4. Modifica campos necesarios
5. Click "Update Plugin"
6. PUT a /api/admin/plugins/{id}
7. Redirige a /admin/plugins
```

### Publicar Plugin
```
1. En /admin/plugins, plugin en estado "Draft"
2. Click botón checkmark (verde)
3. PATCH a /api/admin/plugins/{id}/publish
4. Estado cambia a "Published"
```

### Eliminar Plugin
```
1. En /admin/plugins, click X rojo
2. Confirma en dialog
3. DELETE a /api/admin/plugins/{id}
4. Plugin desaparece de tabla
```

---

## 🛠️ Implementar Endpoints

### 1. Stats Endpoint
```typescript
// GET /api/admin/stats
@Get('stats')
getStats() {
  return {
    totalPlugins: await this.db.plugins.count(),
    publishedPlugins: await this.db.plugins.count({ where: { published: true } }),
    draftPlugins: await this.db.plugins.count({ where: { published: false } }),
    totalDownloads: await this.db.plugins.sum('downloads'),
    recentPlugins: await this.db.plugins.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })
  }
}
```

### 2. Plugins List
```typescript
// GET /api/admin/plugins?page=1&limit=10&search=&status=
@Get()
getPlugins(
  @Query('page') page = 1,
  @Query('limit') limit = 10,
  @Query('search') search = '',
  @Query('status') status = ''
) {
  const where = {
    ...(search && { title: { contains: search, mode: 'insensitive' } }),
    ...(status && { published: status === 'published' })
  }
  
  const plugins = await this.db.plugins.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { createdAt: 'desc' }
  })
  
  const totalPages = Math.ceil(count / limit)
  return { plugins, totalPages }
}
```

### 3. Create Plugin
```typescript
// POST /api/admin/plugins (FormData)
@Post()
async createPlugin(
  @Body() data: CreatePluginDto,
  @UploadedFiles() files: Express.Multer.File[]
) {
  // Guardar archivos en S3
  const coverImage = await uploadFile(files.coverImage, 'plugins/covers')
  const bannerImage = await uploadFile(files.bannerImage, 'plugins/banners')
  const pluginFile = await uploadFile(files.pluginFile, 'plugins/files')
  
  return await this.db.plugins.create({
    data: {
      ...data,
      coverImage,
      bannerImage,
      pluginFile,
      author: req.user.name
    }
  })
}
```

### 4. Update Plugin
```typescript
// PUT /api/admin/plugins/:id (FormData)
@Put(':id')
async updatePlugin(
  @Param('id') id: string,
  @Body() data: UpdatePluginDto
) {
  return await this.db.plugins.update({
    where: { id },
    data
  })
}
```

### 5. Delete Plugin
```typescript
// DELETE /api/admin/plugins/:id
@Delete(':id')
async deletePlugin(@Param('id') id: string) {
  return await this.db.plugins.delete({ where: { id } })
}
```

### 6. Publish Plugin
```typescript
// PATCH /api/admin/plugins/:id/publish
@Patch(':id/publish')
async publishPlugin(@Param('id') id: string) {
  const plugin = await this.db.plugins.findUnique({ where: { id } })
  return await this.db.plugins.update({
    where: { id },
    data: { published: !plugin.published }
  })
}
```

---

## 🧪 Testing Manual

### Test 1: Acceso Protegido
```bash
# Sin autenticación
curl http://localhost:3000/admin
# Resultado: Redirige a /

# Con rol user
# Resultado: Redirige a /

# Con rol admin
# Resultado: Muestra dashboard
```

### Test 2: Crear Plugin
```bash
1. Navega a /admin/plugins/new
2. Completa todos los campos
3. Sube imágenes
4. Click "Create Plugin"
5. Verifica redirección a /admin/plugins
6. Verifica que plugin aparece en tabla
```

### Test 3: Editar Plugin
```bash
1. Click botón editar en tabla
2. Verifica que datos precarguen
3. Modifica algunos campos
4. Click "Update Plugin"
5. Verifica que cambios se guardaron
```

### Test 4: Publish/Delete
```bash
1. Click botón publish
2. Verifica que estado cambia a "Published"
3. Click botón delete
4. Confirma
5. Verifica que plugin desaparece
```

---

## 📱 Responsividad

### Desktop (lg+)
- Sidebar visible permanente
- Tabla con scroll horizontal opcional
- Grid layouts completos

### Tablet (md)
- Sidebar colapsable
- Tabla con scroll
- Grid 2 columnas

### Mobile (sm)
- Sidebar hidden, hamburger menu
- Tabla con scroll obligatorio
- Grid 1 columna
- Botones stackeados

---

## 💾 Almacenamiento de Datos

### Base de Datos (Requerida)
```sql
CREATE TABLE plugins (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  version VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0,
  description TEXT,
  category VARCHAR(100),
  tier VARCHAR(50),
  testedVersions VARCHAR(255),
  coverImage VARCHAR(500),
  bannerImage VARCHAR(500),
  pluginFile VARCHAR(500),
  isVipOnly BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  author VARCHAR(255),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
)
```

### Storage (S3/Similar)
```
mcmarket-uploads/
├── plugins/
│   ├── covers/{id}.jpg
│   ├── banners/{id}.jpg
│   └── files/{id}.jar
```

---

## 🎓 Próximos Pasos

1. **Backend**
   - [ ] Crear endpoints en /apps/api
   - [ ] Conectar base de datos
   - [ ] Implementar S3/storage
   - [ ] Validar roles en backend

2. **Frontend**
   - [ ] Testear todos los flujos
   - [ ] Agregar más validaciones
   - [ ] Optimizar imágenes
   - [ ] Agregar notificaciones toast

3. **Testing**
   - [ ] Unit tests
   - [ ] E2E tests
   - [ ] Load testing
   - [ ] Security testing

---

*Para más detalles, ver ADMIN_INTERFACE_GUIDE.md y README.md*
