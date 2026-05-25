import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface CreateTokenDto {
  userId: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  /**
   * Genera un token JWT para un usuario
   * @param payload - Datos del usuario (userId, email, role)
   * @returns Token JWT
   */
  generateToken(payload: CreateTokenDto): string {
    return this.jwtService.sign({
      sub: payload.userId,
      email: payload.email,
      role: payload.role,
    });
  }

  /**
   * Verifica y decodifica un token JWT
   * @param token - Token a verificar
   * @returns Payload decodificado
   */
  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
}
