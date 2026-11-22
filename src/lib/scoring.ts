import { PlantStage, ScoreBand, ScoringFactor, ScoringResult } from './types';

export interface ScoreInputs {
  demand: number; // 1 to 5
  estStartupCostRm: number;
  difficulty: number; // 1 to 5
  sdgImpact: number; // 1 to 5
  co2SavedKgYear: number;
}

export function computeCostSubscore(costRm: number): number {
  if (costRm <= 1000) return 5;
  if (costRm <= 5000) return 4;
  if (costRm <= 15000) return 3;
  if (costRm <= 30000) return 2;
  return 1;
}

export function computeCo2Subscore(co2Kg: number): number {
  if (co2Kg >= 1000) return 5;
  if (co2Kg >= 500) return 4;
  if (co2Kg >= 100) return 3;
  if (co2Kg >= 20) return 2;
  return 1;
}

export function computeScore(inputs: ScoreInputs, currentStage: PlantStage = 'seed'): ScoringResult {
  // Clamp & parse inputs
  const demand = Math.min(5, Math.max(1, Math.round(inputs.demand)));
  const costSub = computeCostSubscore(inputs.estStartupCostRm);
  const difficulty = Math.min(5, Math.max(1, Math.round(inputs.difficulty)));
  const easeSub = 6 - difficulty; // Ease = 6 - difficulty
  const sdgSub = Math.min(5, Math.max(1, Math.round(inputs.sdgImpact)));
  const co2Sub = computeCo2Subscore(inputs.co2SavedKgYear);

  const breakdown: ScoringFactor[] = [
    {
      factor: 'Demand',
      weight: 30,
      subscore: demand,
      explanation: `Market interest rated ${demand}/5 (30% weight). Higher means easier early sales.`,
    },
    {
      factor: 'Startup cost',
      weight: 20,
      subscore: costSub,
      explanation: `Est. RM ${inputs.estStartupCostRm.toLocaleString()} scored ${costSub}/5 (20% weight). Lower capital earns higher points.`,
    },
    {
      factor: 'Ease',
      weight: 15,
      subscore: easeSub,
      explanation: `Difficulty ${difficulty}/5 gives ease rating ${easeSub}/5 (15% weight). Simpler processing scales faster.`,
    },
    {
      factor: 'SDG impact',
      weight: 20,
      subscore: sdgSub,
      explanation: `SDG 9.B alignment scored ${sdgSub}/5 (20% weight). Upcycling waste into high-value product.`,
    },
    {
      factor: 'CO2 saved',
      weight: 15,
      subscore: co2Sub,
      explanation: `${inputs.co2SavedKgYear.toLocaleString()} kg CO₂/yr scored ${co2Sub}/5 (15% weight). Clean lifecycle diversion.`,
    },
  ];

  // score = round( sum( weight_i * subscore_i / 5 ) )
  const weightedSum = breakdown.reduce((acc, item) => acc + (item.weight * item.subscore) / 5, 0);
  const score = Math.round(weightedSum);

  let band: ScoreBand = 'Rethink';
  if (score >= 80) {
    band = 'Strong';
  } else if (score >= 60) {
    band = 'Promising';
  } else if (score >= 40) {
    band = 'Needs work';
  }

  // Stage advancement rule:
  // If score >= 60 and current stage is 'seed', upgrade to 'sprout'
  let stage: PlantStage = currentStage;
  if (score >= 60 && stage === 'seed') {
    stage = 'sprout';
  }

  return {
    score,
    band,
    breakdown,
    stage,
  };
}

// Stage determination based on score, page published, and pledges count
export function calculateStage(
  currentStage: PlantStage,
  score: number,
  isPledgePagePublished: boolean,
  pledgeCount: number,
  targetTree = 10,
  targetForest = 50
): PlantStage {
  const STAGE_ORDER: Record<PlantStage, number> = {
    seed: 1,
    sprout: 2,
    sapling: 3,
    tree: 4,
    forest: 5,
  };

  let computedStage: PlantStage = 'seed';
  if (pledgeCount >= targetForest) {
    computedStage = 'forest';
  } else if (pledgeCount >= targetTree) {
    computedStage = 'tree';
  } else if (isPledgePagePublished) {
    computedStage = 'sapling';
  } else if (score >= 60) {
    computedStage = 'sprout';
  }

  // Rule: Stage can only go up, never down!
  if (STAGE_ORDER[computedStage] > STAGE_ORDER[currentStage]) {
    return computedStage;
  }
  return currentStage;
}

export function getProgressHint(stage: PlantStage, pledgeCount: number, targetTree = 10, targetForest = 50): string {
  switch (stage) {
    case 'seed':
      return 'Score 60+ to sprout your idea.';
    case 'sprout':
      return 'Publish a pledge page to grow into a Sapling.';
    case 'sapling': {
      const remaining = Math.max(1, targetTree - pledgeCount);
      return `${remaining} more pledge${remaining === 1 ? '' : 's'} to become a Tree.`;
    }
    case 'tree': {
      const remaining = Math.max(1, targetForest - pledgeCount);
      return `${remaining} more pledge${remaining === 1 ? '' : 's'} to build a Forest community.`;
    }
    case 'forest':
      return 'Thriving Forest! Sustainable venture validated.';
    default:
      return '';
  }
}
