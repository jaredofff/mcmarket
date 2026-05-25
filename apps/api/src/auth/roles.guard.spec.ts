import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard, ROLES_KEY } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ForbiddenException, ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if no roles are required', () => {
    const mockExecutionContext = {
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'USER' },
        }),
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(undefined);

    const result = guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });

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

  it('should deny access if user is not CEO', () => {
    const mockExecutionContext = {
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'USER', userId: '456', email: 'user@example.com' },
        }),
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(['CEO']);

    expect(() => guard.canActivate(mockExecutionContext)).toThrow(
      ForbiddenException,
    );
  });

  it('should deny access if user role is missing', () => {
    const mockExecutionContext = {
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({
          user: { userId: '789', email: 'noRole@example.com' },
        }),
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(['CEO']);

    expect(() => guard.canActivate(mockExecutionContext)).toThrow(
      ForbiddenException,
    );
  });

  it('should deny access if no user is found', () => {
    const mockExecutionContext = {
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(['CEO']);

    expect(() => guard.canActivate(mockExecutionContext)).toThrow(
      ForbiddenException,
    );
  });

  it('should allow access if user has one of multiple required roles', () => {
    const mockExecutionContext = {
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'ADMIN', userId: '999', email: 'admin@example.com' },
        }),
      }),
    } as unknown as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(['CEO', 'ADMIN']);

    const result = guard.canActivate(mockExecutionContext);
    expect(result).toBe(true);
  });
});
