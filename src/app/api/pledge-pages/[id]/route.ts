import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { calculateStage } from '@/lib/scoring';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { headline, body: pageBody, price_hint_rm, is_published } = body;

    const page = store.getPledgePageById(id);
    if (!page) {
      return NextResponse.json({ error: 'Pledge page not found' }, { status: 404 });
    }

    const updates: any = {};
    if (headline !== undefined) updates.headline = headline;
    if (pageBody !== undefined) updates.body = pageBody;
    if (price_hint_rm !== undefined) updates.priceHintRm = Number(price_hint_rm);
    if (is_published !== undefined) updates.isPublished = Boolean(is_published);

    const updated = store.updatePledgePage(id, updates);

    // If publishing, evaluate idea stage advancement to 'sapling'
    if (updates.isPublished && page.ideaId) {
      const idea = store.getIdeaById(page.ideaId);
      if (idea) {
        const pledges = store.getPledgesByPageId(page.id);
        const nextStage = calculateStage(
          idea.stage,
          idea.score,
          true,
          pledges.length,
          Number(process.env.PLEDGE_TARGET_TREE) || 10,
          Number(process.env.PLEDGE_TARGET_FOREST) || 50
        );

        if (nextStage !== idea.stage) {
          store.updateIdea(idea.id, { stage: nextStage });
        }
      }
    }

    return NextResponse.json({ page: updated });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to update pledge page.' },
      { status: 500 }
    );
  }
}
