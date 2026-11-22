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

  // If on public pledge page, show minimalist public navbar
  const isPublicPledge = pathname?.startsWith('/p/');

  if (isPublicPledge) {
    return (
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-forest-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-forest-600 flex items-center justify-center text-white shadow-md">
              <Sprout className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <span className="font-bold text-lg text-forest-900 tracking-tight">ReSprout</span>
              <span className="hidden sm:inline-block text-xs text-forest-600 ml-2 font-medium">Waste-to-Value Validation</span>
            </div>
          </Link>
          <div className="flex items-center space-x-3">
            <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
              Public Validation Page
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-forest-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Sprout className="w-6 h-6 text-emerald-200" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-xl text-forest-900 tracking-tight">ReSprout</span>
              <span className="bg-forest-100 text-forest-800 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">
                SDG 9.B
              </span>
            </div>
            <span className="text-[11px] text-earth-600 font-medium hidden sm:inline leading-none">
              Plant an idea. Grow a business.
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg font-medium text-sm transition-colors min-h-[44px] ${
                  isActive
                    ? 'bg-forest-50 text-forest-700 font-semibold'
                    : 'text-stone-600 hover:text-forest-700 hover:bg-forest-50/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-forest-600' : 'text-stone-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User status & Demo mode */}
        <div className="hidden md:flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Demo Mode Active</span>
          </div>

          {user ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-stone-200">
              <div className="flex flex-col items-end">
                <span className="text-xs font-semibold text-stone-900 leading-tight">{user.displayName}</span>
                <span className="text-[10px] uppercase font-bold text-forest-600">{user.role}</span>
              </div>
              <button
                onClick={logout}
                title="Log out"
                className="p-2 rounded-lg text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={loginAsDemoMaker}
              className="px-3.5 py-2 bg-forest-600 text-white rounded-lg text-xs font-semibold hover:bg-forest-700 shadow-sm min-h-[44px] flex items-center space-x-1.5"
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
            className="p-2 rounded-lg text-stone-700 hover:bg-stone-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-forest-100 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between py-2 border-b border-stone-100 mb-2">
            <div className="flex items-center space-x-1.5 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Demo Mode</span>
            </div>
            {user && (
              <span className="text-xs font-medium text-stone-600">
                Logged in as <strong className="text-forest-700">{user.displayName}</strong>
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
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium min-h-[44px] ${
                  isActive ? 'bg-forest-50 text-forest-700 font-semibold' : 'text-stone-700 hover:bg-stone-50'
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
                className="w-full flex items-center justify-center space-x-2 text-red-600 py-2.5 text-sm font-medium hover:bg-red-50 rounded-lg min-h-[44px]"
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
                className="w-full py-2.5 bg-forest-600 text-white rounded-lg text-sm font-semibold hover:bg-forest-700 shadow-sm min-h-[44px]"
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
