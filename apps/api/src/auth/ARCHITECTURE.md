# RolesGuard - Arquitectura y Flujo

## Diagrama de Flujo de Autenticación y Autorización

```
┌─────────────────────────────────────────────────────────────────────┐
│                          Cliente                                     │
│  POST /plugins/import                                               │
│  Authorization: Bearer <JWT_TOKEN>                                  │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │  NestJS HTTP Request Handler       │
        └────────────┬───────────────────────┘
                     │
                     ▼
    ┌───────────────────────────────────────┐
    │  @UseGuards(JwtAuthGuard, RolesGuard) │
    │                                       │
    │  ┌─────────────────────────────────┐  │
    │  │  JwtAuthGuard                   │  │
    │  │  ─────────────────────────────  │  │
    │  │  1. Extrae token del header    │  │
    │  │  2. Verifica firma con secret  │  │
    │  │  3. Extrae payload             │  │
    │  │  4. Asigna a request.user      │  │
    │  └────────────┬────────────────────┘  │
    │               │                        │
    │  Token válido │ Token inválido/exp.   │
    │      ▼        │         ▼              │
    │     ✓         │        401 Unauthorized
    │               │                        │
    │  ┌────────────▼────────────────────┐  │
    │  │  RolesGuard                     │  │
    │  │  ─────────────────────────────  │  │
    │  │  1. Lee @Roles(['CEO'])         │  │
    │  │  2. Obtiene user.role del req   │  │
    │  │  3. Verifica si role coincide   │  │
    │  └────────────┬────────────────────┘  │
    │               │                        │
    │  Usuario=CEO  │ Usuario!=CEO           │
    │      ▼        │         ▼              │
    │     ✓         │        403 Forbidden   │
    └───────────────┼────────────────────────┘
                    │
                    ▼
        ┌──────────────────────────┐
        │  Controller (importPlugin) │
        │  Procesa la solicitud    │
        └────────────┬─────────────┘
                     │
                     ▼
        ┌──────────────────────────┐
        │  Service (importPlugin)   │
        │  Ejecuta lógica           │
        └────────────┬─────────────┘
                     │
                     ▼
        ┌──────────────────────────────┐
        │  Respuesta 201 Created       │
        │  { success: true, ... }      │
        └──────────────────────────────┘
```

## Estructura de Archivos

```
src/
├── auth/
│   ├── auth.controller.ts          ← Endpoints de autenticación
│   ├── auth.service.ts             ← Generación de tokens
│   ├── auth.module.ts              ← Módulo principal
│   ├── jwt.strategy.ts             ← Estrategia JWT
│   ├── jwt-auth.guard.ts           ← Guard de autenticación
│   ├── roles.guard.ts              ← Guard de autorización
│   ├── auth.service.spec.ts        ← Tests
│   ├── roles.guard.spec.ts         ← Tests
│   ├── ROLES_GUARD.md              ← Documentación
│   └── EXAMPLES.md                 ← Ejemplos de uso
│
├── plugins/
│   ├── plugins.controller.ts       ← Endpoints
│   ├── plugins.service.ts          ← Lógica de negocio
│   ├── plugins.module.ts           ← Módulo
│   ├── import-plugin.dto.ts        ← Data Transfer Object
│   ├── plugins.controller.spec.ts  ← Tests
│   └── plugins.service.spec.ts     ← Tests
│
├── app.module.ts                   ← Módulo principal
├── app.controller.ts               ← Controlador principal
└── main.ts                         ← Punto de entrada
```

## Flujo de Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│  AuthModule                                                     │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Providers:                                               │  │
│  │  • JwtStrategy       → Valida tokens JWT                  │  │
│  │  • JwtAuthGuard      → Guard de autenticación             │  │
│  │  • RolesGuard        → Guard de autorización              │  │
│  │  • AuthService       → Genera y verifica tokens           │  │
│  │                                                            │  │
│  │  Imports:                                                  │  │
│  │  • PassportModule    → Integración con Passport           │  │
│  │  • JwtModule         → Manejo de JWT                      │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                           ▲
                           │ Inyectado en
                           │
        ┌──────────────────────────────────┐
        │  PluginsModule                   │
        │  ┌────────────────────────────┐  │
        │  │  Controllers:              │  │
        │  │  • PluginsController       │  │
        │  │                            │  │
        │  │  Providers:                │  │
        │  │  • PluginsService          │  │
        │  │                            │  │
        │  │  Uses Guards:              │  │
        │  │  • @UseGuards(JWT, Roles)  │  │
        │  │  • @Roles('CEO')           │  │
        │  └────────────────────────────┘  │
        └──────────────────────────────────┘
```

## Matriz de Control de Acceso (ACL)

```
┌─────────────────────────────────────────────────────────────────┐
│                        ENDPOINT MATRIX                          │
├──────────────────────────────────────────────────────────────────┤
│ Endpoint             │ GET   │ POST  │ Auth │ Role Required    │
├──────────────────────────────────────────────────────────────────┤
│ /plugins             │ ✓     │ -     │ No   │ None (público)   │
│ /plugins/import      │ -     │ ✓     │ Yes  │ CEO              │
│ /auth/login          │ -     │ ✓     │ No   │ None (público)   │
├──────────────────────────────────────────────────────────────────┤
│ Códigos de Respuesta:                                           │
│ 200 OK          → Solicitud exitosa                           │
│ 201 Created     → Recurso creado exitosamente                │
│ 400 Bad Request → Datos inválidos                             │
│ 401 Unauthorized→ Token missing/inválido/expirado            │
│ 403 Forbidden   → User sin rol requerido                      │
│ 500 Server Error→ Error interno del servidor                 │
└──────────────────────────────────────────────────────────────────┘
```

## Estructura del Token JWT

```
Header (Encabezado)
┌─────────────────────────────────┐
│ {                               │
│   "alg": "HS256",               │
│   "typ": "JWT"                  │
│ }                               │
└─────────────────────────────────┘

                ▼

Payload (Datos)
┌─────────────────────────────────┐
│ {                               │
│   "sub": "user-123",            │ ← User ID
│   "email": "ceo@company.com",   │ ← Email
│   "role": "CEO",                │ ← IMPORTANTE: Rol
│   "iat": 1716406900,            │ ← Emitido en
│   "exp": 1716493300             │ ← Expira en
│ }                               │
└─────────────────────────────────┘

                ▼

Signature (Firma)
┌──────────────────────────────────────────────────────────────┐
│ HMACSHA256(                                                  │
│   base64UrlEncode(header) + "." +                           │
│   base64UrlEncode(payload),                                 │
│   secret                                                    │
│ )                                                            │
└──────────────────────────────────────────────────────────────┘
```

## Ciclo de Vida de una Solicitud Protegida

```
1. CLIENTE
   └─ POST /plugins/import
      Authorization: Bearer eyJhbGc...
      Content-Type: application/json
      {
        "pluginName": "my-plugin",
        "pluginUrl": "http://example.com"
      }

2. NESTJS ROUTING
   └─ Encuentra PluginsController.importPlugin()
   └─ Ve @UseGuards(JwtAuthGuard, RolesGuard)
   └─ Ve @Roles('CEO')

3. JWT AUTH GUARD
   ├─ Extrae: "eyJhbGc..."
   ├─ Verifica firma con JWT_SECRET
   ├─ Extrae payload:
   │  {
   │    "sub": "user-123",
   │    "email": "ceo@company.com",
   │    "role": "CEO"
   │  }
   └─ Asigna a request.user

4. ROLES GUARD
   ├─ Lee @Roles(['CEO']) del decorator
   ├─ Obtiene request.user.role = 'CEO'
   ├─ Compara: 'CEO' ∈ ['CEO']? ✓ Sí
   └─ Permite acceso

5. CONTROLLER
   ├─ Llama PluginsService.importPlugin()
   ├─ Valida datos de entrada
   └─ Procesa solicitud

6. SERVICE
   ├─ Ejecuta lógica de importación
   ├─ Almacena plugin
   └─ Retorna resultado

7. RESPONSE
   └─ HTTP 201 Created
      {
        "success": true,
        "plugin": { ... }
      }
```

## Estados de Error Posibles

```
┌────────────────────────────────────────────────────────────┐
│  POSIBLES ERRORES Y CÓDIGOS DE RESPUESTA                  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  1. SIN TOKEN                                             │
│     Request: POST /plugins/import (sin Authorization)    │
│     Response: 401 Unauthorized                           │
│     Causa: JwtAuthGuard rechaza sin token                │
│                                                            │
│  2. TOKEN INVÁLIDO                                        │
│     Request: Authorization: Bearer invalid-xxx            │
│     Response: 401 Unauthorized                           │
│     Causa: JwtAuthGuard no puede verificar firma         │
│                                                            │
│  3. TOKEN EXPIRADO                                        │
│     Request: Authorization: Bearer <expired-token>        │
│     Response: 401 Unauthorized                           │
│     Causa: exp timestamp es anterior a now()             │
│                                                            │
│  4. ROL INSUFICIENTE                                      │
│     Request: Authorization: Bearer <USER_TOKEN>           │
│            user.role = 'USER'                            │
│     Response: 403 Forbidden                              │
│     Causa: RolesGuard rechaza rol USER para CEO-only     │
│                                                            │
│  5. DATO INVÁLIDO                                         │
│     Request: { "pluginName": "", "pluginUrl": "..." }    │
│     Response: 400 Bad Request                            │
│     Causa: Validación en Service.importPlugin()          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Testing Strategy

```
┌────────────────────────────────────────────┐
│  Unit Tests                                │
├────────────────────────────────────────────┤
│  • roles.guard.spec.ts (6 tests)          │
│    - Allow CEO access                     │
│    - Deny USER access                     │
│    - Deny without role                    │
│                                            │
│  • auth.service.spec.ts (5 tests)         │
│    - Generate token                       │
│    - Verify token                         │
│    - Encode payload correctly             │
│                                            │
│  • plugins.service.spec.ts (8 tests)      │
│    - Import plugin                        │
│    - Validate input                       │
│    - Store plugin                         │
│                                            │
│  • plugins.controller.spec.ts (2 tests)   │
│    - Get plugins                          │
│    - Import plugin (guards mocked)        │
│                                            │
│  TOTAL: 21 Unit Tests                     │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  Integration Tests (Manual via curl)       │
├────────────────────────────────────────────┤
│  • CEO with valid token → 201              │
│  • USER with valid token → 403             │
│  • No token → 401                         │
│  • Invalid token → 401                    │
│  • Expired token → 401                    │
│  • Public endpoint → 200                  │
│                                            │
│  TOTAL: 6 Integration Tests               │
└────────────────────────────────────────────┘
```

## Seguridad en Capas

```
┌──────────────────────────────────────────────┐
│  Capa 1: HTTPS/TLS                          │
│  ├─ Cifrado de tránsito                     │
│  └─ Previene interceptación                 │
└──────────────────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│  Capa 2: JWT SIGNATURE                      │
│  ├─ Verifica autenticidad del token        │
│  ├─ Detecta alteración                     │
│  └─ Requiere JWT_SECRET                    │
└──────────────────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│  Capa 3: TOKEN EXPIRATION                   │
│  ├─ Limita validez del token               │
│  ├─ Fuerza renovación regular              │
│  └─ Reduce ventana de ataque               │
└──────────────────────────────────────────────┘
                       ▼
┌──────────────────────────────────────────────┐
│  Capa 4: ROLE-BASED ACCESS CONTROL          │
│  ├─ Verifica rol del usuario               │
│  ├─ Aplica restricciones de acceso         │
│  └─ Limita a CEO solo operaciones criticas │
└──────────────────────────────────────────────┘
```
