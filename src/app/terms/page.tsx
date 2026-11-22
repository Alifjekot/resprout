import React from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      <Link href="/" className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-600 hover:text-forest-700">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-forest-100 shadow-sm space-y-6 text-stone-800 text-sm leading-relaxed">
        <div className="flex items-center space-x-2 text-forest-700 border-b border-stone-100 pb-4">
          <FileText className="w-6 h-6" />
          <h1 className="text-2xl font-black text-forest-950">Terms of Service</h1>
        </div>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-forest-950">1. Demand Testing & Non-Payment Notice</h2>
          <p>
            ReSprout provides fake-door demand testing for early-stage waste-to-value business ideas. <strong>No real monetary transactions, credit card processing, or financial commitments occur on this platform.</strong> Pledges indicate non-binding customer intent.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-forest-950">2. Feasibility Scoring Estimates</h2>
          <p>
            Validation scores and startup capital estimates are computer-generated approximations intended to assist ideation. Makers are responsible for conducting independent market due diligence and laboratory safety testing before manufacturing commercial products.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-forest-950">3. Academic Attribution</h2>
          <p>
            ReSprout was developed under BIK 20803 (UTHM) addressing UN Sustainable Development Goal 9 (Industry, Innovation, and Infrastructure), Target 9.B.
          </p>
        </section>
      </div>
    </div>
  );
}
