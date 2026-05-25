#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Script automatizado para desplegar MCMarket en Vercel
    
.DESCRIPTION
    Ejecuta los pasos necesarios para desplegar la aplicación Next.js en Vercel
    Debe ejecutarse desde el directorio raíz del proyecto
    
.EXAMPLE
    .\deploy-vercel.ps1
#>

param(
    [Switch]$Prod = $false
)

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          🚀 MCMarket Vercel Deployment Script            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "pnpm-workspace.yaml")) {
    Write-Host "❌ Error: Este script debe ejecutarse desde la raíz del proyecto" -ForegroundColor Red
    Write-Host "   Ubicación actual: $(Get-Location)" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📦 Verificaciones iniciales..." -ForegroundColor Yellow

# Verificar Git status
Write-Host ""
Write-Host "1️⃣  Verificando estado de Git..."
$gitStatus = git status --short
if ($gitStatus) {
    Write-Host "   ⚠️  Hay cambios no comiteados. Considera hacer commit primero:" -ForegroundColor Yellow
    Write-Host "   git add . && git commit -m 'your message'" -ForegroundColor Gray
} else {
    Write-Host "   ✅ Directorio limpio" -ForegroundColor Green
}

# Verificar rama
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host ""
Write-Host "2️⃣  Rama actual: $currentBranch" -ForegroundColor Yellow
if ($currentBranch -ne "main") {
    Write-Host "   ⚠️  Se recomienda desplegar desde 'main'" -ForegroundColor Yellow
}

# Verificar Vercel CLI
Write-Host ""
Write-Host "3️⃣  Verificando Vercel CLI..."
$vercelVersion = vercel --version 2>&1
if ($vercelVersion -like "*command not found*" -or $vercelVersion -like "*no se reconoce*") {
    Write-Host "   ❌ Vercel CLI no encontrado. Instalando..." -ForegroundColor Red
    npm install -g vercel@latest
} else {
    Write-Host "   ✅ Vercel CLI: $vercelVersion" -ForegroundColor Green
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan

# Parámetro de despliegue
$deployFlag = if ($Prod) { "--prod" } else { "--preview" }
$deployMode = if ($Prod) { "PRODUCCIÓN" } else { "PREVIEW" }

Write-Host ""
Write-Host "🚀 Iniciando despliegue en $deployMode..." -ForegroundColor Green
Write-Host ""
Write-Host "Ejecutando: vercel deploy $deployFlag" -ForegroundColor Gray
Write-Host ""

# Ejecutar Vercel deploy
vercel deploy $deployFlag

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║  ✅ ¡DESPLIEGUE COMPLETADO EXITOSAMENTE!                 ║" -ForegroundColor Green
    Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Próximos pasos:" -ForegroundColor Yellow
    Write-Host "   1. Ve a https://vercel.com/dashboard para ver tu proyecto" -ForegroundColor Gray
    Write-Host "   2. Configura variables de entorno si es necesario" -ForegroundColor Gray
    Write-Host "   3. Conecta un dominio personalizado (opcional)" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ El despliegue encontró un error. Revisa el log arriba." -ForegroundColor Red
    exit 1
}

Write-Host ""
