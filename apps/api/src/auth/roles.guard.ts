import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';

/**
 * Decorator para especificar los roles permitidos en un endpoint
 * @param roles - Array de roles permitidos
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtener los roles requeridos del decorador @Roles
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    // Si no se especificaron roles, permitir el acceso
    if (!requiredRoles) {
      return true;
    }

    // Obtener la solicitud HTTP
    const request = context.switchToHttp().getRequest();

    // Obtener el usuario del objeto request (asignado por JwtAuthGuard)
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No user found in request');
    }

    if (!user.role) {
      throw new ForbiddenException('User has no role assigned');
    }

    // Verificar si el rol del usuario está en los roles requeridos
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}. User role: ${user.role}`,
      );
    }

    return true;
  }
}
