'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Share2, Download, ExternalLink, Check, Copy, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import QRCode from 'qrcode';

function PledgeManageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const ideaId = searchParams.get('idea_id') || 'idea-tree-demo';

  const [page, setPage] = useState<any>(null);
  const [headline, setHeadline] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [priceHint, setPriceHint] = useState<number>(15);
  const [isPublished, setIsPublished] = useState(false);
  const [slug, setSlug] = useState('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  const [supporters, setSupporters] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    initPledgePage();
  }, [ideaId]);

  const initPledgePage = async () => {
    try {
      const res = await fetch('/api/pledge-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea_id: ideaId }),
      });
      if (!res.ok) throw new Error('Failed to load pledge page');
      const data = await res.json();
      const p = data.page;

      setPage(p);
      setHeadline(p.headline);
      setBodyText(p.body);
      setPriceHint(p.priceHintRm || 15);
      setIsPublished(p.isPublished);
      setSlug(p.slug);

      // Generate QR Code
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const publicUrl = `${origin}/p/${p.slug}`;
      const qrUrl = await QRCode.toDataURL(publicUrl, { width: 256, margin: 2 });
      setQrCodeDataUrl(qrUrl);

      // Fetch existing pledges/supporters
      fetchSupporters();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSupporters = async () => {
    try {
      const res = await fetch(`/api/garden?user_id=${user?.id || 'usr-demo-maker'}`);
      if (!res.ok) return;
      const data = await res.json();
      const current = data.ideas?.find((i: any) => i.id === ideaId);
      if (current?.pledge_page?.supporters) {
        setSupporters(current.pledge_page.supporters);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveAndPublish = async (publishStatus: boolean) => {
    if (!page) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/pledge-pages/${page.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline,
          body: bodyText,
          price_hint_rm: priceHint,
          is_published: publishStatus,
        }),
      });
      if (!res.ok) throw new Error('Failed to update page');
      const data = await res.json();
      setIsPublished(data.page.isPublished);
      alert(publishStatus ? 'Pledge page is now LIVE and public!' : 'Page unpublished.');
    } catch (err) {
      alert('Error updating page.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const publicUrl = `${origin}/p/${slug}`;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportSupportersCsv = () => {
    if (supporters.length === 0) {
      alert('No supporters to export yet.');
      return;
    }

    const headers = ['Name', 'Email', 'Quantity', 'Date'];
    const rows = supporters.map((s) => [
      `"${s.name.replace(/"/g, '""')}"`,
      `"${s.email.replace(/"/g, '""')}"`,
      s.quantity || 1,
      `"${new Date(s.created_at).toLocaleDateString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pledges-${slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const publicLink = typeof window !== 'undefined' ? `${window.location.origin}/p/${slug}` : `/p/${slug}`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-forest-100 pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-forest-100 text-forest-800 text-xs font-bold px-3 py-1 rounded-full mb-1">
            <Share2 className="w-3.5 h-3.5" />
            <span>Module 6: Maker Pledge Page Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-950">Pledge Page & Demand Validation</h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Publish an authentic fake-door validation page to gather pre-launch customer interest without taking payments.
          </p>
        </div>

        <button
          onClick={() => router.push('/garden')}
          className="inline-flex items-center space-x-1 text-xs font-semibold text-stone-600 hover:text-forest-800 min-h-[44px]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Garden</span>
        </button>
      </div>

      {/* Editor & Live Preview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Form */}
        <div className="bg-white rounded-3xl p-6 border border-forest-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-forest-950 text-base">Page Settings</h3>
            <span
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                isPublished
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-stone-100 text-stone-600 border-stone-200'
              }`}
            >
              {isPublished ? 'Live & Published' : 'Draft Mode'}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Landing Page Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Product Story & Pitch</label>
              <textarea
                rows={5}
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Expected Price Hint (RM) - Optional
              </label>
              <input
                type="number"
                value={priceHint}
                onChange={(e) => setPriceHint(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 min-h-[44px]"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            {isPublished ? (
              <button
                onClick={() => handleSaveAndPublish(false)}
                disabled={isSaving}
                className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold min-h-[44px] transition"
              >
                Unpublish Page
              </button>
            ) : (
              <button
                onClick={() => handleSaveAndPublish(true)}
                disabled={isSaving}
                className="flex-1 py-3 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-md min-h-[44px] transition"
              >
                Publish & Advance Tree to Sapling
              </button>
            )}
          </div>
        </div>

        {/* Live Preview & Sharing QR */}
        <div className="space-y-6">
          {/* Public Link & QR Code Box */}
          <div className="bg-gradient-to-br from-forest-50 to-emerald-50 rounded-3xl p-6 border border-emerald-200 shadow-sm space-y-4">
            <h3 className="font-bold text-forest-950 text-base">Shareable Link & QR Code</h3>

            <div className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-emerald-100">
              <input
                type="text"
                readOnly
                value={publicLink}
                className="flex-1 text-xs text-stone-600 bg-transparent px-2 outline-none font-mono truncate"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 bg-forest-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1 min-h-[38px] hover:bg-forest-800 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <Link
                href={`/p/${slug}`}
                target="_blank"
                className="p-2 text-forest-700 hover:bg-forest-50 rounded-lg min-h-[38px] flex items-center justify-center"
                title="Open Public Link"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>

            {qrCodeDataUrl && (
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-emerald-100">
                <img src={qrCodeDataUrl} alt="Pledge page QR code" className="w-32 h-32 rounded-xl shadow-xs" />
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-bold text-forest-950 block">Instant Mobile Scan QR</span>
                  <p className="text-[11px] text-stone-500">
                    Display this QR code at campus events, exhibitions, or market kiosks for instant phone pledges.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Supporters & CSV Export Box (M6-F5 Requirement) */}
          <div className="bg-white rounded-3xl p-6 border border-forest-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-forest-950 text-base">Supporters List ({supporters.length})</h3>
                <span className="text-[11px] text-stone-400">Maker Private Dashboard</span>
              </div>
              <button
                onClick={exportSupportersCsv}
                className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 min-h-[40px] transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            {supporters.length > 0 ? (
              <div className="max-h-48 overflow-y-auto space-y-2">
                {supporters.map((s, idx) => (
                  <div key={s.id || idx} className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-stone-900 block">{s.name}</span>
                      <span className="text-[11px] text-stone-500">{s.email}</span>
                    </div>
                    <span className="font-bold text-forest-700">{s.quantity || 1} unit(s)</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 italic py-4 text-center">
                No supporter pledges received yet. Share your link to start validating!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PledgeManagePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-stone-500">Loading pledge studio...</div>}>
      <PledgeManageContent />
    </Suspense>
  );
}
