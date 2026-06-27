export type MoodType = 'happy' | 'energetic' | 'neutral' | 'down' | 'sad' | 'angry' | 'anxious';

export interface MoodOption {
  id: MoodType;
  label: string;
  emoji: string;
  color: string;
  score: number; // 1 to 10 scale
}

export interface JournalEntry {
  id: string;
  text: string;
  createdAt: string;
  mood: MoodType;
  moodScore: number;
  tags: string[];
}

export interface StressData {
  level: 'low' | 'moderate' | 'high' | 'severe';
  score: number; // 0 to 100
  triggers: string[];
  symptoms: string[];
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  category: 'mood' | 'sleep' | 'activity' | 'social';
  trend: 'improving' | 'declining' | 'stable';
  impactScore: number; // 1 to 10 impact rating
  createdAt: string;
}

export interface Pattern {
  id: string;
  trigger: string;
  occurrenceCount: number;
  correlatedMood: MoodType;
  confidence: number; // percentage 0-100
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'meditation' | 'exercise' | 'journaling' | 'breathing' | 'cognitive';
  completed: boolean;
}

export interface ProgressDataPoint {
  date: string;
  moodScore: number;
  stressScore: number;
  sleepHours: number;
  studyHours: number;
  burnoutScore: number;
}

export interface InsightsEngineResult {
  repeatedEmotions: string;
  repeatedStressTriggers: string[];
  improvingTrends: string;
  negativeTrends: string;
  burnoutWarning: string;
  studyHabitsAnalysis: string;
}

export interface RecommendationItem {
  recommendation: string;
  explanation: string;
  category: 'stress' | 'sleep' | 'burnout' | 'study' | 'general';
}

export interface SafetyLayerResult {
  concerningLanguageDetected: boolean;
  supportiveMessage: string;
}

export interface AnalysisResult {
  overallMoodScore: number;
  stressScore: number;
  emotionalPattern: string;
  hiddenStressTriggers: string[];
  burnoutRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  positiveBehaviors: string[];
  areasOfConcern: string[];
  personalizedCopingStrategies: string[];
  motivationalMessage: string;
  todaysWellnessGoal: string;
  threeMinuteMindfulnessExercise: string;
  studyRecommendation: string;
  confidenceScore: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  insightsEngine: InsightsEngineResult;
  recommendationsList: RecommendationItem[];
  safetyLayer: SafetyLayerResult;
}
export interface WellnessFormData {
  mood: MoodType;
  stressLevel: number;
  sleepHours: number;
  examName?: string;
  daysRemaining?: number;
  journalEntry: string;
  studyHours: number;
  screenTime: number;
}
