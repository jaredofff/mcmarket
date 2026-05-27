"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/plugins", label: "Plugins" },
    { href: "/setups", label: "Setups" },
    { href: "/configs", label: "Configs" },
    { href: "/builds", label: "Builds" },
    { href: "/webs", label: "Webs" },
    { href: "/membership", label: "Membresia" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#2d2a26] bg-[#141311]/90 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt="MCMarket Logo"
            width={32}
            height={32}
            className="w-8 h-8 rounded-sm"
          />
          <span className="font-outfit font-bold text-xl tracking-tight text-[#e8e4db] group-hover:text-amber-400 transition-colors">
            mcmarket
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-bold uppercase tracking-wider transition-colors ${
                pathname === link.href
                  ? "text-amber-400"
                  : "text-[#a39c90] hover:text-amber-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Creator Panel */}
          <Link
            href="/creator/dashboard"
            className="hidden md:flex h-9 px-4 rounded-sm bg-[#1c1a17] border border-[#3d3830] text-sm font-medium text-[#a39c90] hover:text-amber-400 hover:border-amber-500/50 transition-all items-center gap-2"
          >
            <span>🎨 Creator Panel</span>
          </Link>

          {/* Search Button */}
          <Link
            href="/plugins"
            className="hidden md:flex h-9 px-4 rounded-sm bg-[#1c1a17] border border-[#3d3830] text-sm font-medium text-[#a39c90] hover:text-amber-400 hover:border-amber-500/50 transition-all items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search plugins...</span>
          </Link>

          {/* Discord Login */}
          <button
            id="nav-discord-login"
            className="h-9 px-4 rounded-sm bg-[#5865F2] hover:bg-[#4752c4] text-sm font-bold text-white transition-all border-b-2 border-[#3442d9] shadow-[0_2px_0_#3442d9] active:shadow-none active:translate-y-0.5 flex items-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.118.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028z" />
            </svg>
            Sign In
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden h-9 w-9 flex items-center justify-center rounded-sm bg-[#1c1a17] border border-[#3d3830] text-[#a39c90] hover:text-amber-400 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#2d2a26] bg-[#141311] px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-bold uppercase tracking-wider text-[#a39c90] hover:text-amber-400 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
