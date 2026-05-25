'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { LayoutDashboard, Package, BookOpen, Users, Menu, X, LogOut } from 'lucide-react';

const AdminSidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/plugins', label: 'Plugins', icon: Package },
    { href: '/admin/resources', label: 'Resources', icon: BookOpen },
    { href: '/admin/users', label: 'Users', icon: Users },
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

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg text-amber-500"
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
        className={`fixed left-0 top-0 h-full w-64 bg-[#1a1714] border-r border-amber-500/20 p-6 z-40 lg:relative lg:z-auto transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo/Title */}
        <div className="mb-8 pt-12 lg:pt-0">
          <h1 className="text-2xl font-bold text-amber-500 flex items-center gap-2">
            <LayoutDashboard size={28} />
            Admin Panel
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2 mb-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  active
                    ? 'bg-amber-500/20 text-amber-500 border-l-2 border-amber-500'
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
        <div className="absolute bottom-6 left-6 right-6 border-t border-amber-500/20 pt-6">
          {session?.user && (
            <div className="mb-4">
              <p className="text-sm text-[#a89968] mb-1">Logged in as:</p>
              <p className="text-amber-500 font-medium truncate">{session.user.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content offset for desktop */}
      <div className="lg:flex-1" />
    </>
  );
};

export default AdminSidebar;
