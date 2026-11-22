import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { getProgressHint } from '@/lib/scoring';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id') || 'usr-demo-maker';

    const savedIdeas = store.getSavedIdeas(userId);

    const targetTree = Number(process.env.PLEDGE_TARGET_TREE) || 10;
    const targetForest = Number(process.env.PLEDGE_TARGET_FOREST) || 50;

    const formattedIdeas = savedIdeas.map((idea) => {
      const page = store.getPledgePageByIdeaId(idea.id);
      const pledges = page ? store.getPledgesByPageId(page.id) : [];
      const pledgeCount = pledges.reduce((acc, p) => acc + (p.quantity || 1), 0);
      const progressHint = getProgressHint(idea.stage, pledgeCount, targetTree, targetForest);

      return {
        id: idea.id,
        name: idea.name,
        description: idea.description,
        technique: idea.technique,
        why_this_works: idea.whyThisWorks,
        est_startup_cost_rm: idea.estStartupCostRm,
        demand: idea.demand,
        difficulty: idea.difficulty,
        sdg_impact: idea.sdgImpact,
        co2_saved_kg_year: idea.co2SavedKgYear,
        score: idea.score,
        stage: idea.stage,
        pledge_count: pledgeCount,
        progress_hint: progressHint,
        pledge_page: page
          ? {
              id: page.id,
              slug: page.slug,
              headline: page.headline,
              body: page.body,
              price_hint_rm: page.priceHintRm,
              is_published: page.isPublished,
              // Only supporter names are exposed to Maker, no emails on screen
              supporters: pledges.map((p) => ({
                id: p.id,
                name: p.name,
                email: p.email,
                quantity: p.quantity,
                created_at: p.createdAt,
              })),
            }
          : null,
      };
    });

    const totalCo2 = formattedIdeas.reduce((sum, item) => sum + (item.co2_saved_kg_year || 0), 0);
    const totalPledges = formattedIdeas.reduce((sum, item) => sum + item.pledge_count, 0);

    return NextResponse.json({
      ideas: formattedIdeas,
      stats: {
        total_ideas: formattedIdeas.length,
        total_pledges: totalPledges,
        total_co2_kg_year: totalCo2,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to load Garden.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idea_id, saved = true } = body;

    if (!idea_id) {
      return NextResponse.json({ error: 'idea_id is required' }, { status: 400 });
    }

    const updated = store.updateIdea(idea_id, { saved: Boolean(saved) });
    if (!updated) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    return NextResponse.json({ idea: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to save idea to garden.' },
      { status: 500 }
    );
  }
}
