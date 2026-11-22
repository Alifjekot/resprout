import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { getOrCreateMakerGuide } from '@/lib/guides';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ideaId = searchParams.get('idea_id');

    if (!ideaId) {
      return NextResponse.json({ error: 'idea_id is required' }, { status: 400 });
    }

    const idea = store.getIdeaById(ideaId);
    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    const scan = store.getScanById(idea.scanId);
    const materialName = scan?.materialName || 'Coconut husk';
    const category = scan?.category || 'agri';

    const guide = getOrCreateMakerGuide(
      idea.id,
      idea.name,
      materialName,
      category,
      idea.estStartupCostRm,
      idea.difficulty
    );

    return NextResponse.json({ guide });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to generate maker guide.' },
      { status: 500 }
    );
  }
}
