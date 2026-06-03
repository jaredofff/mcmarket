import AdminSidebar from './components/AdminSidebar';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth-supabase-server';
import { canAccessAdmin, getTrustedRoleFromMetadata } from '@/lib/roles';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export const metadata = {
  title: 'Admin | MC Market',
  description: 'Resource administration for MC Market',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();

  if (!session) {
    redirect('/auth?next=/admin');
  }

  const role = getTrustedRoleFromMetadata(session.user.app_metadata);

  if (!canAccessAdmin(role)) {
    redirect('/dashboard?forbidden=admin');
  }

  return (
    <div className="flex min-h-screen bg-[#141311]">
      <AdminSidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="border-b border-[#2d2a26] bg-[#11100e] px-6 py-5">
          <div className="w-full max-w-none">
            <h1 className="text-2xl font-bold text-amber-500">MC Market Admin</h1>
            <p className="mt-1 text-sm text-[#a89968]">Gestión de catálogo, uploads y publicación.</p>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 lg:ml-0">
          <div className="w-full max-w-none">{children}</div>
        </div>
      </main>
    </div>
  );
}
