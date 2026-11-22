import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { PledgePage } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idea_id } = body;

    if (!idea_id) {
      return NextResponse.json({ error: 'idea_id is required' }, { status: 400 });
    }

    const idea = store.getIdeaById(idea_id);
    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    // Check if pledge page already exists
    const existing = store.getPledgePageByIdeaId(idea_id);
    if (existing) {
      return NextResponse.json({ page: existing });
    }

    // Generate unique slug
    const baseSlug = idea.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

    // Create draft page
    const page: PledgePage = {
      id: `page-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ideaId: idea_id,
      slug,
      headline: `Support ${idea.name} — Sustainable Waste Innovation`,
      body: `We are validating demand for ${idea.name}. ${idea.description} By upcycling local waste, this initiative saves an estimated ${idea.co2SavedKgYear} kg of CO₂ per year and supports SDG 9.B. Pledge your interest to help us launch!`,
      priceHintRm: Math.max(10, Math.round(idea.estStartupCostRm / 200)),
      isPublished: false,
      createdAt: new Date().toISOString(),
    };

    store.createPledgePage(page);

    return NextResponse.json({ page });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to initialize pledge page.' },
      { status: 500 }
    );
  }
}
