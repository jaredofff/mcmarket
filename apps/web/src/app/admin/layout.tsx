import AdminSidebar from './components/AdminSidebar';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth-supabase-server';
import { canAccessAdmin, getRoleFromMetadata } from '@/lib/roles';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export const metadata = {
  title: 'Admin Panel | MC Market',
  description: 'Administration panel for MC Market',
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();

  if (!session) {
    redirect('/auth?next=/admin');
  }

  const role = getRoleFromMetadata(session.user.app_metadata, session.user.user_metadata);

  if (!canAccessAdmin(role)) {
    redirect('/dashboard?forbidden=admin');
  }

  return (
    <div className="flex min-h-screen bg-[#141311]">
      <AdminSidebar />
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#1a1714] border-b border-amber-500/20 px-6 py-4">
          <div className="max-w-7xl">
            <h1 className="text-2xl font-bold text-amber-500">Admin Panel</h1>
            <p className="text-[#a89968] text-sm mt-1">Manage your marketplace content</p>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 lg:ml-0">
          <div className="max-w-7xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
