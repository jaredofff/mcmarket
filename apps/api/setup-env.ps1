#!/usr/bin/env powershell
# setup-env.ps1 - Script para configurar .env.local con credenciales

Write-Host "🔧 Configurador de Prisma + Supabase para apps/api" -ForegroundColor Cyan
Write-Host ""

$envLocalPath = ".env.local"

if (-not (Test-Path $envLocalPath)) {
    Write-Host "❌ No se encuentra .env.local en $(Get-Location)" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Ingresa tus credenciales de Supabase:" -ForegroundColor Yellow
Write-Host ""

$password = Read-Host "Contraseña PostgreSQL (encontrada en Supabase Dashboard > Settings > Database)"
$stripeSecret = Read-Host "Stripe Secret Key (sk_test_...)"
$stripePublic = Read-Host "Stripe Publishable Key (pk_test_...)"
$stripeWebhook = Read-Host "Stripe Webhook Secret (whsec_...)"

if ([string]::IsNullOrWhiteSpace($password)) {
    Write-Host "❌ Error: Contraseña requerida" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✨ Actualizando .env.local..." -ForegroundColor Green

$content = @"
# ⚠️ ESTE ARCHIVO TIENE CREDENCIALES SENSIBLES - NUNCA COMMITEARLO
# Asegúrate de que .env.local esté en .gitignore

# Supabase PostgreSQL via Connection Pooling (para queries normales)
DATABASE_URL="postgresql://postgres.cvfwetlubadccxiwhxpx:$password@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection para migraciones (evita timeouts)
DIRECT_URL="postgresql://postgres.cvfwetlubadccxiwhxpx:$password@aws-1-us-east-2.pooler.supabase.com:5432/postgres"

# Stripe Keys
STRIPE_SECRET_KEY=$stripeSecret
STRIPE_PUBLISHABLE_KEY=$stripePublic
STRIPE_WEBHOOK_SECRET=$stripeWebhook

# API Configuration
NODE_ENV=development
API_PORT=3001
"@

Set-Content -Path $envLocalPath -Value $content -Encoding UTF8

Write-Host "✅ .env.local actualizado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Próximo paso: ejecutar migración" -ForegroundColor Cyan
Write-Host "   npx prisma migrate dev --name add_stripe_integration" -ForegroundColor White
Write-Host ""
