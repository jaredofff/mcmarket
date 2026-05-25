import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

export interface LoginDto {
  userId: string;
  email: string;
  role: string;
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
}
