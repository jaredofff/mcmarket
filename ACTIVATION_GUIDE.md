# Guía de Activación - Sistema de Importación

## Estado Actual

✅ **Código:** Corregido y listo
⏳ **Bloqueadores:** Permisos de Prisma en Program Files

---

## Pasos de Activación

### Paso 1: Resolver Permisos (CRÍTICO)
```powershell
# Opción A: Ejecutar PowerShell como Administrador
# 1. Click derecho en PowerShell → "Run as Administrator"
# 2. Aceptar UAC prompt

# Opción B: Mover proyecto a carpeta sin protección
# 1. Copiar entire folder a: C:\Users\Jared\Desktop\mcmarket
# 2. Actualizar todas las referencias de path
# 3. Continuar desde allí
```

**Recomendación:** Opción A (más rápido)

---

### Paso 2: Generar Prisma Client (DEPENDE DE PASO 1)
```powershell
cd 'C:\Program Files\mcmarket'

# Ejecutar como Admin
pnpm --filter api exec prisma generate

# Esperado:
# ✓ Prisma schema loaded from prisma/schema.prisma
# ✓ Generated Prisma Client (X.X.X) to ./node_modules/@prisma/client
```

**Si falla con EPERM:** 
```powershell
# Alternativa: Forzar permisos
takeown /F "C:\Program Files\mcmarket" /R /D Y
icacls "C:\Program Files\mcmarket" /grant:r "%USERNAME%:(F)" /T
```

---

### Paso 3: Ejecutar Migración de Base de Datos
```powershell
# Desde mismo directorio con PowerShell Admin
pnpm --filter api exec prisma migrate dev --name add_import_system

# Esperado:
# ✓ Created migration: migrations/[timestamp]_add_import_system/migration.sql
# ✓ Your database is now in sync with your Prisma schema.
```

**Si la DB está vacía**, Prisma creará el schema completo.

---

### Paso 4: Build del API
```powershell
# Build solamente el API
pnpm --filter api build

# O build completo si lo prefieres
pnpm build

# Esperado:
# ✓ Successfully compiled X files with tsc
```

---

### Paso 5: Verificación de Tipos
```powershell
# Verificar que no hay errores de TypeScript
pnpm --filter api exec tsc --noEmit --skipLibCheck

# Esperado: Ningún output (significa OK)
# Si hay errores, se mostrarán como "error TS####"
```

---

### Paso 6: Lint Final
```powershell
# Verificar que cumple con eslint
pnpm --filter api exec eslint src/**/*.ts --max-warnings 0

# Esperado: Ningún output (sin errores ni warnings)
```

---

### Paso 7: Start del Servidor
```powershell
# Opción 1: Development mode
pnpm --filter api dev

# Opción 2: Production build + start
pnpm --filter api build && pnpm --filter api start

# Esperado:
# [Nest] X Date PM - 01/01 16:37:11 [NestFactory] Starting Nest application...
# [Nest] X Date PM - 01/01 16:37:12 [InstanceLoader] AppModule dependencies initialized
# [Nest] X Date PM - 01/01 16:37:12 [ImportQueueService] Import Queue inicializado
# Listening on port 3001
```

---

## Testing Manual

### Test 1: Verificar que la API está activa
```bash
curl http://localhost:3001/plugins/marketplace/stats

# Esperado:
{
  "totalPlugins": 0,
  "totalVipPlugins": 0,
  "totalDownloads": 0,
  "averageRating": 0,
  "recentImports": { ... }
}
```

### Test 2: Crear un Import Job
```bash
curl -X POST http://localhost:3001/plugins/import-url \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "url": "https://builtbybit.com/resources/example-plugin/",
    "customTitle": "Mi Plugin"
  }'

# Esperado:
{
  "jobId": "uuid-aqui",
  "plugin": null
}
```

### Test 3: Verificar estado del Job
```bash
curl http://localhost:3001/plugins/import-status/<jobId>

# Esperado (mientras procesa):
{
  "id": "jobId",
  "status": "IN_PROGRESS",
  "progress": 45,
  "sourceUrl": "...",
  "createdAt": "2024-01-01T...",
  "startedAt": "2024-01-01T..."
}

# Esperado (cuando termina):
{
  "id": "jobId",
  "status": "COMPLETED",
  "progress": 100,
  "pluginId": "plugin-uuid",
  "completedAt": "2024-01-01T..."
}
```

---

## Troubleshooting

### Error: "EPERM: operation not permitted"
```
Causa: Permisos insuficientes en C:\Program Files\mcmarket
Solución: Ejecutar PowerShell como Administrador
```

### Error: "Cannot find module @prisma/client"
```
Causa: Paso 2 no completado (prisma generate)
Solución: Re-ejecutar: pnpm --filter api exec prisma generate
```

### Error: "Database connection failed"
```
Causa: Cadena de conexión en .env inválida o servidor DB inactivo
Solución: 
  1. Verificar .env: DATABASE_URL está configurada
  2. Verificar que PostgreSQL está corriendo
  3. Probar conexión: psql -c "SELECT 1"
```

### Error: "Redis connection refused"
```
Causa: Redis no está disponible (normal)
Solución: System usará fallback inline automáticamente
  - No bloquea el sistema
  - Las importaciones se procesarán secuencialmente
  - Considere instalar Redis para mejor performance
```

### Error: "Port 3001 already in use"
```
Causa: API ya corre en ese puerto o aplicación anterior no terminó
Solución:
  pnpm --filter api exec lsof -i :3001  # Ver qué usa el puerto
  kill -9 <PID>                         # Terminar proceso
  # O cambiar puerto: PORT=3002 pnpm --filter api dev
```

---

## Monitoreo Post-Activación

### Logs que debería ver al iniciar:

```
[NestFactory] Starting Nest application...
[InstanceLoader] PrismaModule dependencies initialized
[InstanceLoader] PluginsModule dependencies initialized
[InstanceLoader] AppModule dependencies initialized
[ImportQueueService] Import Queue inicializado
[NestApplication] Nest application successfully started
```

### Endpoints disponibles tras activación:

```
PUBLIC ENDPOINTS:
  GET  /plugins/marketplace/stats
  GET  /plugins/search?search=...&limit=20
  GET  /plugins/:slug

PROTECTED ENDPOINTS (requieren JWT):
  POST /plugins/import-url (CEO/ADMIN/DEVELOPER)
  POST /plugins/bulk-import (CEO/ADMIN)
  GET  /plugins/import-status/:jobId
  PUT  /plugins/:id (CEO/ADMIN/DEVELOPER)
  POST /plugins/:id/resync (CEO/ADMIN)
  DELETE /plugins/:id (CEO/ADMIN)
```

---

## Rollback (si algo sale mal)

```powershell
# Revertir migración
pnpm --filter api exec prisma migrate resolve --rolled-back add_import_system

# O revertir todo a estado anterior
git reset --hard HEAD~1
```

---

## Checklist Final Antes de Activar

- [ ] Ejecuté PowerShell como Administrador
- [ ] Corregí los permisos de Program Files (EPERM resolved)
- [ ] Ejecuté `prisma generate` exitosamente
- [ ] Ejecuté `prisma migrate dev` exitosamente  
- [ ] Build API completó sin errores
- [ ] No hay warnings en eslint
- [ ] TypeScript compila correctamente
- [ ] API inicia en puerto 3001
- [ ] Endpoint /plugins/marketplace/stats responde

---

## Documentación Relacionada

- **ERROR_ANALYSIS.md** - Análisis detallado de errores encontrados
- **CHANGES_SUMMARY.md** - Resumen de cambios realizados
- **IMPLEMENTATION_GUIDE.md** - Guía de implementación original
- **ENV_SETUP.md** - Configuración de variables de entorno

---

## Estimado de Tiempo

| Paso | Tiempo |
|------|--------|
| 1. Resolver permisos | 2-5 min |
| 2. Prisma generate | 1-2 min |
| 3. Prisma migrate | 2-3 min |
| 4. Build API | 3-5 min |
| 5. Verificación | 2-3 min |
| 6. Start servidor | 1-2 min |
| **TOTAL** | **11-20 min** |

---

**Estado:** ✅ LISTO PARA ACTIVACIÓN

Cuando estés listo, inicia con Paso 1 (abre PowerShell como Admin).
