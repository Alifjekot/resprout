import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <Link href="/" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-600 hover:text-forest-700">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-forest-100 shadow-sm space-y-6 text-stone-800 text-sm leading-relaxed">
        <div className="flex items-center space-x-2 text-forest-700 border-b border-stone-100 pb-4">
          <ShieldCheck className="w-6 h-6" />
          <h1 className="text-2xl font-black text-forest-950">PDPA Privacy Notice</h1>
        </div>

        <p className="text-xs text-stone-500">
          Effective Date: November 2026 &bull; Compliant with Malaysia's Personal Data Protection Act (PDPA) 2010.
        </p>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-forest-950">1. Data Collection & Purpose</h2>
          <p>
            ReSprout collects minimal personal data:
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-stone-600 pl-2">
            <li><strong>Makers:</strong> Name and email address to manage idea gardens and draft pledge pages.</li>
            <li><strong>Supporters:</strong> Name and email address solely to record interest for specific waste-to-value products.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-forest-950">2. Privacy of Supporter Emails</h2>
          <p>
            Supporter email addresses are <strong>never shown publicly</strong> on any public pledge page or shared with third-party advertisers. Emails are accessible strictly to the verified Maker who created that specific innovation page.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-forest-950">3. Artificial Intelligence & Image Processing</h2>
          <p>
            Waste photos submitted to the Scan module are processed client-side to a maximum resolution of 1024px before transmission. Images are used solely for material identification and are not used for unauthorized biometric or surveillance tracking.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-forest-950">4. Contact & Academic Research</h2>
          <p>
            This platform is developed in conjunction with course <strong>BIK 20803 Creativity & Innovation</strong> at Universiti Tun Hussein Onn Malaysia (UTHM), advancing UN SDG 9 Target 9.B.
          </p>
        </section>
      </div>
    </div>
  );
}
