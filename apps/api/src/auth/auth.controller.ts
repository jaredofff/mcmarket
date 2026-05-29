import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

export interface LoginDto {
  userId: string;
  email: string;
  role: string;
}

export interface UpsertUserDto {
  discordId: string;
  name?: string;
  email?: string | null;
  image?: string | null;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Endpoint para generar un token JWT (para testing)
   * En producción, esto debería validar credenciales contra una BD
   */
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    const token = this.authService.generateToken({
      userId: loginDto.userId,
      email: loginDto.email,
      role: loginDto.role,
    });

    return {
      access_token: token,
      user: {
        userId: loginDto.userId,
        email: loginDto.email,
        role: loginDto.role,
      },
    };
  }

  @Post('upsert')
  async upsertUser(@Body() dto: UpsertUserDto) {
    // Realizar upsert en la base de datos y devolver el role
    const { discordId, name, email, image } = dto;
    // Importar PrismaService dinámicamente para evitar circular deps en pruebas
    // El módulo principal ya provee PrismaService como provider global
    // Aquí accederemos directamente al cliente mediante require para simplicidad
    // Nota: este método asume que PrismaModule está registrado en la app
    // y que `this` no tiene PrismaService; para simplicidad usamos dynamic import
    const { PrismaService } = await import('../prisma/prisma.service').catch(() => ({} as any));
    // Si no podemos acceder al PrismaService, devolvemos role por defecto
    if (!PrismaService) {
      return { role: 'USER' };
    }

    // En Nest es preferible usar inyección; aquí hacemos un acceso directo
    const prismaClient = new (require('@prisma/client').PrismaClient)();
    const user = await prismaClient.user.upsert({
      where: { discordId },
      create: { discordId, name: name || 'discord-user', email: email || null, image: image || null },
      update: { name: name || undefined, email: email || undefined, image: image || undefined },
    });

    await prismaClient.$disconnect();

    return { role: user.role };
  }
}
