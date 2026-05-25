# 📊 Panel de Administración - Implementación Completa

**Estado:** ✅ **IMPLEMENTADO Y LISTO**  
**Fecha:** 2024  
**Alcance:** Backend NestJS + Frontend Next.js + Prisma

---

## 📋 Resumen Ejecutivo

Se ha implementado un **panel de administración completo** que permite a roles ADMIN y CEO:
- ✅ Subir manualmente plugins con descripciones limpias
- ✅ Gestionar assets (iconos, banners, archivos .jar/.zip)
- ✅ Evitar web scraping automático
- ✅ Publicar/despublicar recursos
- ✅ Controlar acceso por roles

---

## 📁 Estructura de Directorios

### Backend (NestJS)

```
apps/api/src/admin/
├── admin.module.ts                    [Módulo principal]
├── controllers/
│   └── admin-plugins.controller.ts    [6 endpoints CRUD]
├── services/
│   ├── admin-plugins.service.ts       [Lógica de negocio]
│   └── file-upload.service.ts         [Gestión de archivos]
└── dtos/
    ├── create-admin-plugin.dto.ts     [Validación crear]
    └── update-admin-plugin.dto.ts     [Validación actualizar]
```

### Frontend (Next.js)

```
apps/web/src/app/admin/
├── layout.tsx                         [Layout + Sidebar]
├── page.tsx                           [Dashboard]
├── plugins/
│   ├── page.tsx                       [Tabla de plugins]
│   ├── new/
│   │   └── page.tsx                   [Crear plugin]
│   └── [id]/
│       └── edit/
│           └── page.tsx               [Editar plugin]
└── components/
    ├── AdminSidebar.tsx               [Navegación]
    ├── PluginForm.tsx                 [Formulario]
    ├── PluginTable.tsx                [Tabla de datos]
    └── RichTextEditor.tsx             [Editor Markdown]
```

---

## 🔌 Endpoints API

### Backend REST Endpoints

Todos requieren: **JWT Bearer Token + Rol ADMIN/CEO**

| Método | Ruta | Descripción | Datos |
|--------|------|-------------|-------|
| **POST** | `/admin/plugins` | Crear plugin | FormData (archivos + JSON) |
| **GET** | `/admin/plugins?page=1&limit=10&search=...` | Listar con paginación | Query params |
| **GET** | `/admin/plugins/:id` | Obtener detalle | Path param |
| **PUT** | `/admin/plugins/:id` | Actualizar plugin | FormData (archivos + JSON) |
| **DELETE** | `/admin/plugins/:id` | Eliminar plugin | Path param |
| **POST** | `/admin/plugins/:id/publish` | Cambiar estado | Body: `{ published: true/false }` |

### Ejemplo de Request (cURL)

```bash
curl -X POST http://localhost:3000/admin/plugins \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "title=Advanced Economy" \
  -F "description=Un plugin económico avanzado" \
  -F "descriptionHtml=<p>Un plugin económico...</p>" \
  -F "version=2.1.0" \
  -F "price=2999" \
  -F "categories=Economy,Gameplay" \
  -F "tier=VIP" \
  -F "isVipOnly=false" \
  -F "published=false" \
  -F "coverImage=@/path/to/cover.png" \
  -F "bannerImage=@/path/to/banner.png" \
  -F "pluginFile=@/path/to/plugin.jar"
```

---

## 🎯 Flujo de Uso

### 1️⃣ **Admin accede al panel**
```
http://localhost:3000/admin
↓
Middleware verifica JWT + rol ADMIN/CEO
↓
Renderiza dashboard
```

### 2️⃣ **Admin navega a crear plugin**
```
/admin → click "Nuevo Plugin" → /admin/plugins/new
↓
Carga formulario con campos:
- Título, versión, descripción (Markdown)
- Upload: Icono, banner, archivo plugin
- Categorías, tier, precio
```

### 3️⃣ **Admin completa y envía**
```
FormData → Validación Zod en cliente
↓
POST /admin/plugins (con JWT)
↓
Backend valida + guarda archivos en /public/uploads/
↓
Crea registro en BD
↓
Retorna plugin creado
↓
Redirecciona a /admin/plugins
```

### 4️⃣ **Admin edita o publica**
```
Tabla → click Edit → /admin/plugins/[id]/edit
↓
Carga datos previos
↓
PUT /admin/plugins/:id
↓
Actualiza plugin y archivos
```

---

## 🔒 Seguridad Implementada

### Backend
- ✅ **Autenticación JWT** - Valida token en cada request
- ✅ **RolesGuard** - Solo ADMIN y CEO
- ✅ **Validación MIME Types** - Solo JPEG, PNG, GIF, WebP, ZIP, JAR
- ✅ **Límites de tamaño:**
  - Imágenes: < 5 MB
  - Plugins: < 100 MB
- ✅ **Prevención Path Traversal** - UUID para nombres de archivo
- ✅ **Sanitización HTML** - DOMPurify en descriptionHtml

### Frontend
- ✅ **Middleware Next.js** - Verifica rol en `/admin/*`
- ✅ **Validación Zod** - Schemas en cliente
- ✅ **Protected Routes** - Redirecciona si no tiene permisos
- ✅ **Tipos TypeScript** - 100% type-safe

---

## 📋 Validaciones

### Campos Requeridos

| Campo | Tipo | Validación | Ejemplo |
|-------|------|-----------|---------|
| **title** | String | 3-200 chars | "Advanced Economy Plugin" |
| **description** | String | 10-5000 chars | "Un plugin de economía..." |
| **descriptionHtml** | String | HTML sanitizado | `<p>Un plugin...</p>` |
| **version** | String | Sem Ver | "2.1.0" |
| **price** | Number | >= 0 (centavos) | 2999 (= $29.99) |
| **categories** | Array | 1+ items | ["Economy", "Admin"] |
| **tier** | Enum | VIP \| LEGEND \| null | "VIP" |
| **isVipOnly** | Boolean | true \| false | false |
| **published** | Boolean | true \| false | false |

### Archivos

| Archivo | Tipo MIME | Tamaño | Obligatorio |
|---------|-----------|--------|------------|
| **coverImage** | image/* | < 5MB | ✅ Sí |
| **bannerImage** | image/* | < 5MB | ❌ Opcional |
| **pluginFile** | .jar, .zip | < 100MB | ✅ Sí |

---

## 🎨 Componentes Frontend

### AdminSidebar.tsx
```
- Dashboard
- Plugins
  - Ver todos
  - Crear nuevo
- Resources
- Users
- Logout
```

### PluginForm.tsx
```
Inputs:
- Title (string, 3-200)
- Version (semver)
- Description (RichTextEditor)
- Price (number)
- Categories (multi-select)
- Tier (enum)
- VIP Only (checkbox)

File Uploads:
- Cover Image (preview)
- Banner Image (preview)
- Plugin File (drag & drop)

Buttons:
- Save Draft / Publish
- Cancel
```

### RichTextEditor.tsx
```
Textarea + Live Preview (Markdown)
Toolbar:
- **Bold** - **text**
- *Italic* - *text*
- `Code` - `code`
- [Link](url)
- # Headers
- - Lists
```

### PluginTable.tsx
```
Columnas:
- Plugin Title
- Version
- Price
- Status (Draft/Published)
- Created
- Actions (View, Edit, Delete)

Features:
- Paginación
- Búsqueda por título
- Ordenamiento
- Loading skeleton
```

---

## 📝 Schema Prisma (Ya existe)

```prisma
enum Role {
  USER
  VIP
  LEGEND
  ADMIN           ← Accede a /admin
  DEVELOPER
  CEO             ← Accede a /admin
}

model User {
  id        String   @id @default(uuid())
  role      Role     @default(USER)
  // ... otros campos
}

model Plugin {
  id             String   @id
  title          String
  slug           String   @unique
  description    String   @db.Text
  descriptionHtml String?  @db.Text
  price          Int      @default(0)    // en centavos
  version        String
  coverImage     String?
  bannerImage    String?
  tier           Tier?
  categories     String[]
  isVipOnly      Boolean  @default(false)
  published      Boolean  @default(false)
  sourceUrl      String?
  author         String?
  tags           String[]
  // ... más campos
}
```

---

## 🚀 Cómo Empezar

### 1. Backend
```bash
cd apps/api

# El AdminModule ya está en app.module.ts
# Generar Prisma (si no está hecho)
npm run prisma:generate

# Compilar TypeScript
npm run build

# Ejecutar en desarrollo
npm run start:dev
```

### 2. Frontend
```bash
cd apps/web

# Las dependencias ya están instaladas:
# - react-hook-form
# - zod
# - @hookform/resolvers

# Ejecutar en desarrollo
npm run dev

# Acceder a
# http://localhost:3000/admin
```

### 3. Pruebas

**Crear un plugin via API:**
```bash
curl -X POST http://localhost:3000/admin/plugins \
  -H "Authorization: Bearer YOUR_JWT" \
  -H "Content-Type: multipart/form-data" \
  -F "title=Test Plugin" \
  -F "version=1.0.0" \
  -F "description=Test description" \
  -F "descriptionHtml=<p>Test</p>" \
  -F "price=0" \
  -F "categories=Test" \
  -F "published=false" \
  -F "coverImage=@cover.png" \
  -F "pluginFile=@plugin.jar"
```

**Listar plugins:**
```bash
curl -X GET "http://localhost:3000/admin/plugins?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT"
```

---

## 📊 Archivos de Almacenamiento

Los archivos se guardan en:
```
public/uploads/
├── covers/
│   ├── {uuid-1}.png
│   └── {uuid-2}.jpg
├── banners/
│   ├── {uuid-3}.png
│   └── {uuid-4}.jpg
└── plugins/
    ├── {uuid-5}.jar
    └── {uuid-6}.zip
```

Las URLs públicas son:
```
/uploads/covers/{uuid}.png
/uploads/banners/{uuid}.jpg
/uploads/plugins/{uuid}.jar
```

---

## ✅ Checklist de Funcionalidad

### Backend
- [x] AdminModule creado
- [x] AdminPluginsController con 6 endpoints
- [x] AdminPluginsService (CRUD completo)
- [x] FileUploadService (subida + limpieza)
- [x] DTOs con validaciones
- [x] RolesGuard integrado
- [x] Manejo de errores
- [x] Logging

### Frontend
- [x] Layout admin + Sidebar
- [x] Dashboard
- [x] Tabla de plugins
- [x] Formulario crear
- [x] Formulario editar
- [x] RichTextEditor
- [x] Validación Zod
- [x] Protected routes
- [x] Responsive design
- [x] TypeScript

### Seguridad
- [x] JWT + RolesGuard
- [x] Validación MIME types
- [x] Límites de tamaño
- [x] Path traversal prevention
- [x] HTML sanitization

---

## 🔧 Configuración de Variables

No requiere nuevas variables de entorno. Usa las existentes:
- `DATABASE_URL` - Prisma
- `JWT_SECRET` - Autenticación

Opcional para S3:
```env
# Si quieres usar S3 en lugar de almacenamiento local
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_BUCKET_NAME=...
```

---

## 📚 Archivos de Referencia

Dentro de cada módulo (backend y frontend) encontrarás:
- `INSTALLATION.md` - Guía de instalación
- `USAGE.md` - Cómo usar
- `API_REFERENCE.md` - Endpoints
- `COMPONENT_REFERENCE.md` - Componentes

---

## 🎯 Casos de Uso Permitidos

### ✅ Permitido (Admin/CEO)
- Subir plugin con descripción manual
- Subir múltiples imágenes
- Editar plugin existente
- Cambiar estado published/draft
- Eliminar plugin
- Ver estadísticas

### ❌ Bloqueado
- Usuarios normales no pueden acceder `/admin`
- No se permite actualizar otros campos automáticamente
- Solo archivos permitidos se pueden subir
- No se permite path traversal

---

## 🐛 Debugging

### Backend
```typescript
// Logs en servidor
[AdminPluginsService] Creating plugin with title: Advanced Economy
[FileUploadService] Uploaded file to: /uploads/covers/uuid-123.png
[AdminPluginsController] Plugin created: id-456
```

### Frontend
```typescript
// En console
console.log('Form data:', formData);
console.log('Validation error:', error);
console.log('API response:', response);
```

---

## 📞 Próximos Pasos

1. **Pruebar en desarrollo**
   ```bash
   npm run dev
   # Acceder a http://localhost:3000/admin
   ```

2. **Crear usuario ADMIN**
   - Modificar rol en DB o crear seed

3. **Obtener JWT token**
   - Usar endpoint de login existente

4. **Subir primer plugin**
   - Via formulario o cURL

5. **Opcional: Integrar S3**
   - Modificar FileUploadService

---

## 📞 Soporte

Revisa la documentación en cada módulo:
- `apps/api/src/admin/ADMIN_MODULE.md`
- `apps/web/src/app/admin/ADMIN_INTERFACE_GUIDE.md`

---

**✅ Estado: LISTO PARA USAR EN DESARROLLO**

Panel de administración completamente funcional con seguridad integrada.
