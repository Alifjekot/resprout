import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { computeScore } from '@/lib/scoring';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idea_id, overrides } = body;

    if (!idea_id) {
      return NextResponse.json({ error: 'idea_id is required' }, { status: 400 });
    }

    const idea = store.getIdeaById(idea_id);
    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }

    // Apply any interactive user slider overrides
    const demand = overrides?.demand !== undefined ? Number(overrides.demand) : idea.demand;
    const estStartupCostRm = overrides?.cost !== undefined ? Number(overrides.cost) : idea.estStartupCostRm;
    const difficulty = overrides?.difficulty !== undefined ? Number(overrides.difficulty) : idea.difficulty;
    const sdgImpact = overrides?.sdg !== undefined ? Number(overrides.sdg) : idea.sdgImpact;
    const co2SavedKgYear = overrides?.co2 !== undefined ? Number(overrides.co2) : idea.co2SavedKgYear;

    const scoringResult = computeScore(
      {
        demand,
        estStartupCostRm,
        difficulty,
        sdgImpact,
        co2SavedKgYear,
      },
      idea.stage
    );

    // Save score and potential stage upgrade in store
    store.updateIdea(idea_id, {
      score: scoringResult.score,
      stage: scoringResult.stage,
      demand,
      estStartupCostRm,
      difficulty,
      sdgImpact,
      co2SavedKgYear,
    });

    return NextResponse.json({
      idea_id,
      score: scoringResult.score,
      band: scoringResult.band,
      breakdown: scoringResult.breakdown.map((b) => ({
        factor: b.factor,
        weight: b.weight,
        subscore: b.subscore,
        explanation: b.explanation,
      })),
      stage: scoringResult.stage,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to compute validation score.' },
      { status: 500 }
    );
  }
}
