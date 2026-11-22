'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Sprout, CheckCircle2, AlertCircle, Heart, Lock, Sparkles } from 'lucide-react';
import SdgBadge from '@/components/SdgBadge';
import confetti from 'canvas-confetti';

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

      // Confetti burst for supporter
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#10b981', '#34d399', '#f59e0b', '#059669'],
      });
    } catch (err: any) {
      setError(err?.message || 'Error submitting pledge');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
        <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto shadow-md" />
          <p className="text-xs font-bold text-stone-500 uppercase tracking-widest">Loading validation page...</p>
        </div>
        );
  }

        if (error && !pageData) {
    return (
          <div className="max-w-md mx-auto py-20 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h2 className="text-xl font-black text-stone-900">Page Unavailable</h2>
            <p className="text-xs text-stone-500">{error}</p>
          </div>
          );
  }

          const {page, idea} = pageData;
          const progressPercent = Math.min(100, Math.round((pledgeCount / treeTarget) * 100));

          return (
              <div className="max-w-2xl mx-auto space-y-8 pb-20">
                {/* Product Hero Banner with Uiverse Glass Card */}
                <div className="uiverse-card rounded-[2.5rem] p-7 sm:p-11 space-y-7">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-black px-3.5 py-1 rounded-full shadow-xs">
                        <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Sustainable Malaysian Venture</span>
                      </div>
                      <SdgBadge size="sm" />
                    </div>

                    <div className="space-y-3">
                      <h1 className="text-2xl sm:text-4xl font-black text-forest-950 tracking-tight leading-tight">
                        {page.headline}
                      </h1>
                        <p className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line font-normal">
                          {page.body}
                        </p>
                    </div>

                    {page.price_hint_rm && (
                        <div className="inline-flex items-center space-x-2.5 bg-amber-50 border border-amber-200/80 px-4 py-2 rounded-2xl text-xs text-amber-900 font-bold shadow-xs">
                          <span>Expected Retail Price:</span>
                          <span className="font-black text-amber-800 text-base">RM {page.price_hint_rm}</span>
                        </div>
        )}

                              {/* Tree Progress Tracker with Uiverse Visual Fill */}
                              <div className="p-6 bg-gradient-to-br from-emerald-50/80 via-forest-50/60 to-teal-50/40 rounded-3xl border border-emerald-200/80 space-y-3.5 shadow-sm">
                                <div className="flex items-center justify-between text-xs font-black text-forest-950">
                                  <span className="flex items-center space-x-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                                    <span>{pledgeCount} Community Pledges</span>
                                  </span>
                                  <span className="text-stone-500 font-bold">Tree Target: {treeTarget} Supporters</span>
                                </div>

                                  <div className="w-full h-3.5 rounded-full bg-white border border-emerald-200/80 overflow-hidden p-0.5 shadow-inner">
                                    <div
                                      className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-forest-600 rounded-full transition-all duration-700 shadow-sm"
                                      style={{ width: `${progressPercent}%` }}
                                    />
                                  </div>

                                    <p className="text-[11px] text-stone-500 text-center font-medium">
                                      {pledgeCount >= treeTarget
                                        ? 'Tree target reached! This idea is fully validated.'
                                        : `${treeTarget - pledgeCount} more pledges needed to unlock pilot production batch.`}
                                    </p>
                                </div>

                                {/* Pledge Form or Success Message */}
                                {submittedPledgeNum ? (
                                      <div className="p-7 bg-gradient-to-br from-emerald-500 to-forest-600 text-white rounded-3xl text-center space-y-3 shadow-xl animate-growth">
                                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto shadow-inner">
                                          <CheckCircle2 className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-black">Thank you! You are pledge #{submittedPledgeNum}.</h3>
                                        <p className="text-xs text-emerald-100 max-w-md mx-auto leading-relaxed">
                                          Your interest signals real demand to the creators. We will keep you updated on prototype development without spam.
                                        </p>
                                      </div>
                                      ) : (
                                      <form onSubmit={handlePledgeSubmit} className="space-y-4 pt-2">
                                          <div className="border-t border-stone-100 pt-6">
                                            <h3 className="text-lg font-black text-forest-950 mb-1">Show Your Interest (Free Pledge)</h3>
                                            <p className="text-xs text-stone-500">
                                              Back this sustainable initiative today. No payment is taken or required.
                                            </p>
                                          </div>

                                          {/* Honeypot field */}
                                          <input
                                            type="text"
                                            name="honeypot"
                                            value={honeypot}
                                            onChange={(e) => setHoneypot(e.target.value)}
                                            className="hidden"
                                          />

                                          {error && (
                                              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center space-x-2">
                                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                                <span>{error}</span>
                                              </div>
            )}

                                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Your Full Name</label>
                                                  <input
                                                    type="text"
                                                    required
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="e.g. Siti Aminah"
                                                    className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px] bg-stone-50/50"
                                                  />
                                                </div>

                                                <div>
                                                  <label className="block text-xs font-bold text-stone-700 mb-1.5">Email Address</label>
                                                  <input
                                                    type="email"
                                                    required
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="aminah@example.my"
                                                    className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px] bg-stone-50/50"
                                                  />
                                                </div>
                                              </div>

                                              <div>
                                                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                                                    How many units would you potentially purchase?
                                                  </label>
                                                  <select
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                                    className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px] bg-stone-50/50 font-medium"
                                                  >
                                                    <option value={1}>1 unit (Personal trial)</option>
                                                    <option value={2}>2 units (Home & Family)</option>
                                                    <option value={5}>5 units (Small business)</option>
                                                    <option value={10}>10+ units (Wholesale / Commercial)</option>
                                                  </select>
                                              </div>

                                                {/* Mandatory PDPA Consent Checkbox */}
                                                <label className="flex items-start space-x-3 cursor-pointer pt-2">
                                                  <input
                                                    type="checkbox"
                                                    required
                                                    checked={consent}
                                                    onChange={(e) => setConsent(e.target.checked)}
                                                    className="mt-0.5 accent-emerald-600 w-4 h-4 rounded"
                                                  />
                                                  <span className="text-xs text-stone-600 leading-tight">
                                                    I agree to be contacted about this product. Under Malaysia's PDPA, your email will only be used to update you on this product and will never be shared publicly or sold.
                                                  </span>
                                                </label>

                                                <button
                                                  type="submit"
                                                  disabled={isSubmitting}
                                                  className="uiverse-btn-emerald w-full py-4 rounded-2xl font-black text-sm tracking-wide shadow-lg flex items-center justify-center space-x-2.5 min-h-[50px]"
                                                >
                                                  <Heart className="w-4 h-4 text-rose-200 fill-rose-200" />
                                                  <span>{isSubmitting ? 'Recording pledge...' : 'Pledge Support for This Product'}</span>
                                                </button>

                                                  {/* Mandatory Fake-Door Disclaimer */}
                                                  <div className="p-3.5 bg-stone-50/90 rounded-2xl border border-stone-200/80 text-center text-[11px] text-stone-500 flex items-center justify-center space-x-2">
                                                    <Lock className="w-3.5 h-3.5 text-stone-400" />
                                                    <span>This is a demand validation test. No payment is taken or required.</span>
                                                  </div>
                                                </form>
        )}
                                            </div>
    </div>
                                        );
}
