'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from '@/lib/auth-compat';
import { useState } from 'react';
import { LayoutDashboard, Package, Menu, X, LogOut, ShieldCheck } from 'lucide-react';
import { canAccessAdmin } from '@/lib/roles';

const AdminSidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const isAuthorized = canAccessAdmin(session?.user?.role);

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/plugins', label: 'Recursos', icon: Package },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await signOut({ redirectTo: '/' });
  };

  if (!isAuthorized) {
    return null;
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 rounded-sm bg-amber-500/10 p-2 text-amber-500 hover:bg-amber-500/20 lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-amber-500/20 bg-[#1a1714] p-6 transition-transform duration-300 lg:relative lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo/Title */}
        <div className="mb-8 pt-12 lg:pt-0">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-amber-500">
            <LayoutDashboard size={28} />
            Admin
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="mb-8 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-sm px-4 py-3 transition-colors ${
                  active
                    ? 'border-l-2 border-amber-500 bg-amber-500/20 text-amber-500'
                    : 'text-[#a89968] hover:bg-amber-500/10 hover:text-amber-500'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="mt-auto border-t border-amber-500/20 pt-5">
          <div className="mb-4 rounded-sm border border-[#2d2a26] bg-[#11100e] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-amber-500/30 bg-amber-500/10 text-amber-400">
                <ShieldCheck size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-widest text-[#6b6459]">Sesión activa</p>
                <p className="mt-0.5 truncate text-sm font-bold text-[#e8e4db]">
                  {session?.user?.role || 'ADMIN'}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-sm border border-red-500/20 bg-red-500/15 px-4 font-bold text-red-400 transition-colors hover:bg-red-500/25"
          >
            <LogOut size={18} />
            Salir
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
