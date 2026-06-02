export const APP_ROLES = ['USER', 'VIP', 'LEGEND', 'DEVELOPER', 'ADMIN', 'CEO'] as const;

export type AppRole = (typeof APP_ROLES)[number];

export const DEFAULT_ROLE: AppRole = 'USER';

const ROLE_PRIORITY: Record<AppRole, number> = {
  USER: 0,
  VIP: 1,
  LEGEND: 2,
  DEVELOPER: 3,
  ADMIN: 4,
  CEO: 5,
};

export function normalizeRole(value: unknown): AppRole {
  if (typeof value !== 'string') {
    return DEFAULT_ROLE;
  }

  const role = value.trim().toUpperCase();
  return APP_ROLES.includes(role as AppRole) ? (role as AppRole) : DEFAULT_ROLE;
}

export function highestRole(values: unknown[]): AppRole {
  return values
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .map(normalizeRole)
    .reduce((highest, role) => (ROLE_PRIORITY[role] > ROLE_PRIORITY[highest] ? role : highest), DEFAULT_ROLE);
}

export function getRoleFromMetadata(
  appMetadata?: Record<string, unknown> | null,
  userMetadata?: Record<string, unknown> | null
): AppRole {
  return highestRole([
    appMetadata?.role,
    appMetadata?.roles,
    appMetadata?.app_role,
    userMetadata?.role,
    userMetadata?.roles,
  ]);
}

export function canAccessAdmin(role: unknown) {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === 'ADMIN' || normalizedRole === 'CEO';
}

export function canAccessCreator(role: unknown) {
  const normalizedRole = normalizeRole(role);
  return normalizedRole === 'DEVELOPER' || normalizedRole === 'ADMIN' || normalizedRole === 'CEO';
}
