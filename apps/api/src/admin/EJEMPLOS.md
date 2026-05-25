# Ejemplo de Uso del Módulo Admin

## Resumen Rápido

El módulo admin proporciona endpoints para gestionar plugins en la plataforma. Todos requieren autenticación JWT con roles ADMIN o CEO.

## Flujo Básico

### 1. Crear un Plugin

```bash
curl -X POST http://localhost:3000/admin/plugins \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -F "title=Mi Increíble Plugin" \
  -F "description=Una descripción detallada del plugin" \
  -F "version=1.0.0" \
  -F "author=Mi Nombre" \
  -F "price=9.99" \
  -F "tags=utilidad" \
  -F "tags=admin" \
  -F "categories=management" \
  -F "isVipOnly=false" \
  -F "coverImage=@cover.jpg" \
  -F "bannerImage=@banner.jpg" \
  -F "pluginFile=@plugin.zip"
```

**Respuesta (201 Created):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Mi Increíble Plugin",
  "slug": "mi-increible-plugin",
  "description": "Una descripción detallada del plugin",
  "price": 9.99,
  "version": "1.0.0",
  "author": "Mi Nombre",
  "published": false,
  "coverImage": "/uploads/plugins/covers/a1b2c3d4.jpg",
  "bannerImage": "/uploads/plugins/banners/e5f6g7h8.jpg",
  "fileUrl": "/uploads/plugins/files/i9j0k1l2.zip",
  "tags": ["utilidad", "admin"],
  "categories": ["management"],
  "isVipOnly": false,
  "downloadCount": 0,
  "rating": 0,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "creator": {
    "id": "uuid-del-creador",
    "name": "Mi Usuario",
    "email": "user@example.com"
  }
}
```

### 2. Listar Plugins con Filtros

```bash
# Todos los plugins
curl "http://localhost:3000/admin/plugins?limit=10&offset=0" \
  -H "Authorization: Bearer {JWT_TOKEN}"

# Buscar por texto
curl "http://localhost:3000/admin/plugins?search=plugin" \
  -H "Authorization: Bearer {JWT_TOKEN}"

# Solo plugins publicados
curl "http://localhost:3000/admin/plugins?published=true" \
  -H "Authorization: Bearer {JWT_TOKEN}"

# Con paginación
curl "http://localhost:3000/admin/plugins?limit=50&offset=100" \
  -H "Authorization: Bearer {JWT_TOKEN}"
```

**Respuesta:**
```json
{
  "items": [
    {
      "id": "plugin-id-1",
      "title": "Plugin 1",
      "slug": "plugin-1",
      ...
    },
    {
      "id": "plugin-id-2",
      "title": "Plugin 2",
      "slug": "plugin-2",
      ...
    }
  ],
  "total": 45,
  "limit": 10,
  "offset": 0,
  "hasMore": true
}
```

### 3. Obtener Detalle de Plugin

```bash
curl "http://localhost:3000/admin/plugins/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer {JWT_TOKEN}"
```

### 4. Actualizar Plugin

```bash
# Actualizar solo datos (sin archivos)
curl -X PUT "http://localhost:3000/admin/plugins/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi Plugin Actualizado",
    "price": 14.99,
    "version": "1.1.0",
    "tags": ["utilidad", "admin", "nuevo"]
  }'

# Actualizar con nueva imagen de portada
curl -X PUT "http://localhost:3000/admin/plugins/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer {JWT_TOKEN}" \
  -F "title=Mi Plugin Actualizado" \
  -F "price=14.99" \
  -F "coverImage=@new-cover.jpg"
```

### 5. Publicar Plugin

```bash
curl -X POST "http://localhost:3000/admin/plugins/550e8400-e29b-41d4-a716-446655440000/publish" \
  -H "Authorization: Bearer {JWT_TOKEN}"
```

**Respuesta:** Plugin con `published: true`

### 6. Eliminar Plugin

```bash
curl -X DELETE "http://localhost:3000/admin/plugins/550e8400-e29b-41d4-a716-446655440000" \
  -H "Authorization: Bearer {JWT_TOKEN}"
```

**Respuesta:**
```json
{
  "message": "Plugin eliminado exitosamente",
  "pluginId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Códigos de Respuesta

| Código | Significado | Ejemplo |
|--------|-------------|---------|
| 201 | Creado exitosamente | POST /admin/plugins |
| 200 | OK - Operación exitosa | GET, PUT, DELETE |
| 400 | Bad Request - Validación fallida | Archivo muy grande, tipo inválido |
| 401 | Unauthorized - Sin autenticación | Falta token JWT |
| 403 | Forbidden - Rol insuficiente | No es ADMIN ni CEO |
| 404 | Not Found - Plugin no existe | GET/PUT/DELETE de ID inválido |
| 500 | Server Error | Error interno del servidor |

## Validaciones Importantes

### Tamaño de Archivos
- **Imágenes (cover, banner)**: Máximo 5MB
  - Formatos: JPEG, PNG, GIF, WebP
- **Archivo plugin**: Máximo 100MB
  - Formatos: ZIP, JAR

### Campos Requeridos en Creación
- `title` (3-200 caracteres)
- `description` (10-5000 caracteres)
- `version` (mínimo 1 carácter)
- `price` (>= 0)

### Validación de Datos
- Precio se almacena en centavos internamente (se divide/multiplica por 100)
- El slug se genera automáticamente y es único
- Se elimina automáticamente la imagen anterior al actualizar

## Ejemplos Completos con cURL

### Crear Plugin Completo

```bash
#!/bin/bash

TOKEN="eyJhbGc..."  # Tu token JWT
PLUGIN_ID="new-plugin-id"

curl -X POST http://localhost:3000/admin/plugins \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Gestor de Permisos Pro" \
  -F "description=Plugin avanzado para gestionar permisos de usuario con interfaz visual" \
  -F "version=2.1.0" \
  -F "author=DevTeam" \
  -F "price=24.99" \
  -F "tags=permisos" \
  -F "tags=seguridad" \
  -F "tags=admin" \
  -F "categories=management" \
  -F "categories=security" \
  -F "testedVersions=1.19.2" \
  -F "testedVersions=1.20.1" \
  -F "dependencies=ProtocolLib" \
  -F "isVipOnly=false" \
  -F "testServerUrl=https://test.example.com" \
  -F "coverImage=@cover.png" \
  -F "bannerImage=@banner.png" \
  -F "pluginFile=@plugin.zip"
```

### Workflow Completo: Crear, Actualizar, Publicar

```bash
#!/bin/bash

TOKEN="eyJhbGc..."
BASE_URL="http://localhost:3000"

# 1. Crear plugin
echo "1. Creando plugin..."
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/admin/plugins" \
  -H "Authorization: Bearer $TOKEN" \
  -F "title=Mi Plugin Test" \
  -F "description=Descripción del plugin de prueba" \
  -F "version=1.0.0" \
  -F "price=0" \
  -F "coverImage=@cover.jpg" \
  -F "pluginFile=@plugin.zip")

PLUGIN_ID=$(echo $CREATE_RESPONSE | jq -r '.id')
echo "Plugin creado: $PLUGIN_ID"

# 2. Actualizar plugin
echo "2. Actualizando plugin..."
curl -s -X PUT "$BASE_URL/admin/plugins/$PLUGIN_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi Plugin Test - Actualizado",
    "tags": ["test", "demo"],
    "price": 4.99
  }' | jq '.'

# 3. Publicar plugin
echo "3. Publicando plugin..."
curl -s -X POST "$BASE_URL/admin/plugins/$PLUGIN_ID/publish" \
  -H "Authorization: Bearer $TOKEN" | jq '.'

# 4. Verificar que está publicado
echo "4. Verificando estado..."
curl -s -X GET "$BASE_URL/admin/plugins/$PLUGIN_ID" \
  -H "Authorization: Bearer $TOKEN" | jq '.published'
```

## Manejo de Errores

### Archivo demasiado grande
```json
{
  "statusCode": 400,
  "message": "El archivo excede el tamaño máximo de 5MB. Tamaño actual: 7.50MB",
  "error": "Bad Request"
}
```

### Tipo de archivo inválido
```json
{
  "statusCode": 400,
  "message": "Tipo de archivo no permitido. Formatos válidos: JPEG, PNG, GIF, WebP. Recibido: image/svg+xml",
  "error": "Bad Request"
}
```

### Plugin no encontrado
```json
{
  "statusCode": 404,
  "message": "Plugin no encontrado: invalid-id",
  "error": "Not Found"
}
```

### Acceso denegado
```json
{
  "statusCode": 403,
  "message": "Access denied. Required roles: ADMIN, CEO. User role: USER",
  "error": "Forbidden"
}
```

## Obtener URLs Públicas de Archivos

Los archivos subidos están disponibles públicamente en:

```
Imagen de portada: http://localhost:3000{plugin.coverImage}
Banner: http://localhost:3000{plugin.bannerImage}
Plugin: http://localhost:3000{plugin.fileUrl}
```

Ejemplo:
```
http://localhost:3000/uploads/plugins/covers/a1b2c3d4.jpg
http://localhost:3000/uploads/plugins/banners/e5f6g7h8.jpg
http://localhost:3000/uploads/plugins/files/i9j0k1l2.zip
```

## Notas

- Todos los endpoints están protegidos con JWT
- Solo usuarios con rol ADMIN o CEO pueden acceder
- Los archivos se sirven desde `/uploads` que está disponible públicamente
- Se guardan en el directorio `public/uploads`
- Los nombres de archivo se generan automáticamente (UUID)
- El slug se genera a partir del título y es único

## Integración con Frontend

```typescript
// Ejemplo en TypeScript/React
const token = localStorage.getItem('jwt_token');

const createPlugin = async (formData: FormData) => {
  const response = await fetch('/admin/plugins', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return response.json();
};

// Uso
const formData = new FormData();
formData.append('title', 'Mi Plugin');
formData.append('description', 'Descripción');
formData.append('version', '1.0.0');
formData.append('price', '9.99');
formData.append('coverImage', fileInput.files[0]);
formData.append('pluginFile', fileInput.files[1]);

const plugin = await createPlugin(formData);
console.log('Plugin creado:', plugin.id);
```
