# RolesGuard - Autorización basada en Roles

## Descripción General

El `RolesGuard` es un sistema de autorización basado en roles en NestJS que protege endpoints verificando que el usuario autenticado tenga los roles requeridos. Funciona en conjunto con `JwtAuthGuard` para proteger endpoints que requieren autorización específica.

## Flujo de Autenticación y Autorización

```
1. Cliente envía solicitud con token JWT en header Authorization
   GET /plugins/import
   Authorization: Bearer eyJhbGc...

2. JwtAuthGuard intercepta la solicitud
   - Extrae el token del header
   - Verifica la firma del token con JWT_SECRET
   - Si es válido, extrae el payload y lo asigna a request.user

3. RolesGuard verifica los roles
   - Lee los roles requeridos del decorador @Roles
   - Compara con request.user.role
   - Si coincide, permite el acceso
   - Si no, retorna 403 Forbidden

4. El controlador procesa la solicitud
```

## Componentes

### 1. JwtStrategy (`jwt.strategy.ts`)

Define cómo se extrae y valida el token JWT.

```typescript
export interface JwtPayload {
  sub: string;        // User ID
  email: string;      // Email del usuario
  role: string;       // Rol del usuario (CEO, ADMIN, USER, etc.)
  iat?: number;       // Issued at
  exp?: number;       // Expiration time
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
```

### 2. JwtAuthGuard (`jwt-auth.guard.ts`)

Guard que valida la presencia y validez del token JWT.

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

### 3. RolesGuard (`roles.guard.ts`)

Guard que verifica que el usuario tenga los roles requeridos.

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true;  // Sin roles requeridos, permitir acceso
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      throw new ForbiddenException('User has no role assigned');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`
      );
    }

    return true;
  }
}
```

### 4. Roles Decorator (`@Roles`)

Decorator para especificar qué roles pueden acceder a un endpoint.

```typescript
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
```

## Uso en Controladores

### Ejemplo 1: Endpoint protegido solo para CEO

```typescript
@Controller('plugins')
export class PluginsController {
  @Post('import')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('CEO')
  async importPlugin(@Body() importData: ImportPluginDto) {
    // Solo CEO puede acceder
    return this.pluginsService.importPlugin(importData);
  }
}
```

### Ejemplo 2: Endpoint protegido para múltiples roles

```typescript
@Post('manage')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CEO', 'ADMIN')
async manageResource(@Body() data: any) {
  // CEO o ADMIN pueden acceder
  return this.service.manage(data);
}
```

### Ejemplo 3: Endpoint público (sin protección)

```typescript
@Get()
getPublicData() {
  // Sin guards, acceso público
  return this.service.getPublic();
}
```

## Generación de Tokens JWT

### Usando el AuthService

```typescript
import { AuthService } from './auth/auth.service';

@Injectable()
export class YourService {
  constructor(private authService: AuthService) {}

  generateUserToken(userId: string, email: string, role: string) {
    return this.authService.generateToken({
      userId,
      email,
      role,
    });
  }
}
```

### Endpoint de Login (para testing)

```bash
POST /auth/login
Content-Type: application/json

{
  "userId": "123",
  "email": "ceo@example.com",
  "role": "CEO"
}
```

Respuesta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "123",
    "email": "ceo@example.com",
    "role": "CEO"
  }
}
```

## Flujo de Solicitud al Endpoint Protegido

### 1. CEO con Token Válido (éxito - 201)

```bash
POST /plugins/import
Authorization: Bearer <TOKEN_CEО>
Content-Type: application/json

{
  "pluginName": "my-plugin",
  "pluginUrl": "http://example.com/plugin",
  "config": { "enabled": true }
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Plugin my-plugin imported successfully",
  "plugin": {
    "name": "my-plugin",
    "url": "http://example.com/plugin",
    "config": { "enabled": true },
    "importedAt": "2026-05-22T17:01:40.862Z",
    "status": "imported"
  }
}
```

### 2. Usuario Regular sin Token (error - 401)

```bash
POST /plugins/import
Content-Type: application/json

{
  "pluginName": "my-plugin",
  "pluginUrl": "http://example.com/plugin"
}
```

**Respuesta:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 3. Usuario Regular con Token Válido (error - 403)

```bash
POST /plugins/import
Authorization: Bearer <TOKEN_USER>
Content-Type: application/json

{
  "pluginName": "my-plugin",
  "pluginUrl": "http://example.com/plugin"
}
```

**Respuesta:**
```json
{
  "statusCode": 403,
  "message": "Access denied. Required roles: CEO. User role: USER"
}
```

### 4. CEO con Token Expirado (error - 401)

```bash
POST /plugins/import
Authorization: Bearer <EXPIRED_TOKEN>
Content-Type: application/json
```

**Respuesta:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## Configuración

### Variables de Entorno

```bash
# .env
JWT_SECRET=your-super-secret-key-change-in-production
```

### Token Configuration

En `auth.module.ts`:
```typescript
JwtModule.register({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  signOptions: { expiresIn: '24h' },  // Cambiar según necesidad
})
```

## Roles Disponibles

El sistema es flexible y permite cualquier rol. Los roles comunes son:

- **CEO** - Acceso total a operaciones críticas (importar plugins)
- **ADMIN** - Acceso administrativo
- **USER** - Usuario regular
- **GUEST** - Acceso limitado

## Testing

### Test del RolesGuard

```typescript
it('should allow CEO to access CEO-only endpoint', () => {
  const mockExecutionContext = {
    getHandler: () => ({}),
    switchToHttp: () => ({
      getRequest: () => ({
        user: { role: 'CEO', userId: '123', email: 'ceo@example.com' },
      }),
    }),
  } as unknown as ExecutionContext;

  jest.spyOn(reflector, 'get').mockReturnValue(['CEO']);
  const result = guard.canActivate(mockExecutionContext);
  expect(result).toBe(true);
});
```

### Ejecutar Tests

```bash
pnpm test roles.guard.spec
pnpm test plugins.controller.spec
pnpm test auth.service.spec
```

## Seguridad

### Mejores Prácticas

1. **Usar HTTPS en Producción**: Los tokens deben enviarse solo por conexiones seguras
2. **Cambiar JWT_SECRET**: Nunca usar la clave por defecto en producción
3. **Token Expiration**: Los tokens deben expirar (por defecto 24h)
4. **Validar Input**: Siempre validar los datos que llegan en el request
5. **Logging**: Registrar intentos de acceso no autorizado

### Vulnerabilidades Comunes

- ❌ Guardar JWT en localStorage (XSS vulnerable)
- ❌ Usar secreto débil o por defecto
- ❌ No validar expiración del token
- ❌ Enviar tokens por HTTP sin SSL
- ❌ Reutilizar tokens entre aplicaciones

## Casos de Uso

### 1. Importación de Plugins (solo CEO)
```typescript
@Post('plugins/import')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CEO')
async importPlugin(@Body() data: ImportPluginDto) {
  // Solo el CEO puede importar plugins
}
```

### 2. Administración de Usuarios (CEO y ADMIN)
```typescript
@Post('users/create')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CEO', 'ADMIN')
async createUser(@Body() data: CreateUserDto) {
  // CEO y ADMIN pueden crear usuarios
}
```

### 3. Lectura de Datos Públicos (sin protección)
```typescript
@Get('plugins')
getPublicPlugins() {
  // Acceso público sin autenticación
}
```

## Solución de Problemas

### Error: "No user found in request"
- Verificar que JwtAuthGuard esté en los guards
- Verificar que el token se envíe en el header Authorization
- Verificar que el token sea válido y no esté expirado

### Error: "User has no role assigned"
- El token JWT debe incluir el campo `role`
- Verificar que se haya generado correctamente con AuthService

### Error: "Access denied. Required roles"
- El rol del usuario no coincide con los requeridos
- Verificar que el usuario tenga el rol correcto

## Archivo de Estructura

```
src/
├── auth/
│   ├── auth.controller.ts       # Endpoints de auth (login)
│   ├── auth.module.ts           # Módulo de autenticación
│   ├── auth.service.ts          # Servicio para generar tokens
│   ├── auth.service.spec.ts     # Tests del servicio
│   ├── jwt.strategy.ts          # Estrategia JWT
│   ├── jwt-auth.guard.ts        # Guard de autenticación
│   ├── roles.guard.ts           # Guard de roles
│   └── roles.guard.spec.ts      # Tests del guard
├── plugins/
│   ├── plugins.controller.ts    # Controlador de plugins
│   ├── plugins.service.ts       # Servicio de plugins
│   └── plugins.module.ts        # Módulo de plugins
└── app.module.ts                # Módulo principal
```

## Referencias

- [NestJS Guards](https://docs.nestjs.com/guards)
- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Passport.js](http://www.passportjs.org/)
- [JWT.io](https://jwt.io/)
