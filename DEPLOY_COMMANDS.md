# 🚀 COMANDOS RÁPIDOS - MCMarket Deployment

## Situación Actual
- ✅ Código en GitHub: https://github.com/jaredofff/mcmarket
- ✅ Rama: main
- ✅ Vercel CLI: Instalado (v54.4.1)
- ⏳ Siguiente: Desplegar en Vercel

---

## OPCIÓN 1: Despliegue Manual (Recomendado para primera vez)

```powershell
cd 'C:\Program Files\mcmarket'
vercel deploy --prod
```

Luego sigue las indicaciones en pantalla:
1. Abre el enlace de autenticación
2. Autoriza el acceso
3. Confirma la configuración
4. ¡Listo! Tu app está desplegada

---

## OPCIÓN 2: Usar Script Automatizado

```powershell
cd 'C:\Program Files\mcmarket'
.\deploy-vercel.ps1 -Prod
```

El script hace automáticamente:
- ✓ Verifica estado de Git
- ✓ Valida Vercel CLI
- ✓ Ejecuta despliegue
- ✓ Muestra resumen final

---

## OPCIÓN 3: Despliegue Preview (No Producción)

```powershell
cd 'C:\Program Files\mcmarket'
vercel deploy
```

Esto crea una URL temporal para probar antes de ir a producción

---

## Después del Despliegue

### Ver tu aplicación
```powershell
vercel dashboard
# O en navegador: https://vercel.com/dashboard
```

### Ver URL desplegada
```powershell
vercel list
```

### Ver logs
```powershell
vercel logs --prod
```

### Revertir a versión anterior
```powershell
vercel rollback
```

---

## Configuración Post-Despliegue

### Agregar Variables de Entorno
```powershell
# En Dashboard: Settings → Environment Variables
# O por CLI:
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_STRIPE_KEY
```

### Conectar Dominio
```powershell
# En Dashboard: Settings → Domains
# Ejemplo: mcmarket.com
```

### Desbloquear Auto-Deploy
```powershell
# En Dashboard: Settings → Git
# Habilitar: "Automatic Deployments on push"
```

---

## Troubleshooting Rápido

### Error: "Build failed"
```powershell
# Verifica TypeScript localmente
cd apps/web
npm run build
npm run type-check
```

### Error: "Authentication failed"
```powershell
# Vuelve a loguearse
vercel logout
vercel login
vercel deploy --prod
```

### Error: "Module not found"
```powershell
# Asegúrate que dependencies están comiteadas
git status | grep -E "package|lock"
git add . && git commit -m "deps"
git push && vercel deploy --prod
```

---

## Información del Monorepo

| Componente | Ubicación | Deploy | Hosting |
|-----------|-----------|--------|---------|
| Frontend | `apps/web` | ✅ Vercel | Vercel |
| Backend | `apps/api` | ❌ Manual | Railway/Render/Fly |
| Monorepo | `.` | - | N/A |

**Nota:** El backend debe desplegarse por separado

---

## URLs Importantes

| Recurso | URL |
|---------|-----|
| GitHub | https://github.com/jaredofff/mcmarket |
| Vercel Dashboard | https://vercel.com/dashboard |
| Docs Vercel | https://vercel.com/docs |
| Docs NextJS | https://nextjs.org/docs |

---

## Next Steps después de Vercel

1. ✅ Desplegar frontend en Vercel
2. ⏳ Desplegar backend (Railway, Render, etc.)
3. ⏳ Configurar variables de entorno
4. ⏳ Conectar dominio personalizado
5. ⏳ Configurar CI/CD automático

---

**¿Preguntas?** Revisa VERCEL_DEPLOYMENT_GUIDE.md para más detalles
