# Módulo Admin - Documentación

## Descripción General

El módulo de administración para NestJS proporciona endpoints para gestionar plugins en la plataforma mcmarket. Incluye autenticación basada en JWT y control de roles (ADMIN, CEO).

## Estructura de Directorios

```
apps/api/src/admin/
├── admin.module.ts                    # Módulo principal
├── controllers/
│   └── admin-plugins.controller.ts    # Endpoints REST
├── services/
│   ├── admin-plugins.service.ts       # Lógica de negocios
│   └── file-upload.service.ts         # Gestión de archivos
└── dtos/
    ├── create-admin-plugin.dto.ts     # DTO para crear plugins
    └── update-admin-plugin.dto.ts     # DTO para actualizar plugins
```

## Archivos Creados

### 1. admin.module.ts
Módulo principal que configura:
- Imports: PluginsModule, PrismaModule, AuthModule
- Controllers: AdminPluginsController
- Providers: AdminPluginsService, FileUploadService
- Exports: AdminPluginsService, FileUploadService

### 2. admin-plugins.controller.ts
Endpoints REST con autenticación JWT y control de roles:

| Método | Ruta | Roles | Descripción |
|--------|------|-------|-------------|
| POST | /admin/plugins | ADMIN, CEO | Crear nuevo plugin |
| GET | /admin/plugins | ADMIN, CEO | Listar plugins con filtros |
| GET | /admin/plugins/:id | ADMIN, CEO | Obtener detalle de plugin |
| PUT | /admin/plugins/:id | ADMIN, CEO | Actualizar plugin |
| POST | /admin/plugins/:id/publish | ADMIN, CEO | Publicar plugin |
| DELETE | /admin/plugins/:id | ADMIN, CEO | Eliminar plugin |

#### Ejemplos de uso:

**Crear plugin (POST /admin/plugins)**
```bash
curl -X POST http://localhost:3000/admin/plugins \
  -H "Authorization: Bearer <token>" \
  -F "title=Mi Plugin" \
  -F "description=Descripción del plugin" \
  -F "version=1.0.0" \
  -F "price=0" \
  -F "coverImage=@cover.jpg" \
  -F "bannerImage=@banner.jpg" \
  -F "pluginFile=@plugin.zip"
```

**Listar plugins (GET /admin/plugins)**
```bash
curl -X GET "http://localhost:3000/admin/plugins?limit=20&offset=0&search=texto&published=true" \
  -H "Authorization: Bearer <token>"
```

**Obtener detalle (GET /admin/plugins/:id)**
```bash
curl -X GET http://localhost:3000/admin/plugins/{id} \
  -H "Authorization: Bearer <token>"
```

**Actualizar plugin (PUT /admin/plugins/:id)**
```bash
curl -X PUT http://localhost:3000/admin/plugins/{id} \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Nuevo título", "price": 10.99}'
```

**Publicar plugin (POST /admin/plugins/:id/publish)**
```bash
curl -X POST http://localhost:3000/admin/plugins/{id}/publish \
  -H "Authorization: Bearer <token>"
```

**Eliminar plugin (DELETE /admin/plugins/:id)**
```bash
curl -X DELETE http://localhost:3000/admin/plugins/{id} \
  -H "Authorization: Bearer <token>"
```

### 3. admin-plugins.service.ts
Servicio con métodos principales:

- **createPlugin(dto, creatorId, files)** - Crea nuevo plugin
  - Genera slug único
  - Valida y sube imágenes (< 5MB)
  - Valida y sube archivo plugin (< 100MB)
  - Crea snapshot automáticamente

- **listPlugins(limit, offset, search, published)** - Lista plugins
  - Paginación configurable
  - Búsqueda por título, descripción, autor
  - Filtro por estado publicado

- **getPluginDetail(id)** - Obtiene detalle completo
  - Incluye todas las versiones
  - Incluye snapshot actual
  - Información del creador

- **updatePlugin(id, dto, files)** - Actualiza plugin
  - Maneja sustitución de archivos
  - Elimina archivos anteriores automáticamente
  - Actualiza snapshot si es necesario

- **publishPlugin(id)** - Publica plugin
  - Cambia estado a published = true
  - Retorna plugin actualizado

- **deletePlugin(id)** - Elimina plugin
  - Borra archivos del filesystem
  - Elimina registro de BD

### 4. file-upload.service.ts
Servicio de gestión de archivos:

- **uploadFile(buffer, mimetype, folder)** - Sube archivo
  - Genera nombre único con crypto.randomBytes
  - Crea carpetas automáticamente
  - Retorna ruta relativa (/uploads/...)

- **deleteFile(filePath)** - Borra archivo
  - Valida seguridad (no acceso fuera de /uploads)
  - Maneja archivos inexistentes sin error

- **validateImageFile(mimetype)** - Valida tipos de imagen
  - Acepta: JPEG, PNG, GIF, WebP

- **validatePluginFile(mimetype)** - Valida tipos de plugin
  - Acepta: ZIP, JAR

- **validateFileSize(buffer, maxSizeMb)** - Valida tamaño

### 5. DTOs

#### CreateAdminPluginDto
Campos validados:
- `title` (required, 3-200 caracteres)
- `description` (required, 10-5000 caracteres)
- `descriptionHtml` (optional)
- `version` (required, >0 caracteres)
- `author` (optional)
- `price` (required, >= 0)
- `testedVersions` (optional array)
- `dependencies` (optional array)
- `tags` (optional array)
- `categories` (optional array)
- `testServerUrl` (optional)
- `isVipOnly` (optional boolean)
- `published` (optional boolean)
- `sourceUrl` (optional)

#### UpdateAdminPluginDto
Todos los campos del CreateAdminPluginDto pero opcionales, más:
- `coverImage` (optional)
- `bannerImage` (optional)

## Validaciones

### Archivos
- **Imágenes (cover, banner)**: Máximo 5MB, tipos JPEG/PNG/GIF/WebP
- **Plugin (zip)**: Máximo 100MB, tipo ZIP/JAR

### Campos
- Título: 3-200 caracteres
- Descripción: 10-5000 caracteres
- Versión: Requerida
- Precio: No negativo

## Respuestas

### Respuesta de Crear/Actualizar Plugin
```json
{
  "id": "uuid",
  "title": "Mi Plugin",
  "slug": "mi-plugin",
  "description": "...",
  "price": 9.99,
  "version": "1.0.0",
  "author": "Autor",
  "published": false,
  "coverImage": "/uploads/plugins/covers/abc123.jpg",
  "bannerImage": "/uploads/plugins/banners/def456.jpg",
  "fileUrl": "/uploads/plugins/files/ghi789.zip",
  "tags": [],
  "categories": [],
  "testedVersions": [],
  "dependencies": [],
  "isVipOnly": false,
  "downloadCount": 0,
  "rating": 0,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z",
  "creator": {
    "id": "uuid",
    "name": "Creator Name",
    "email": "creator@example.com"
  }
}
```

### Respuesta de Listar
```json
{
  "items": [...],
  "total": 100,
  "limit": 20,
  "offset": 0,
  "hasMore": true
}
```

## Manejo de Errores

El módulo lanza excepciones NestJS estándar:

- **BadRequestException**: Validación fallida, archivo vacío, tipos inválidos
- **NotFoundException**: Plugin no encontrado
- **InternalServerErrorException**: Errores en operaciones de BD

Ejemplo de respuesta de error:
```json
{
  "statusCode": 400,
  "message": "El archivo excede el tamaño máximo de 5MB",
  "error": "Bad Request"
}
```

## Integración

El AdminModule está integrado en `app.module.ts` y se importa automáticamente.

Para usar en otros módulos:
```typescript
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [AdminModule]
})
export class OtherModule {}
```

## Rutas de Archivos

Los archivos se guardan en:
- Imágenes de portada: `public/uploads/plugins/covers/{uuid}.jpg`
- Imágenes de banner: `public/uploads/plugins/banners/{uuid}.jpg`
- Archivos de plugin: `public/uploads/plugins/files/{uuid}.zip`

Las rutas retornadas en las respuestas son relativas y accesibles vía:
- `http://localhost:3000/uploads/plugins/covers/{uuid}.jpg`

## Notas Importantes

1. **Autenticación requerida**: Todos los endpoints requieren JWT válido
2. **Control de roles**: Solo ADMIN y CEO pueden acceder
3. **Slug único**: Se genera automáticamente, es único en la BD
4. **Snapshot**: Se crea/actualiza automáticamente
5. **Precios**: Se guardan en centavos en BD, se retornan en pesos
6. **Seguridad**: Los archivos se validan por tipo MIME y tamaño
7. **Cleanup**: Se eliminan archivos anteriores al actualizar

## Testing

Para probar los endpoints, es necesario:
1. Obtener token JWT válido con rol ADMIN o CEO
2. Incluir token en header `Authorization: Bearer <token>`
3. Usar Content-Type: multipart/form-data para uploads

## Dependencias

- @nestjs/common (guards, interceptors, decorators)
- @nestjs/platform-express (FileFieldsInterceptor)
- @prisma/client (ORM)
- class-validator (validación de DTOs)
- slug (generación de slugs)
- crypto (generación de nombres únicos)
