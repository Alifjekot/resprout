export type MaterialCategory = 'agri' | 'food' | 'textile' | 'oil' | 'plastic' | 'other';

export type UserRole = 'maker' | 'admin';

export interface Profile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
}

export interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  description: string;
  typicalCostRangeRm: string;
  isHero: boolean;
  cachedResult?: {
    ideas: Omit<Idea, 'id' | 'scanId' | 'userId' | 'createdAt' | 'saved' | 'score' | 'stage'>[];
  };
}

export interface Scan {
  id: string;
  userId: string;
  imageUrl?: string;
  materialName: string;
  category: MaterialCategory;
  confidence: number;
  materialId?: string;
  notes?: string;
  createdAt: string;
}

export type PlantStage = 'seed' | 'sprout' | 'sapling' | 'tree' | 'forest';

export type ScoreBand = 'Strong' | 'Promising' | 'Needs work' | 'Rethink';

export interface ScoringFactor {
  factor: string;
  weight: number;
  subscore: number;
  explanation: string;
}

export interface ScoringResult {
  score: number;
  band: ScoreBand;
  breakdown: ScoringFactor[];
  stage: PlantStage;
}

export interface Idea {
  id: string;
  scanId: string;
  userId: string;
  name: string;
  description: string;
  technique: string; // SCAMPER
  whyThisWorks: string;
  estStartupCostRm: number;
  demand: number; // 1 to 5
  difficulty: number; // 1 to 5 (5 is hardest)
  sdgImpact: number; // 1 to 5
  co2SavedKgYear: number;
  score: number; // 0 to 100
  stage: PlantStage;
  saved: boolean;
  createdAt: string;
}

export interface PledgePage {
  id: string;
  ideaId: string;
  slug: string;
  headline: string;
  body: string;
  priceHintRm?: number | null;
  isPublished: boolean;
  createdAt: string;
}

export interface Pledge {
  id: string;
  pageId: string;
  name: string;
  email: string;
  quantity: number;
  consent: boolean;
  createdAt: string;
}

export interface AdminMetrics {
  totalUsers: number;
  totalScans: number;
  totalIdeas: number;
  totalPledges: number;
  totalCo2SavedKg: number;
}
