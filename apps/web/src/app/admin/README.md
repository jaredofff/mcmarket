# Admin Interface Implementation - MC Market

## 📋 Estructura Creada

### Archivos Implementados (9 archivos + 1 middleware)

#### 1. **admin/layout.tsx**
- Layout principal del panel de administración
- Incluye header con título "Admin Panel"
- Renderiza el Sidebar (AdminSidebar)
- Protección de metadatos
- Estructura base para todas las páginas admin

#### 2. **admin/page.tsx**
- Dashboard principal del admin
- Muestra estadísticas (total plugins, publicados, borradores, descargas)
- Sección de plugins recientes
- Botones de acción rápida (crear plugin, ver todos)
- Manejo de estados de carga y errores

#### 3. **admin/plugins/page.tsx**
- Tabla listado de plugins con paginación
- Búsqueda y filtros (por estado: published/draft)
- Integración con componente PluginTable
- Manejo de acciones: editar, publicar, eliminar
- Responsive design con paginación

#### 4. **admin/plugins/new/page.tsx**
- Página para crear nuevo plugin
- Integra el componente PluginForm
- Envía datos a `/api/admin/plugins` (POST)
- Manejo de errores y loading states
- Redirección al listado tras crear

#### 5. **admin/plugins/[id]/edit/page.tsx**
- Página para editar plugin existente
- Carga datos previos desde `/api/admin/plugins/{id}`
- Integra el componente PluginForm en modo edición
- Actualiza a través de `/api/admin/plugins/{id}` (PUT)
- Validación de datos con Zod

#### 6. **components/AdminSidebar.tsx**
- Sidebar responsive con navegación
- Menú items: Dashboard, Plugins, Resources, Users
- Estados activos dinámicos según ruta actual
- Menu colapsable en mobile
- Info de usuario y botón logout
- Verificación de rol de usuario (admin/CEO)

#### 7. **components/PluginTable.tsx**
- Tabla de datos de plugins
- Columnas: Título, Autor, Precio, Estado, Fecha, Acciones
- Botones de acción: Editar, Publicar, Eliminar
- Estados visuales: Published (verde), Draft (amarillo)
- Loading skeleton
- Manejo asincrónico de acciones

#### 8. **components/PluginForm.tsx**
- Formulario completo para crear/editar plugins
- Validación con Zod + react-hook-form
- Campos:
  - Básicos: título, versión, precio, categoría, tier
  - Versiones testeadas
  - Descripción con RichTextEditor (Markdown)
  - Imágenes: cover y banner con preview
  - Archivo del plugin (.jar)
  - Checkboxes: VIP Only, Publish Immediately
- Manejo de archivos con FormData
- Manejo de errores

#### 9. **components/RichTextEditor.tsx**
- Editor Markdown simple
- Toolbar con herramientas: Bold, Italic, Code, Link
- Preview en tiempo real (lado derecho)
- Textarea con validación
- Soporte Markdown completo
- Respuesta reactiva a cambios

### Archivo Middleware
**src/middleware.ts**
- Protección de rutas `/admin/*`
- Verifica autenticación (session)
- Verifica rol (admin o CEO)
- Redirección a "/" si no autorizado

## 🎨 Diseño y Estilos

- **Tailwind CSS**: Todos los estilos con Tailwind (sin componentes UI externos)
- **Tema**: Oscuro con acentos ámbar (#amber-500)
- **Colores base**:
  - Fondo: `#141311` (global), `#1a1714` (componentes)
  - Texto: `#e8e4db` (principal), `#a89968` (secundario)
  - Acentos: ámbar, verde, rojo, azul

## 🔐 Protección y Seguridad

1. **Middleware** (`src/middleware.ts`):
   - Verifica sesión en todas rutas `/admin`
   - Valida rol: solo ADMIN o CEO

2. **Client-Side** (AdminSidebar):
   - Verificación adicional de rol
   - No renderiza si no autorizado

3. **API**: Requiere validación en backend (endpoints `/api/admin/*`)

## 📱 Responsividad

- **Mobile-first approach**
- Sidebar: collapse en mobile, hamburger menu
- Tablas: scroll horizontal en mobile
- Grid layouts adaptativos (1 col mobile, múltiples en desktop)

## 🔌 Dependencias Utilizadas

```json
{
  "react-hook-form": "^7.76.1",
  "zod": "^4.4.3",
  "@hookform/resolvers": "^5.4.0",
  "react-markdown": "^10.1.0",
  "lucide-react": "^1.16.0",
  "next-auth": "5.0.0-beta.31"
}
```

## 🛣️ Rutas Disponibles

```
/admin                           → Dashboard
/admin/plugins                   → Listado de plugins
/admin/plugins/new               → Crear plugin
/admin/plugins/[id]/edit         → Editar plugin
/admin/resources                 → Resources (placeholder)
/admin/users                     → Users (placeholder)
```

## 📡 Endpoints API Esperados

```
GET    /api/admin/stats                    → Estadísticas del dashboard
GET    /api/admin/plugins                  → Listado con paginación
GET    /api/admin/plugins/:id              → Detalle del plugin
POST   /api/admin/plugins                  → Crear plugin
PUT    /api/admin/plugins/:id              → Actualizar plugin
DELETE /api/admin/plugins/:id              → Eliminar plugin
PATCH  /api/admin/plugins/:id/publish      → Publicar/cambiar estado
```

## ✅ Características Implementadas

- ✅ TypeScript completo
- ✅ Validación con Zod
- ✅ React Hook Form para formularios
- ✅ Markdown editor con preview
- ✅ Upload de imágenes con preview
- ✅ Paginación en tablas
- ✅ Búsqueda y filtros
- ✅ Estados de carga (skeletons)
- ✅ Manejo de errores
- ✅ Design responsive
- ✅ Sidebar colapsable mobile
- ✅ Dark theme con Tailwind
- ✅ Protección de rutas (role-based)
- ✅ Logout funcional

## 🚀 Próximos Pasos

1. **Implementar endpoints API** en `/apps/api/`:
   - `/admin/plugins` (CRUD)
   - `/admin/stats`
   - Validar roles en backend

2. **Mejorar validación** de archivos (tamaño, tipo)

3. **Agregar más funcionalidades** (users, resources)

4. **Testing** (unit tests para componentes)

5. **Optimizaciones** (code splitting, lazy loading)
