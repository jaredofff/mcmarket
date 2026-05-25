# ✅ Configuración Prisma + Stripe + Supabase - COMPLETADA

## 📦 Lo Que Se Hizo

### 1. ✅ Actualización del Schema Prisma (`prisma/schema.prisma`)

#### Cambios en Modelos Existentes:
- **User**: Agregado campo `stripeCustomerId` para vincular con Stripe Customer
- **Purchase**: Agregado campo `stripePaymentIntentId` para auditoría de pagos

#### Nuevos Modelos:
```prisma
StripeCheckoutSession {
  - id, sessionId (único)
  - userId, user (relación)
  - status: open | complete | expired
  - amountTotal (en centavos)
  - currency, customerEmail
  - expiresAt, createdAt, updatedAt
  - Índices en userId y sessionId para queries rápidas
}

StripeEvent {
  - id, eventId (único)
  - type: "checkout.session.completed" | "payment_intent.succeeded", etc.
  - data: JSON completo del evento (auditoría)
  - processed: boolean para re-procesamiento
  - error: para logging de fallos
  - createdAt
  - Índices en type, processed, createdAt
}
```

### 2. ✅ Actualización de Configuración

#### `.env` - Valores por defecto (ok commitear):
```
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
NODE_ENV=development
API_PORT=3001
```

#### `.env.local` - Credenciales reales (NUNCA commitear):
- Creado con placeholders [REEMPLAZA-AQUI]
- Protegido en `.gitignore`
- Usuario debe completar con sus credenciales

#### `prisma.config.ts` - Soporte Prisma 7.x:
- Migrado URLs de `schema.prisma` a `prisma.config.ts`
- Agregado `directUrl` para migraciones sin timeouts
- Connection pooling configurado (port 6543 normal, 5432 migraciones)

### 3. ✅ Seguridad

- ✅ `.env.local` en `.gitignore` (con `.env*.local`)
- ✅ Credenciales NUNCA en código
- ✅ Separación: `.env` (genérico) vs `.env.local` (secretos)
- ✅ Connection pooling reduce carga de BD

### 4. ✅ Documentación

Archivos creados:
- **`PRISMA_SETUP.md`**: Guía paso a paso para completar setup
- **`setup-env.ps1`**: Script PowerShell para configurar credenciales interactivamente

## 🚀 Próximos Pasos del Usuario

### Paso 1: Obtener Credenciales
```
1. Ir a https://app.supabase.com
2. Seleccionar proyecto: cvfwetlubadccxiwhxpx
3. Settings → Database
4. Copiar contraseña de Connection String
```

### Paso 2: Ejecutar Setup Script (Recomendado)
```powershell
cd apps/api
.\setup-env.ps1
# Proporciona: contraseña, claves Stripe
```

O manualmente editar `apps/api/.env.local` con credenciales reales.

### Paso 3: Ejecutar Migración
```bash
cd apps/api
npx prisma migrate dev --name add_stripe_integration
```

### Paso 4: Verificar Conexión
```bash
npx prisma studio  # Abre UI web en http://localhost:5555
```

## 📊 Estructura de Datos

```
Usuario
├── id (UUID)
├── discordId
├── email
├── stripeCustomerId ← Nuevo
└── checkoutSessions → StripeCheckoutSession[]

Plugin
├── id
├── title
├── price (centavos)
└── creator → User

Purchase
├── id
├── amount
├── status: PENDING | COMPLETED | REFUNDED
├── stripePaymentIntentId ← Nuevo
└── Relaciones: user, plugin

StripeCheckoutSession ← Nuevo
├── sessionId (desde Stripe)
├── userId
├── status: open | complete | expired
├── amountTotal
└── expiresAt

StripeEvent ← Nuevo
├── eventId (desde Stripe)
├── type: checkout.session.completed, etc.
├── data: JSON completo
├── processed: boolean
└── error: logging
```

## 🔗 Flujo de Pago (Overview)

```
1. Usuario hace clic en "Comprar Plugin"
   ↓
2. Web (Next.js) → API (NestJS): POST /checkout
   {
     pluginId: "...",
     userId: "..."
   }
   ↓
3. API: Crea Stripe Checkout Session
   - Guarda en StripeCheckoutSession tabla
   - Retorna sessionId
   ↓
4. Web: Redirige a Stripe Checkout
   stripe.redirectToCheckout({ sessionId })
   ↓
5. Usuario completa pago en Stripe
   ↓
6. Stripe envía webhook: checkout.session.completed
   Webhook handler (apps/api) recibe:
   - POST /webhooks/stripe
   - Valida signature
   - Crea StripeEvent (auditoría)
   - Actualiza Purchase.status = COMPLETED
   - Marca Purchase.stripePaymentIntentId
   ↓
7. Email/confirmación al usuario
```

## 🛠️ Comandos Útiles

```bash
# Generar Prisma Client actualizado
npx prisma generate

# Ver schema en UI interactiva
npx prisma studio

# Ver cambios pendientes
npx prisma migrate status

# Reset BD (⚠️ CUIDADO - borra todo)
npx prisma migrate reset

# Validar schema
npx prisma validate

# Formatear schema
npx prisma format
```

## 🔐 Variables de Entorno Requeridas

### Base (ya en `.env`)
- `DATABASE_URL`: Connection pooling (Supabase)
- `DIRECT_URL`: Direct connection (Supabase)

### Stripe (en `.env.local`)
- `STRIPE_SECRET_KEY`: sk_test_...
- `STRIPE_PUBLISHABLE_KEY`: pk_test_...
- `STRIPE_WEBHOOK_SECRET`: whsec_test_...

### API (en `.env`)
- `NODE_ENV`: development | production
- `API_PORT`: 3001
- `API_URL`: http://localhost:3001

## 📚 Recursos

- [Prisma + Supabase](https://supabase.com/docs/guides/auth-choose-provider/oauth/supabase)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Connection Pooling](https://supabase.com/docs/guides/database/pooling)

---

**Status**: ✅ Configuración completada, pendiente: credenciales reales del usuario

**Versión**: 1.0.0  
**Fecha**: Mayo 2026  
**Próxima revisión**: Cuando se complete setup en producción

