import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { Idea } from '@/lib/types';
import { HERO_MATERIALS } from '@/lib/seed';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scan_id, context } = body;

    if (!scan_id) {
      return NextResponse.json({ error: 'scan_id is required' }, { status: 400 });
    }

    const scan = store.getScanById(scan_id);
    const materialName = scan?.materialName || 'Coconut husk';
    const category = scan?.category || 'agri';
    const userId = scan?.userId || 'usr-demo-maker';

    // Check if hero material cached ideas exist
    const matchedHero = store.findMaterialByName(materialName);
    let ideasPayload: Array<Omit<Idea, 'id' | 'scanId' | 'userId' | 'createdAt' | 'saved' | 'score' | 'stage'>> = [];

    if (matchedHero && matchedHero.cachedResult?.ideas?.length) {
      ideasPayload = matchedHero.cachedResult.ideas;
    } else {
      // Dynamic fallback SCAMPER generation
      ideasPayload = [
        {
          name: `Biodegradable ${materialName} composite packaging`,
          description: `Pressing ${materialName} into custom eco-moulded packaging cushions.`,
          technique: 'Substitute',
          whyThisWorks: `Replaces expanded polystyrene with 100% natural ${materialName}.`,
          estStartupCostRm: 4500,
          demand: 4,
          difficulty: 2,
          sdgImpact: 5,
          co2SavedKgYear: 750,
        },
        {
          name: `Craft artisan ${materialName} household tiles`,
          description: `Binding ${materialName} with local natural resins for wall panels.`,
          technique: 'Combine',
          whyThisWorks: `Urban eco-cafes demand rustic textured finishes.`,
          estStartupCostRm: 6200,
          demand: 4,
          difficulty: 3,
          sdgImpact: 4,
          co2SavedKgYear: 580,
        },
        {
          name: `Bio-fertilizer pellets from fermented ${materialName}`,
          description: `Composting and pelletizing ${materialName} with organic minerals for home gardeners.`,
          technique: 'Modify',
          whyThisWorks: `Provides slow-release organic nutrients to Malaysian tropical soils.`,
          estStartupCostRm: 3200,
          demand: 5,
          difficulty: 2,
          sdgImpact: 5,
          co2SavedKgYear: 920,
        },
        {
          name: `Industrial absorption sponges using ${materialName}`,
          description: `Treated ${materialName} absorbent pads for oil and chemical spills.`,
          technique: 'Put to another use',
          whyThisWorks: `Workshops require inexpensive, high-absorbency natural materials.`,
          estStartupCostRm: 5000,
          demand: 4,
          difficulty: 2,
          sdgImpact: 4,
          co2SavedKgYear: 610,
        },
        {
          name: `Zero-waste starter seedling pots from ${materialName}`,
          description: `Potted nursery starters planted directly into ground.`,
          technique: 'Eliminate',
          whyThisWorks: `Eliminates black single-use plastic nursery polybags entirely.`,
          estStartupCostRm: 2800,
          demand: 4,
          difficulty: 1,
          sdgImpact: 5,
          co2SavedKgYear: 840,
        },
      ];
    }

    // Convert into full Idea entities
    const createdIdeas: Idea[] = ideasPayload.slice(0, 5).map((item, index) => ({
      id: `idea-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
      scanId: scan_id,
      userId,
      name: item.name,
      description: item.description,
      technique: item.technique,
      whyThisWorks: item.whyThisWorks,
      estStartupCostRm: item.estStartupCostRm,
      demand: item.demand,
      difficulty: item.difficulty,
      sdgImpact: item.sdgImpact,
      co2SavedKgYear: item.co2SavedKgYear,
      score: 0,
      stage: 'seed',
      saved: false,
      createdAt: new Date().toISOString(),
    }));

    store.addIdeas(createdIdeas);

    return NextResponse.json({
      ideas: createdIdeas.map((idea) => ({
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
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to generate ideas. Please try again.' },
      { status: 500 }
    );
  }
}
