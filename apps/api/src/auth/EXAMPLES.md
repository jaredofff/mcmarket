# Ejemplos de Uso - RolesGuard y Plugins

Este archivo contiene ejemplos prácticos de cómo usar el RolesGuard con curl.

## 1. Generar Token de CEO

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "email": "ceo@company.com",
    "role": "CEO"
  }'
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEyMyIsImVtYWlsIjoiY2VvQGNvbXBhbnkuY29tIiwicm9sZSI6IkNFTyIsImlhdCI6MTcxNjQwNjkwMCwiZXhwIjoxNzE2NDkzMzAwfQ.xxxxx",
  "user": {
    "userId": "user-123",
    "email": "ceo@company.com",
    "role": "CEO"
  }
}
```

Guarda el `access_token` en una variable:
```bash
export CEO_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 2. Generar Token de Usuario Regular

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-456",
    "email": "user@company.com",
    "role": "USER"
  }'
```

Guarda el token:
```bash
export USER_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## 3. Acceder a Endpoint Público (SIN TOKEN)

```bash
curl -X GET http://localhost:3000/plugins
```

**Respuesta:**
```json
[]
```

## 4. CEO Importa un Plugin (ÉXITO - 201)

```bash
curl -X POST http://localhost:3000/plugins/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CEO_TOKEN" \
  -d '{
    "pluginName": "analytics-plugin",
    "pluginUrl": "http://example.com/plugins/analytics",
    "config": {
      "enabled": true,
      "trackingId": "UA-123456"
    }
  }'
```

**Respuesta (201 Created):**
```json
{
  "success": true,
  "message": "Plugin analytics-plugin imported successfully",
  "plugin": {
    "name": "analytics-plugin",
    "url": "http://example.com/plugins/analytics",
    "config": {
      "enabled": true,
      "trackingId": "UA-123456"
    },
    "importedAt": "2026-05-22T17:01:40.862Z",
    "status": "imported"
  }
}
```

## 5. Usuario Regular Intenta Importar Plugin (FORBIDDEN - 403)

```bash
curl -X POST http://localhost:3000/plugins/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "pluginName": "unauthorized-plugin",
    "pluginUrl": "http://example.com/unauthorized"
  }'
```

**Respuesta (403 Forbidden):**
```json
{
  "statusCode": 403,
  "message": "Access denied. Required roles: CEO. User role: USER"
}
```

## 6. Sin Token Intenta Importar Plugin (UNAUTHORIZED - 401)

```bash
curl -X POST http://localhost:3000/plugins/import \
  -H "Content-Type: application/json" \
  -d '{
    "pluginName": "no-token-plugin",
    "pluginUrl": "http://example.com/no-token"
  }'
```

**Respuesta (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## 7. CEO con Token Inválido (UNAUTHORIZED - 401)

```bash
curl -X POST http://localhost:3000/plugins/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer invalid-token-xyz" \
  -d '{
    "pluginName": "invalid-token-plugin",
    "pluginUrl": "http://example.com/invalid"
  }'
```

**Respuesta (401 Unauthorized):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## 8. Obtener Lista de Plugins Importados

```bash
curl -X GET http://localhost:3000/plugins
```

**Respuesta:**
```json
[
  {
    "name": "analytics-plugin",
    "url": "http://example.com/plugins/analytics",
    "config": {
      "enabled": true,
      "trackingId": "UA-123456"
    },
    "importedAt": "2026-05-22T17:01:40.862Z",
    "status": "imported"
  }
]
```

## 9. CEO Importa Otro Plugin

```bash
curl -X POST http://localhost:3000/plugins/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CEO_TOKEN" \
  -d '{
    "pluginName": "seo-plugin",
    "pluginUrl": "http://example.com/plugins/seo"
  }'
```

## 10. Generar Token de ADMIN

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-789",
    "email": "admin@company.com",
    "role": "ADMIN"
  }'
```

Si el endpoint fue configurado para `@Roles('CEO', 'ADMIN')`, el ADMIN también podría acceder.

## Script de Testing Completo (bash)

```bash
#!/bin/bash

API_URL="http://localhost:3000"

echo "=== Generando tokens ==="

# Generar token CEO
CEO_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "email": "ceo@company.com",
    "role": "CEO"
  }')

CEO_TOKEN=$(echo $CEO_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
echo "CEO Token: $CEO_TOKEN"

# Generar token USER
USER_RESPONSE=$(curl -s -X POST $API_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-456",
    "email": "user@company.com",
    "role": "USER"
  }')

USER_TOKEN=$(echo $USER_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
echo "USER Token: $USER_TOKEN"

echo -e "\n=== Probando endpoints ==="

# CEO puede importar
echo -e "\n1. CEO importa plugin:"
curl -s -X POST $API_URL/plugins/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CEO_TOKEN" \
  -d '{
    "pluginName": "test-plugin",
    "pluginUrl": "http://example.com/test"
  }' | jq

# USER no puede importar
echo -e "\n2. USER intenta importar (debe fallar):"
curl -s -X POST $API_URL/plugins/import \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "pluginName": "unauthorized",
    "pluginUrl": "http://example.com/unauthorized"
  }' | jq

# Obtener lista
echo -e "\n3. Obtener lista de plugins:"
curl -s -X GET $API_URL/plugins | jq

echo -e "\n=== Tests completados ==="
```

## PowerShell Script (para Windows)

```powershell
$ApiUrl = "http://localhost:3000"

Write-Host "=== Generando tokens ===" -ForegroundColor Green

# CEO Token
$ceoResponse = Invoke-RestMethod -Uri "$ApiUrl/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body (@{
    userId = "user-123"
    email = "ceo@company.com"
    role = "CEO"
  } | ConvertTo-Json)

$ceoToken = $ceoResponse.access_token
Write-Host "CEO Token: $ceoToken"

# USER Token
$userResponse = Invoke-RestMethod -Uri "$ApiUrl/auth/login" `
  -Method Post `
  -ContentType "application/json" `
  -Body (@{
    userId = "user-456"
    email = "user@company.com"
    role = "USER"
  } | ConvertTo-Json)

$userToken = $userResponse.access_token
Write-Host "USER Token: $userToken"

Write-Host "`n=== Probando endpoints ===" -ForegroundColor Green

# CEO puede importar
Write-Host "`n1. CEO importa plugin:" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$ApiUrl/plugins/import" `
  -Method Post `
  -ContentType "application/json" `
  -Headers @{ Authorization = "Bearer $ceoToken" } `
  -Body (@{
    pluginName = "test-plugin"
    pluginUrl = "http://example.com/test"
  } | ConvertTo-Json) | ConvertTo-Json

# USER no puede importar
Write-Host "`n2. USER intenta importar (debe fallar):" -ForegroundColor Cyan
try {
  Invoke-RestMethod -Uri "$ApiUrl/plugins/import" `
    -Method Post `
    -ContentType "application/json" `
    -Headers @{ Authorization = "Bearer $userToken" } `
    -Body (@{
      pluginName = "unauthorized"
      pluginUrl = "http://example.com/unauthorized"
    } | ConvertTo-Json)
} catch {
  Write-Host $_.Exception.Response.StatusCode
  Write-Host $_.Exception.Message
}

# Obtener lista
Write-Host "`n3. Obtener lista de plugins:" -ForegroundColor Cyan
Invoke-RestMethod -Uri "$ApiUrl/plugins" -Method Get | ConvertTo-Json
```

## Notas Importantes

1. **Puerto**: Asegúrate de que la API corre en puerto 3000 o ajusta `$ApiUrl`
2. **JWT_SECRET**: El servidor debe tener configurado JWT_SECRET en variables de entorno
3. **Formato Token**: El token debe estar en el header: `Authorization: Bearer <TOKEN>`
4. **Expiración**: Los tokens expiran después de 24 horas (configurado en auth.module.ts)
5. **Roles**: Puedes cambiar el rol a CEO, ADMIN, USER, etc. según necesites
