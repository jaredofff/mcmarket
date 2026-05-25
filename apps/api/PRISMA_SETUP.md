# 🗄️ Configuración de Prisma + Supabase en apps/api

## ✅ Configuración Completada

- ✅ Schema Prisma actualizado con modelos Stripe
- ✅ `prisma.config.ts` configurado para connection pooling
- ✅ `.env.local` creado con placeholders
- ✅ `.gitignore` protege credenciales

## 🔧 Próximos Pasos

### 1️⃣ Obtener Credenciales de Supabase

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. Selecciona tu proyecto: **cvfwetlubadccxiwhxpx**
3. Navega a: **Settings** (⚙️) → **Database**
4. En "Connection String", verás la URL con tu contraseña:
   ```
   postgresql://postgres.cvfwetlubadccxiwhxpx:YOUR_PASSWORD@aws-1-us-east-2.pooler.supabase.com:5432/postgres
   ```
5. Copia la contraseña (entre `:` y `@`)

### 2️⃣ Actualizar `.env.local`

Edita `apps/api/.env.local` y reemplaza:
- `[REEMPLAZA-AQUI]` en las URLs con tu contraseña Supabase
- Tus claves Stripe (sk_test_*, pk_test_*, whsec_test_*)

```env
# Ejemplo (NO copies esto directamente):
DATABASE_URL="postgresql://postgres.cvfwetlubadccxiwhxpx:abc123XYZ@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.cvfwetlubadccxiwhxpx:abc123XYZ@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
```

### 3️⃣ Ejecutar Migración

```bash
cd apps/api
npx prisma migrate dev --name add_stripe_integration
```

Esto:
- Conecta a Supabase
- Crea las tablas para StripeCheckoutSession y StripeEvent
- Agrega campos a User y Purchase

### 4️⃣ Verificar Conexión

```bash
npx prisma studio
```

Se abrirá un UI web donde ver todas las tablas.

## 📊 Modelos Nuevos en Schema

### StripeCheckoutSession
Guarda sesiones de checkout de Stripe para auditoría:
- `sessionId`: ID único de Stripe
- `userId`: Usuario que inició pago
- `status`: open, complete, expired
- `amountTotal`: Monto en centavos
- `expiresAt`: Cuándo expira

### StripeEvent
Logging completo de webhooks Stripe:
- `eventId`: ID único de Stripe
- `type`: checkout.session.completed, payment_intent.succeeded, etc.
- `data`: JSON completo del evento (para auditoría)
- `processed`: Si ya se procesó
- `error`: Si hubo error

### Actualizaciones a Modelos Existentes
- **User**: Agregado `stripeCustomerId` (para vincular con Stripe)
- **Purchase**: Agregado `stripePaymentIntentId` (vincular con intento de pago)

## 🔒 Seguridad

- ✅ `.env.local` está en `.gitignore` (nunca se commitea)
- ✅ `.env` tiene valores genéricos (ok commitear)
- ✅ Contraseñas SOLO en `.env.local` o variables de sistema
- ✅ NestJS debe cargar `.env.local` en desarrollo

## 🚀 Próximas Tareas

1. **Crear servicio Stripe en NestJS**
   ```typescript
   // src/stripe/stripe.service.ts
   ```

2. **Implementar webhook handler**
   ```typescript
   // src/stripe/stripe.webhook.controller.ts
   ```

3. **API Routes para checkout**
   ```typescript
   // src/purchases/purchase.controller.ts
   ```

4. **Testear flujo completo**
   - Crear checkout session
   - Recibir webhooks con `stripe listen`
   - Marcar pago como completado

## 📚 Recursos

- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/pooling)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [stripe-cli documentation](https://stripe.com/docs/stripe-cli)

---

**Status**: ⏳ Pendiente completar `.env.local` con credenciales reales

