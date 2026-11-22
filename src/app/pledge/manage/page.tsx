'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Share2, Download, ExternalLink, Check, Copy, ArrowLeft, QrCode } from 'lucide-react';
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
        <div className="max-w-4xl mx-auto space-y-8 pb-16">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-forest-100 pb-5">
            <div>
              <div className="inline-flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-black px-3.5 py-1 rounded-full mb-1">
                <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Module 6: Maker Pledge Page Studio</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-forest-950 tracking-tight">
                Pledge Page & Demand Validation
              </h1>
              <p className="text-xs sm:text-sm text-stone-500">
                Publish an authentic fake-door validation page to gather pre-launch customer interest without taking payments.
              </p>
            </div>

                <button
                  onClick={() => router.push('/garden')}
                  className="uiverse-btn-glass px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Garden</span>
                </button>
              </div>

              {/* Editor & Live Preview Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Editor Form with Uiverse Card */}
                <div className="uiverse-card rounded-[2.5rem] p-7 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-forest-950 text-base">Page Settings</h3>
                    <span
                      className={`text-[11px] font-black px-3 py-1 rounded-full border ${isPublished
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-xs'
                          : 'bg-stone-100 text-stone-600 border-stone-200'
                        }`}
                    >
                      {isPublished ? 'Live & Published' : 'Draft Mode'}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">Landing Page Headline</label>
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px] bg-stone-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">Product Story & Pitch</label>
                      <textarea
                        rows={5}
                        value={bodyText}
                        onChange={(e) => setBodyText(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50/50 leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1.5">
                        Expected Price Hint (RM) - Optional
                      </label>
                      <input
                        type="number"
                        value={priceHint}
                        onChange={(e) => setPriceHint(Number(e.target.value))}
                        className="w-full px-4 py-2.5 rounded-2xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px] bg-stone-50/50"
                      />
                    </div>
                  </div>

                      <div className="flex items-center space-x-3 pt-2">
                        {isPublished ? (
                          <button
                            onClick={() => handleSaveAndPublish(false)}
                            disabled={isSaving}
                            className="uiverse-btn-glass flex-1 py-3.5 rounded-2xl text-xs font-bold transition"
                          >
                            Unpublish Page
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSaveAndPublish(true)}
                            disabled={isSaving}
                            className="uiverse-btn-emerald flex-1 py-3.5 rounded-2xl text-xs font-black shadow-md transition"
                          >
                            Publish & Advance Tree to Sapling
                          </button>
                        )}
                      </div>
                    </div>

                      {/* Live Preview & Sharing QR */}
                      <div className="space-y-6">
                        {/* Public Link & QR Code Box */}
                        <div className="uiverse-card rounded-[2.5rem] p-7 space-y-4 bg-gradient-to-br from-emerald-50/60 to-forest-50/40">
                          <h3 className="font-black text-forest-950 text-base">Shareable Link & QR Code</h3>

                          <div className="flex items-center space-x-2 bg-white p-2 rounded-2xl border border-emerald-200/80 shadow-2xs">
                            <input
                              type="text"
                              readOnly
                              value={publicLink}
                              className="flex-1 text-xs text-stone-600 bg-transparent px-2.5 outline-none font-mono truncate"
                            />
                            <button
                              onClick={handleCopyLink}
                              className="uiverse-btn-emerald px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 min-h-[38px]"
                            >
                              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copied ? 'Copied' : 'Copy'}</span>
                            </button>
                            <Link
                              href={`/p/${slug}`}
                              target="_blank"
                              className="p-2 text-emerald-800 hover:bg-emerald-50 rounded-xl min-h-[38px] flex items-center justify-center transition"
                              title="Open Public Link"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          </div>

                            {qrCodeDataUrl && (
                              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/90 p-4 rounded-3xl border border-emerald-100 shadow-2xs">
                                <img src={qrCodeDataUrl} alt="Pledge page QR code" className="w-32 h-32 rounded-2xl shadow-xs" />
                                <div className="space-y-1 text-center sm:text-left">
                                  <span className="text-xs font-black text-forest-950 block">Instant Mobile Scan QR</span>
                                  <p className="text-[11px] text-stone-500 leading-relaxed font-normal">
                                    Display this QR code at campus pitches, exhibitions, or market kiosks for instant phone pledges.
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>

                            {/* Supporters & CSV Export Box */}
                            <div className="uiverse-card rounded-[2.5rem] p-7 space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-black text-forest-950 text-base">Supporters List ({supporters.length})</h3>
                                  <span className="text-[11px] font-bold text-stone-400">Maker Private Dashboard</span>
                                </div>
                                <button
                                  onClick={exportSupportersCsv}
                                  className="uiverse-btn-glass px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5"
                                >
                                  <Download className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>Export CSV</span>
                                </button>
                              </div>

                                        {supporters.length > 0 ? (
                                          <div className="max-h-48 overflow-y-auto space-y-2">
                                            {supporters.map((s, idx) => (
                                              <div key={s.id || idx} className="p-3 bg-stone-50 rounded-2xl border border-stone-100 flex items-center justify-between text-xs">
                                                <div>
                                                  <span className="font-bold text-stone-900 block">{s.name}</span>
                                                  <span className="text-[11px] text-stone-500">{s.email}</span>
                                                </div>
                                                <span className="font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                                                  {s.quantity || 1} unit(s)
                                                </span>
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
