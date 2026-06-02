import { NextResponse } from 'next/server';
import { getCurrentSession } from './auth-supabase-server';
import { canAccessAdmin, getTrustedRoleFromMetadata } from './roles';

export async function requireAdminRoute() {
  const session = await getCurrentSession();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const role = getTrustedRoleFromMetadata(session.user.app_metadata);

  if (!canAccessAdmin(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return null;
}
