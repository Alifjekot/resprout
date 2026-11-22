import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const page = store.getPledgePageBySlug(slug);

    if (!page || !page.isPublished) {
      return NextResponse.json(
        { error: 'Pledge page not found or is currently unpublished.' },
        { status: 404 }
      );
    }

    const idea = store.getIdeaById(page.ideaId);
    const pledges = store.getPledgesByPageId(page.id);

    // Security requirement: Personal supporter emails are NEVER exposed on the public page!
    return NextResponse.json({
      page: {
        id: page.id,
        slug: page.slug,
        headline: page.headline,
        body: page.body,
        price_hint_rm: page.priceHintRm,
        created_at: page.createdAt,
      },
      idea: idea
        ? {
            name: idea.name,
            description: idea.description,
            technique: idea.technique,
            sdg_impact: idea.sdgImpact,
            co2_saved_kg_year: idea.co2SavedKgYear,
            stage: idea.stage,
          }
        : null,
      pledge_count: pledges.reduce((acc, p) => acc + (p.quantity || 1), 0),
      pledge_target_tree: Number(process.env.PLEDGE_TARGET_TREE) || 10,
      pledge_target_forest: Number(process.env.PLEDGE_TARGET_FOREST) || 50,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to load public pledge page.' },
      { status: 500 }
    );
  }
}
