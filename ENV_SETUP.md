# MC Market - Guía de Configuración

## Archivo `.env` para `apps/api`

```env
# =======================
# Database
# =======================
DATABASE_URL="postgresql://user:password@localhost:5432/mcmarket"

# =======================
# API & URLs
# =======================
API_URL=http://localhost:3001
WEB_URL=http://localhost:3000
NODE_ENV=development

# =======================
# JWT Auth
# =======================
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d

# =======================
# Scraping Configuration
# =======================
# Timeout en milisegundos para descargar HTML
SCRAPER_TIMEOUT=30000

# Número de reintentos si falla el scrape
SCRAPER_RETRIES=3

# Delay entre reintentos en ms
SCRAPER_RETRY_DELAY=2000

# User-Agent para requests HTTP
SCRAPER_USER_AGENT="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

# =======================
# File Storage
# =======================
# Máximo tamaño de archivo de plugin (en bytes)
# 500MB = 524288000
MAX_FILE_SIZE=524288000

# Máximo tamaño de imagen (en bytes)
# 50MB = 52428800
MAX_IMAGE_SIZE=52428800

# Directorio de almacenamiento (relativo o absoluto)
STORAGE_DIR=public

# =======================
# Queue Configuration (BullMQ)
# =======================
# Usar cola asincrónica (true) o procesamiento inline (false)
USE_QUEUE=true

# Host de Redis
REDIS_HOST=localhost

# Puerto de Redis
REDIS_PORT=6379

# Password de Redis (si aplica)
# REDIS_PASSWORD=

# Número de jobs de importación en paralelo
IMPORT_CONCURRENCY=3

# Timeout para jobs en ms (2 horas)
IMPORT_JOB_TIMEOUT=7200000

# =======================
# Rate Limiting
# =======================
# Máximo número de imports por ventana
IMPORT_RATE_LIMIT=10

# Ventana de tiempo en segundos (1 hora = 3600)
IMPORT_RATE_WINDOW=3600

# Máximo de bulk imports en una sola petición
BULK_IMPORT_LIMIT=50

# =======================
# Cleanup & Maintenance
# =======================
# Eliminar jobs completados después de X horas
JOB_CLEANUP_HOURS=168  # 7 días

# Eliminar archivos no usados después de X días
FILE_CLEANUP_DAYS=90

# =======================
# Logging
# =======================
LOG_LEVEL=debug
LOG_FILE=logs/app.log

# =======================
# Security
# =======================
# CORS origins permitidos
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Habilitar HTTPS en producción
# ENABLE_HTTPS=true

# =======================
# Email (para notificaciones, opcional)
# =======================
# SMTP_HOST=
# SMTP_PORT=587
# SMTP_USER=
# SMTP_PASSWORD=
# EMAIL_FROM=noreply@mcmarket.com

# =======================
# External Services (opcional)
# =======================
# Discord webhook para notificaciones
# DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...

# Stripe (para sistema VIP)
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Configuración de Redis (para Queue)

### Instalar Redis localmente

**Windows:**
```bash
# Usando WSL o Docker
docker run -d -p 6379:6379 redis:7-alpine

# O descargar desde https://github.com/microsoftarchive/redis/releases
```

**macOS:**
```bash
brew install redis
brew services start redis
```

**Linux:**
```bash
sudo apt-get install redis-server
sudo systemctl start redis-server
```

### Verificar conexión

```bash
redis-cli ping
# Response: PONG
```

---

## Configuración de PostgreSQL

### Crear base de datos

```bash
createdb mcmarket

# O usando psql:
psql -U postgres
CREATE DATABASE mcmarket;
\c mcmarket
```

### Ejecutar migraciones

```bash
cd apps/api
npx prisma migrate dev --name initial
```

---

## Estructura de directorios

```
apps/api/
├── public/
│   ├── snapshots/          # Imágenes scraped de BuiltByBit
│   │   ├── 1716456789-abc123.jpg
│   │   ├── 1716456790-def456.png
│   │   └── ...
│   └── plugins/            # Archivos .jar/.zip descargados
│       ├── sha256hash1.jar
│       ├── sha256hash2.zip
│       └── ...
├── logs/
│   └── app.log
└── uploads/
    └── temp/               # Archivos temporales
```

---

## Variables de entorno sensibles

⚠️ **NUNCA commiteados a git**

- `JWT_SECRET` - Clave para firmar tokens JWT
- `DATABASE_URL` - Credenciales de base de datos
- `REDIS_PASSWORD` - Password de Redis (si aplica)
- `STRIPE_SECRET_KEY` - Key secreto de Stripe
- `DISCORD_WEBHOOK_URL` - Webhook privado de Discord

### Usar `.env.local` o `.env.production.local`

```bash
# .gitignore
.env.local
.env.*.local
```

---

## Testing de Configuración

### 1. Verificar conexión a PostgreSQL

```bash
npx prisma db push
npx prisma studio  # Abre interfaz gráfica
```

### 2. Verificar conexión a Redis (opcional)

```bash
npm run dev  # Debería iniciar sin errores
# En logs: "Import Queue inicializado"
```

### 3. Probar scraping

```bash
curl -X POST http://localhost:3001/plugins/import-url \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://builtbybit.com/resources/123456/"
  }'
```

### 4. Monitorear job

```bash
curl http://localhost:3001/plugins/import-status/job-uuid
```

---

## Performance & Optimization

### Recomendaciones para producción

1. **Caché Redis**
   ```env
   USE_CACHE=true
   CACHE_TTL=3600  # 1 hora
   ```

2. **CDN para imágenes**
   ```env
   CDN_URL=https://cdn.example.com
   USE_CDN=true
   ```

3. **Compression**
   ```bash
   npm install compression
   ```

4. **Rate limiting global**
   ```bash
   npm install @nestjs/throttler
   ```

5. **Monitoreo**
   ```bash
   npm install @nestjs/winston winston
   npm install datadog-browser-rum  # O similar
   ```

---

## Troubleshooting

### Error: "ECONNREFUSED 127.0.0.1:5432"
→ PostgreSQL no está corriendo
```bash
sudo service postgresql start  # Linux
brew services start postgresql  # macOS
```

### Error: "ECONNREFUSED 127.0.0.1:6379"
→ Redis no está corriendo (pero es opcional)
- El sistema hará fallback a procesamiento inline
- Verificar logs: debería ver advertencia en lugar de error

### Error: "Failed to scrape BuiltByBit"
→ Posibles causas:
1. URL incorrecta o recurso no existe
2. BuiltByBit está bloqueando requests
3. Timeout muy corto (aumentar `SCRAPER_TIMEOUT`)

### Error: "File too large"
→ Aumentar `MAX_FILE_SIZE` en `.env`

---

## Scripts útiles

```json
{
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start:prod": "node dist/main.js",
    "test": "jest",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "queue:stats": "redis-cli --stat",
    "cleanup": "node scripts/cleanup.js"
  }
}
```

---

## Checklist de Deployment

- [ ] `.env.production` configurado correctamente
- [ ] PostgreSQL en producción
- [ ] Redis en producción (opcional pero recomendado)
- [ ] Variables sensibles en secrets/environment variables
- [ ] SSL/HTTPS habilitado
- [ ] CORS configurado para dominio de producción
- [ ] Backups de base de datos configurados
- [ ] Logs centralizados (Sentry, DataDog, etc.)
- [ ] Monitoreo de salud del sistema
- [ ] Rate limiting activo
- [ ] Caché configurado

¡Listo para producción! 🚀
