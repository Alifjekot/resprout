'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sprout, Camera, Flower2, ShieldAlert, LogOut, User, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, loginAsDemoMaker } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPublicPledge = pathname?.startsWith('/p/');

  if (isPublicPledge) {
    return (
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-emerald-100 shadow-[0_4px_20px_rgba(16,185,129,0.04)]">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-forest-700 flex items-center justify-center text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-forest-950 tracking-tight">ReSprout</span>
              <span className="hidden sm:inline-block text-xs text-forest-600 ml-2 font-semibold">Demand Validation</span>
            </div>
          </Link>
          <div className="flex items-center space-x-3">
            <span className="text-xs bg-amber-50 text-amber-900 border border-amber-200/80 px-3 py-1 rounded-full font-bold shadow-xs flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Public Demand Test</span>
            </span>
          </div>
        </div>
      </header>
    );
  }

  const navLinks = [
    { href: '/garden', label: 'Idea Garden', icon: Flower2 },
    { href: '/scan', label: 'Scan Material', icon: Camera },
    { href: '/admin', label: 'Admin', icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-emerald-100/80 shadow-[0_4px_24px_rgba(16,185,129,0.05)]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand with Uiverse Glow Badge */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-forest-800 flex items-center justify-center text-white shadow-[0_4px_15px_rgba(16,185,129,0.35)] group-hover:scale-105 group-hover:shadow-[0_6px_20px_rgba(16,185,129,0.5)] transition-all">
            <Sprout className="w-6 h-6 text-emerald-100 animate-sway" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-xl text-forest-950 tracking-tight">ReSprout</span>
              <span className="bg-gradient-to-r from-emerald-500 to-forest-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full tracking-wider uppercase shadow-xs">
                SDG 9.B
              </span>
            </div>
            <span className="text-[11px] text-stone-500 font-medium hidden sm:inline leading-none">
              Plant an idea. Grow a business.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 bg-stone-100/60 p-1 rounded-2xl border border-stone-200/60">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-xs transition-all min-h-[40px] ${
                  isActive
                    ? 'bg-white text-forest-900 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-stone-200/70 font-bold'
                    : 'text-stone-600 hover:text-forest-800 hover:bg-white/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-stone-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Status & Uiverse Action */}
        <div className="hidden md:flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-xs bg-emerald-50 text-emerald-900 border border-emerald-200/80 px-3 py-1.5 rounded-full font-bold shadow-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>Demo Mode</span>
          </div>

          {user ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-stone-200">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-forest-950 leading-tight">{user.displayName}</span>
                <span className="text-[10px] uppercase font-black text-emerald-700">{user.role}</span>
              </div>
              <button
                onClick={logout}
                title="Log out"
                className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={loginAsDemoMaker}
              className="uiverse-btn-emerald px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 min-h-[44px]"
            >
              <User className="w-3.5 h-3.5" />
              <span>Demo Login</span>
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center space-x-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-stone-700 hover:bg-stone-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-emerald-100 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2 shadow-xl">
          <div className="flex items-center justify-between py-2 border-b border-stone-100 mb-2">
            <div className="flex items-center space-x-1.5 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Demo Mode Active</span>
            </div>
            {user && (
              <span className="text-xs font-medium text-stone-600">
                User: <strong className="text-forest-900">{user.displayName}</strong>
              </span>
            )}
          </div>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-base font-semibold min-h-[44px] ${
                  isActive ? 'bg-forest-50 text-forest-800 font-bold' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-forest-600' : 'text-stone-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-stone-100">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center space-x-2 text-rose-600 py-2.5 text-sm font-bold hover:bg-rose-50 rounded-xl min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Log out</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  loginAsDemoMaker();
                  setMobileMenuOpen(false);
                }}
                className="uiverse-btn-emerald w-full py-2.5 rounded-xl text-sm font-bold shadow-md min-h-[44px]"
              >
                Log in as Demo Maker
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
