import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-token'),
            verify: jest.fn().mockReturnValue({ sub: '123', role: 'CEO' }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('should generate a token', () => {
      const payload = {
        userId: '123',
        email: 'ceo@example.com',
        role: 'CEO',
      };

      const token = service.generateToken(payload);

      expect(token).toBe('mock-token');
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: '123',
        email: 'ceo@example.com',
        role: 'CEO',
      });
    });

    it('should include user data in token', () => {
      const payload = {
        userId: 'user-456',
        email: 'admin@example.com',
        role: 'ADMIN',
      };

      service.generateToken(payload);

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: 'user-456',
        email: 'admin@example.com',
        role: 'ADMIN',
      });
    });
  });

  describe('verifyToken', () => {
    it('should verify a token', () => {
      const token = 'valid-token';
      const result = service.verifyToken(token);

      expect(result).toEqual({ sub: '123', role: 'CEO' });
      expect(jwtService.verify).toHaveBeenCalledWith(token);
    });

    it('should return decoded payload', () => {
      jest.spyOn(jwtService, 'verify').mockReturnValue({
        sub: 'user-789',
        email: 'user@example.com',
        role: 'USER',
        iat: 1234567890,
        exp: 1234571490,
      });

      const result = service.verifyToken('some-token');

      expect(result.sub).toBe('user-789');
      expect(result.role).toBe('USER');
    });
  });
});
