export type ThreeRAction = "reduce" | "reuse" | "recycle";

export interface AnalyzeItemResult {
  itemName: string;
  category: string;
  bestAction: ThreeRAction;
  confidence: number; // 0–1
  explanation: string;
  reduceAdvice: string;
  reuseAdvice: string;
  recycleAdvice: string;
  reuseIdeas: string[];
  environmentalImpact: string;
  localRuleWarning: string;
  /** true when the model could not confidently identify the item */
  uncertain?: boolean;
  /** true when this result is a demo fallback because the real AI call failed */
  isFallback?: boolean;
}

export interface UserAction {
  id: string;
  itemName: string;
  category: string;
  action: ThreeRAction;
  explanation: string;
  createdAt: string; // ISO date
}

export interface ImpactStats {
  totalActions: number;
  reusedCount: number;
  recycledCount: number;
  reducedCount: number;
  challengeDay: number; // 1–7
}

export interface Achievement {
  id: string;
  icon: string;
  label: string;
  description: string;
  isUnlocked: (stats: ImpactStats) => boolean;
}
