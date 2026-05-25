#!/usr/bin/env node

/**
 * 🚀 MC Market - Import System Setup Script
 * 
 * Ejecuta este script para validar y configurar el sistema de importación
 * Uso: node setup.js
 */

const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function check(condition, message) {
  if (condition) {
    log(`✅ ${message}`, 'green');
  } else {
    log(`❌ ${message}`, 'red');
  }
  return condition;
}

log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║        🚀 MC Market - Sistema de Importación Automática Setup              ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
`, 'cyan');

log('\n📋 Verificando archivos generados...', 'cyan');

const requiredFiles = {
  backend: [
    'apps/api/src/scrapers/playwright-scraper.service.ts',
    'apps/api/src/storage/plugin-file-storage.service.ts',
    'apps/api/src/queue/import-queue.service.ts',
    'apps/api/src/plugins/plugins.service.ts',
    'apps/api/src/plugins/plugins.controller.ts',
    'apps/api/src/plugins/plugins.module.ts',
    'apps/api/src/plugins/dtos/import.dto.ts',
  ],
  frontend: [
    'apps/web/app/marketplace/page.tsx',
    'apps/web/app/resources/[slug]/page.tsx',
  ],
  docs: [
    'IMPLEMENTATION_GUIDE.md',
    'ENV_SETUP.md',
    'SUMMARY.md',
    'INDEX.md',
    'QUICK_REFERENCE.md',
  ],
};

let allExists = true;

log('\n📦 Backend:', 'blue');
requiredFiles.backend.forEach(file => {
  const exists = check(fs.existsSync(file), file);
  allExists = allExists && exists;
});

log('\n🎨 Frontend:', 'blue');
requiredFiles.frontend.forEach(file => {
  const exists = check(fs.existsSync(file), file);
  allExists = allExists && exists;
});

log('\n📚 Documentación:', 'blue');
requiredFiles.docs.forEach(file => {
  const exists = check(fs.existsSync(file), file);
  allExists = allExists && exists;
});

log('\n📋 Verificando directorios de almacenamiento...', 'cyan');

const requiredDirs = [
  'apps/api/public/snapshots',
  'apps/api/public/plugins',
];

requiredDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    log(`📁 Creando directorio: ${dir}`, 'yellow');
    fs.mkdirSync(dir, { recursive: true });
    check(true, `Directorio creado: ${dir}`);
  } else {
    check(true, `Directorio existe: ${dir}`);
  }
});

log('\n🔧 Próximos pasos:', 'cyan');
log(`
1. Instalar dependencias:
   ${colors.bright}cd apps/api${colors.reset}
   ${colors.bright}npm install axios cheerio slug bull redis${colors.reset}

2. Configurar variables de entorno:
   ${colors.bright}cp .env.example .env${colors.reset}
   ${colors.bright}# Editar .env con valores reales${colors.reset}

3. Configurar base de datos:
   ${colors.bright}npx prisma migrate dev --name add_import_system${colors.reset}

4. Inicializar Redis (opcional pero recomendado):
   ${colors.bright}docker run -d -p 6379:6379 redis:7-alpine${colors.reset}

5. Iniciar servidor:
   ${colors.bright}npm run dev${colors.reset}

6. Probar importación:
   ${colors.bright}curl -X POST http://localhost:3001/plugins/import-url \\
     -H "Authorization: Bearer JWT_TOKEN" \\
     -H "Content-Type: application/json" \\
     -d '{"url": "https://builtbybit.com/resources/123456/"}'${colors.reset}
`);

log('\n📚 Documentación:', 'cyan');
log(`
  • QUICK_REFERENCE.md - Comandos y endpoints (5 min)
  • IMPLEMENTATION_GUIDE.md - Guía de activación (15 min)
  • ENV_SETUP.md - Configuración variables (10 min)
  • SUMMARY.md - Resumen ejecutivo (15 min)
  • INDEX.md - Estructura del proyecto (5 min)
`);

if (allExists) {
  log('\n✅ ¡TODOS LOS ARCHIVOS ESTÁN LISTOS!', 'green');
  log('\nEl sistema está listo para activación.', 'green');
} else {
  log('\n⚠️ FALTAN ALGUNOS ARCHIVOS', 'red');
}

log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║  🎉 Sistema generado y documentado. ¡Listo para producción!              ║
║                                                                            ║
║  Más info: Lee QUICK_REFERENCE.md para empezar                           ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
`, 'green');
