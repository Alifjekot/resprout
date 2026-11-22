'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sprout, LogIn, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsDemoMaker } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    login(email, email.split('@')[0]);
    router.push('/scan');
  };

  const handleDemoClick = () => {
    loginAsDemoMaker();
    router.push('/scan');
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <div className="bg-white rounded-3xl p-8 border border-forest-100 shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-forest-600 flex items-center justify-center text-white mx-auto shadow-md">
            <Sprout className="w-7 h-7 text-emerald-200" />
          </div>
          <h1 className="text-2xl font-bold text-forest-950">Log In to ReSprout</h1>
          <p className="text-xs text-stone-500">Access your ideas, scores, and pledge validations</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maker@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 min-h-[44px]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-700">Password</label>
              <button
                type="button"
                onClick={() => alert('Password reset link sent (demo placeholder).')}
                className="text-[11px] text-forest-700 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 min-h-[44px]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-forest-700 hover:bg-forest-800 text-white font-bold rounded-xl shadow transition min-h-[44px] flex items-center justify-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Log In</span>
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-stone-400 font-semibold">Or One-Click Demo</span>
          </div>
        </div>

        <button
          onClick={handleDemoClick}
          type="button"
          className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold rounded-xl transition min-h-[44px] flex items-center justify-center space-x-2"
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Demo Maker 1-Click Login</span>
        </button>

        <div className="text-center text-xs text-stone-500 pt-2">
          Don't have an account yet?{' '}
          <Link href="/signup" className="text-forest-700 font-bold hover:underline">
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
}
