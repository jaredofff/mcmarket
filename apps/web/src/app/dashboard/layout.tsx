"use client";

import Link from "next/link";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarLinks = [
    { href: "/dashboard", label: "Resumen", icon: "📊" },
    { href: "/dashboard/downloads", label: "Mis Descargas", icon: "📥" },
    { href: "/dashboard/resources", label: "Mis Recursos", icon: "🎁" },
    { href: "/dashboard/favorites", label: "Favoritos", icon: "⭐" },
    { href: "/dashboard/activity", label: "Actividad", icon: "📈" },
  ];

  return (
    <div className="flex h-screen bg-[#141311]">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative w-64 h-screen bg-[#1c1a17] border-r border-[#2d2a26] transform transition-transform md:translate-x-0 z-40 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <h2 className="font-outfit font-bold text-lg text-[#e8e4db] mb-8">Dashboard</h2>
          <nav className="space-y-2">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-sm text-[#a39c90] hover:bg-[#242118] hover:text-amber-400 transition-all text-sm font-medium"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-[#1c1a17] border-b border-[#2d2a26] px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden h-9 w-9 flex items-center justify-center rounded-sm bg-[#242118] text-[#a39c90] hover:text-amber-400"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <button className="h-9 px-4 rounded-sm bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm font-bold hover:bg-amber-500/20 transition-all">
              Perfil
            </button>
            <button className="h-9 px-4 rounded-sm bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/20 transition-all">
              Salir
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
