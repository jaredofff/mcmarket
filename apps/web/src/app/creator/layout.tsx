"use client";

import Link from "next/link";
import { useState } from "react";

export default function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarLinks = [
    { href: "/creator/dashboard", label: "Dashboard" },
    { href: "/creator/products/new", label: "Nuevo Producto" },
    { href: "/creator/products", label: "Mis Productos" },
    { href: "/creator/earnings", label: "Ganancias" },
    { href: "/creator/settings", label: "Configuración" },
  ];

  return (
    <div className="flex min-h-screen bg-[#141311]">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static
          fixed inset-y-0 left-0 z-40 w-64 bg-[#141311] border-r border-[#2d2a26]
          pt-20 px-6 overflow-y-auto transition-transform duration-300`}
      >
        <nav className="space-y-2">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-4 py-3 rounded-sm text-sm font-bold text-[#a39c90] hover:bg-[#1c1a17] hover:text-amber-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Creator Info */}
        <div className="mt-12 pt-6 border-t border-[#2d2a26]">
          <div className="p-4 bg-[#1c1a17] rounded-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-[#6b6459] mb-2">Rol</p>
            <p className="font-bold text-amber-400">Creador Verificado</p>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/60"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Bar */}
        <div className="sticky top-0 z-20 h-16 bg-[#141311]/95 backdrop-blur-md border-b border-[#2d2a26] flex items-center px-6 gap-4">
          <button
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-sm bg-[#1c1a17] border border-[#2d2a26] text-[#a39c90] hover:text-amber-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1">
            <p className="font-bold text-[#e8e4db]">Panel del Creador</p>
          </div>
          <Link href="/" className="text-sm font-bold text-[#6b6459] hover:text-amber-400 transition-colors">
            Ver Tienda →
          </Link>
        </div>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
