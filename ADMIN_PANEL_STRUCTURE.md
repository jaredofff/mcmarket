# 📁 Estructura de Directorios - Panel de Administración

## Árbol Completo

```
mcmarket/
├── apps/
│   ├── api/
│   │   └── src/
│   │       ├── admin/                           ← NUEVO MÓDULO
│   │       │   ├── admin.module.ts
│   │       │   ├── controllers/
│   │       │   │   └── admin-plugins.controller.ts
│   │       │   ├── services/
│   │       │   │   ├── admin-plugins.service.ts
│   │       │   │   └── file-upload.service.ts
│   │       │   └── dtos/
│   │       │       ├── create-admin-plugin.dto.ts
│   │       │       └── update-admin-plugin.dto.ts
│   │       │
│   │       ├── app.module.ts                   [MODIFICADO - Importa AdminModule]
│   │       ├── auth/
│   │       │   ├── roles.guard.ts              [EXISTENTE]
│   │       │   └── jwt-auth.guard.ts           [EXISTENTE]
│   │       ├── plugins/
│   │       │   ├── plugins.service.ts          [EXISTENTE]
│   │       │   ├── plugins.controller.ts       [EXISTENTE]
│   │       │   └── plugins.module.ts           [EXISTENTE]
│   │       ├── prisma/
│   │       │   └── schema.prisma               [EXISTENTE]
│   │       └── ...
│   │
│   └── web/
│       └── src/
│           └── app/
│               ├── admin/                       ← NUEVA CARPETA
│               │   ├── layout.tsx
│               │   ├── page.tsx
│               │   ├── plugins/
│               │   │   ├── page.tsx             [Tabla de plugins]
│               │   │   ├── new/
│               │   │   │   └── page.tsx         [Crear plugin]
│               │   │   └── [id]/
│               │   │       └── edit/
│               │   │           └── page.tsx     [Editar plugin]
│               │   └── components/
│               │       ├── AdminSidebar.tsx
│               │       ├── PluginForm.tsx
│               │       ├── PluginTable.tsx
│               │       └── RichTextEditor.tsx
│               │
│               ├── middleware.ts                [NUEVO - Protección de rutas]
│               ├── marketplace/
│               ├── plugins/
│               ├── resources/
│               └── ...
│
└── public/
    └── uploads/                                  ← NUEVO - Almacenamiento
        ├── covers/
        │   ├── {uuid-1}.png
        │   ├── {uuid-2}.jpg
        │   └── ...
        ├── banners/
        │   ├── {uuid-3}.png
        │   ├── {uuid-4}.jpg
        │   └── ...
        └── plugins/
            ├── {uuid-5}.jar
            ├── {uuid-6}.zip
            └── ...
```

---

## Archivos Nuevos (Backend)

### 1. admin/admin.module.ts
- **Propósito:** Módulo raíz que configura controladores y servicios
- **Tamaño:** ~15 líneas
- **Importa:** PluginsModule, PrismaModule, RolesGuard
- **Exporta:** AdminPluginsService, FileUploadService

### 2. admin/controllers/admin-plugins.controller.ts
- **Propósito:** Endpoints REST para gestión de plugins
- **Tamaño:** ~200 líneas
- **Endpoints:**
  - `POST /admin/plugins` - Crear
  - `GET /admin/plugins` - Listar
  - `GET /admin/plugins/:id` - Detalle
  - `PUT /admin/plugins/:id` - Actualizar
  - `DELETE /admin/plugins/:id` - Eliminar
  - `POST /admin/plugins/:id/publish` - Cambiar estado

### 3. admin/services/admin-plugins.service.ts
- **Propósito:** Lógica de negocio CRUD
- **Tamaño:** ~300 líneas
- **Métodos:**
  - `createPlugin()` - Crear con archivos
  - `listPlugins()` - Listar con paginación
  - `getPluginDetail()` - Obtener un plugin
  - `updatePlugin()` - Actualizar
  - `deletePlugin()` - Eliminar
  - `publishPlugin()` - Cambiar estado
  - `generateUniqueSlug()` - Genera slug único

### 4. admin/services/file-upload.service.ts
- **Propósito:** Gestión de almacenamiento de archivos
- **Tamaño:** ~100 líneas
- **Métodos:**
  - `uploadFile()` - Guarda en `/public/uploads/{folder}/`
  - `deleteFile()` - Elimina archivos
  - `ensureUploadsDir()` - Crea directorios si no existen

### 5. admin/dtos/create-admin-plugin.dto.ts
- **Propósito:** Validación al crear plugin
- **Tamaño:** ~40 líneas
- **Validaciones:** class-validator decorators
  - title: 3-200 chars
  - description: 10-5000 chars
  - price: >= 0
  - version: formato semver

### 6. admin/dtos/update-admin-plugin.dto.ts
- **Propósito:** Validación al actualizar plugin
- **Tamaño:** ~40 líneas
- **Nota:** Todos los campos son opcionales (PartialType)

---

## Archivos Nuevos (Frontend)

### 1. admin/layout.tsx
- **Propósito:** Layout principal del panel
- **Tamaño:** ~50 líneas
- **Incluye:**
  - Sidebar con navegación
  - Header con logout
  - Main content area

### 2. admin/page.tsx
- **Propósito:** Dashboard (página de inicio)
- **Tamaño:** ~100 líneas
- **Contenido:**
  - Estadísticas (total, activos, draft)
  - Últimos plugins
  - Links rápidos

### 3. admin/plugins/page.tsx
- **Propósito:** Tabla de todos los plugins
- **Tamaño:** ~150 líneas
- **Incluye:**
  - Componente PluginTable
  - Búsqueda y filtros
  - Botón "Nuevo Plugin"
  - Paginación

### 4. admin/plugins/new/page.tsx
- **Propósito:** Formulario crear plugin
- **Tamaño:** ~30 líneas
- **Incluye:**
  - Componente PluginForm
  - Manejo de submit
  - Redirección tras éxito

### 5. admin/plugins/[id]/edit/page.tsx
- **Propósito:** Formulario editar plugin
- **Tamaño:** ~50 líneas
- **Incluye:**
  - Carga datos previos
  - Componente PluginForm reutilizado
  - Manejo de actualización

### 6. admin/components/AdminSidebar.tsx
- **Propósito:** Navegación lateral
- **Tamaño:** ~100 líneas
- **Features:**
  - Menu items con links
  - Active state
  - Responsive collapse

### 7. admin/components/PluginForm.tsx
- **Propósito:** Formulario completo de plugins
- **Tamaño:** ~250 líneas
- **Features:**
  - Validación con Zod + react-hook-form
  - Upload de 3 archivos
  - Preview de imágenes
  - Editor Markdown

### 8. admin/components/PluginTable.tsx
- **Propósito:** Tabla de datos
- **Tamaño:** ~150 líneas
- **Features:**
  - Filas renderizadas
  - Acciones (edit, delete, view)
  - Loading skeleton
  - Responsive

### 9. admin/components/RichTextEditor.tsx
- **Propósito:** Editor Markdown con preview
- **Tamaño:** ~120 líneas
- **Features:**
  - Toolbar con botones
  - Preview en vivo
  - Syntax highlighting

---

## Archivos Modificados

### 1. apps/api/src/app.module.ts
**Cambio:**
```typescript
// ANTES
import { PluginsModule } from './plugins/plugins.module';

// DESPUÉS
import { PluginsModule } from './plugins/plugins.module';
import { AdminModule } from './admin/admin.module';  ← NUEVO

@Module({
  imports: [
    // ...
    PluginsModule,
    AdminModule,  ← NUEVO
  ],
})
```

### 2. apps/web/src/middleware.ts
**Nuevo archivo:**
```typescript
// Protege rutas /admin/* verificando JWT y rol
// Solo permite ADMIN y CEO
```

---

## Árbol de Rutas (Navegación Frontend)

```
/                          [Landing]
├── /marketplace           [Tabla pública]
├── /plugins/:slug         [Detalle público]
├── /checkout              [Checkout]
└── /admin                 [PROTEGIDO - Solo ADMIN/CEO]
    ├── /                  [Dashboard]
    ├── /plugins           [Lista de plugins]
    ├── /plugins/new       [Crear plugin]
    └── /plugins/:id/edit  [Editar plugin]
```

---

## Árbol de Rutas (API Backend)

```
/                          [Health check]
├── /auth/*                [Existente]
├── /plugins               [Existente - Público]
│   ├── GET /             [Listar público]
│   ├── GET /:slug        [Detalle público]
│   └── GET /search       [Búsqueda pública]
└── /admin/plugins         [NUEVO - Protegido ADMIN/CEO]
    ├── POST /            [Crear]
    ├── GET /             [Listar]
    ├── GET /:id          [Detalle]
    ├── PUT /:id          [Actualizar]
    ├── DELETE /:id       [Eliminar]
    └── POST /:id/publish [Cambiar estado]
```

---

## Archivos de Referencia/Documentación

Ubicados en raíz del proyecto:

```
mcmarket/
├── ADMIN_PANEL_IMPLEMENTATION.md  [Guía completa de implementación]
├── ADMIN_PANEL_SNIPPETS.md        [Código listo para copiar/pegar]
├── CHANGES_SUMMARY.md             [Historial de cambios]
├── FINAL_REPORT.md                [Reporte anterior]
└── ...
```

---

## Resumen de Recuento

| Categoría | Cantidad |
|-----------|----------|
| **Archivos Backend Nuevos** | 6 |
| **Archivos Frontend Nuevos** | 9 |
| **Archivos Modificados** | 2 (app.module.ts, middleware.ts) |
| **Carpetas Nuevas** | 2 (admin/, public/uploads/) |
| **Líneas de Código** | ~2,500 |
| **Documentación** | 2 guías + snippets |

---

## Dependencias Instaladas

Se añadieron las siguientes dependencias (ya instaladas por subagentes):

**Backend:**
- `@nestjs/platform-express` (File upload interceptor)

**Frontend:**
- `react-hook-form` (Gestión de formularios)
- `zod` (Validación schemas)
- `@hookform/resolvers` (Integración Zod + RHF)
- `react-markdown` (Preview Markdown)

---

## Siguientes Pasos

1. **Verificar instalación**
   ```bash
   npm install
   npm run build
   ```

2. **Generar Prisma Client**
   ```bash
   npx prisma generate
   ```

3. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

4. **Acceder al panel**
   ```
   http://localhost:3000/admin
   (requiere JWT de usuario con rol ADMIN o CEO)
   ```

5. **Crear primer plugin**
   - Navegar a `/admin/plugins/new`
   - Completar formulario
   - Hacer click "Guardar"

---

**✅ Estructura completamente documentada y lista**
