'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Sprout, CheckCircle2, AlertCircle, Heart, Lock, Target } from 'lucide-react';
import SdgBadge from '@/components/SdgBadge';

export default function PublicPledgePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [pageData, setPageData] = useState<any>(null);
  const [pledgeCount, setPledgeCount] = useState(0);
  const [treeTarget, setTreeTarget] = useState(10);

  // Pledge form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedPledgeNum, setSubmittedPledgeNum] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadPublicPage();
    }
  }, [slug]);

  const loadPublicPage = async () => {
    try {
      const res = await fetch(`/api/public/pledge-pages/${slug}`);
      if (!res.ok) {
        throw new Error('This pledge page is not currently published or does not exist.');
      }
      const data = await res.json();
      setPageData(data);
      setPledgeCount(data.pledge_count || 0);
      setTreeTarget(data.pledge_target_tree || 10);
    } catch (err: any) {
      setError(err?.message || 'Failed to load page');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePledgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!consent) {
      setError('Please consent to be contacted about product updates (PDPA requirement).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/public/pledges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          name,
          email,
          quantity,
          consent,
          honeypot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to record pledge.');
      }

      setSubmittedPledgeNum(data.pledgeNumber);
      setPledgeCount(data.pledgeNumber);
    } catch (err: any) {
      setError(err?.message || 'Error submitting pledge');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-stone-500">Loading validation page...</p>
      </div>
    );
  }

  if (error && !pageData) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-stone-900">Page Unavailable</h2>
        <p className="text-xs text-stone-500">{error}</p>
      </div>
    );
  }

  const { page, idea } = pageData;
  const progressPercent = Math.min(100, Math.round((pledgeCount / treeTarget) * 100));

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      {/* Product Hero Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-forest-100 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="inline-flex items-center space-x-1.5 bg-forest-100 text-forest-800 text-xs font-bold px-3 py-1 rounded-full">
            <Sprout className="w-3.5 h-3.5 text-forest-700" />
            <span>Sustainable Malaysian Innovation</span>
          </div>
          <SdgBadge size="sm" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-4xl font-black text-forest-950 tracking-tight leading-tight">
            {page.headline}
          </h1>
          <p className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {page.body}
          </p>
        </div>

        {page.price_hint_rm && (
          <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-xl text-xs text-amber-900 font-semibold">
            <span>Expected Retail Price:</span>
            <span className="font-black text-amber-800 text-sm">RM {page.price_hint_rm}</span>
          </div>
        )}

        {/* Tree Progress Tracker (M6-F6 Requirement) */}
        <div className="p-5 bg-gradient-to-br from-forest-50 to-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-forest-950">
            <span className="flex items-center space-x-1.5">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>{pledgeCount} Community Pledges</span>
            </span>
            <span className="text-stone-500">Tree Target: {treeTarget} Supporters</span>
          </div>

          <div className="w-full h-3 rounded-full bg-white border border-emerald-200 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-forest-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-stone-500 text-center">
            {pledgeCount >= treeTarget
              ? 'Tree target reached! This idea is fully validated.'
              : `${treeTarget - pledgeCount} more pledges needed to unlock pilot production batch.`}
          </p>
        </div>

        {/* Pledge Form or Success Message */}
        {submittedPledgeNum ? (
          <div className="p-6 bg-emerald-500 text-white rounded-2xl text-center space-y-3 shadow-md animate-growth">
            <CheckCircle2 className="w-12 h-12 text-white mx-auto" />
            <h3 className="text-xl font-black">Thank you! You are pledge #{submittedPledgeNum}.</h3>
            <p className="text-xs text-emerald-100 max-w-md mx-auto">
              Your interest signals real demand to the creators. We will keep you updated on prototype development without spam.
            </p>
          </div>
        ) : (
          <form onSubmit={handlePledgeSubmit} className="space-y-4 pt-2">
            <div className="border-t border-stone-200 pt-5">
              <h3 className="text-lg font-bold text-forest-950 mb-1">Show Your Interest (Free Pledge)</h3>
              <p className="text-xs text-stone-500">
                Back this sustainable initiative today. No payment is required.
              </p>
            </div>

            {/* Honeypot field for spam prevention */}
            <input
              type="text"
              name="honeypot"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Siti Aminah"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aminah@example.my"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 min-h-[44px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                How many units would you potentially purchase?
              </label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 min-h-[44px] bg-white"
              >
                <option value={1}>1 unit (Personal trial)</option>
                <option value={2}>2 units (Home & Family)</option>
                <option value={5}>5 units (Small business)</option>
                <option value={10}>10+ units (Wholesale / Commercial)</option>
              </select>
            </div>

            {/* Mandatory PDPA Consent Checkbox (M6-F7 Requirement) */}
            <label className="flex items-start space-x-3 cursor-pointer pt-1">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 accent-forest-600 w-4 h-4 rounded"
              />
              <span className="text-xs text-stone-600 leading-tight">
                I agree to be contacted about this product. Under Malaysia's PDPA, your email will only be used to update you on this product and will never be shared publicly or sold.
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-forest-700 hover:bg-forest-800 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2 min-h-[48px]"
            >
              <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
              <span>{isSubmitting ? 'Recording pledge...' : 'Pledge Support for This Product'}</span>
            </button>

            {/* Mandatory Fake-Door Disclaimer (M6-F9 Requirement) */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center text-[11px] text-stone-500 flex items-center justify-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-stone-400" />
              <span>This is a demand validation test. No payment is taken.</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
