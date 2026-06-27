'use client';

import { useState, useCallback } from 'react';
import { 
  JournalEntry, 
  MoodType, 
  StressData, 
  Insight, 
  Pattern, 
  Recommendation, 
  ProgressDataPoint 
} from '@/types';

// Mock Initial Data
const initialEntries: JournalEntry[] = [
  {
    id: '1',
    text: 'Had a productive coding session today, feeling accomplished and stable. Spent some time walking in the park.',
    createdAt: '2026-06-25T14:30:00Z',
    mood: 'happy',
    moodScore: 8,
    tags: ['work', 'nature', 'productivity'],
  },
  {
    id: '2',
    text: 'Felt a bit anxious before the team presentation, but deep breathing exercises helped me ground myself.',
    createdAt: '2026-06-26T09:15:00Z',
    mood: 'anxious',
    moodScore: 5,
    tags: ['presentation', 'breathing', 'stress'],
  },
  {
    id: '3',
    text: 'Had a very relaxing evening reading my favorite novel. Sleep quality was also amazing.',
    createdAt: '2026-06-27T21:00:00Z',
    mood: 'neutral',
    moodScore: 9,
    tags: ['reading', 'sleep', 'relaxing'],
  },
];

const initialStress: StressData = {
  level: 'moderate',
  score: 48,
  triggers: ['Public Speaking', 'Tight Deadlines', 'Lack of Sleep'],
  symptoms: ['Increased Heart Rate', 'Mind Racing', 'Shoulder Tension'],
};

const initialInsights: Insight[] = [
  {
    id: 'ins-1',
    title: 'Sleep and Mood Correlation',
    description: 'When you get more than 7.5 hours of sleep, your average happiness score increases by 25%.',
    category: 'sleep',
    trend: 'improving',
    impactScore: 9,
    createdAt: '2026-06-27T08:00:00Z',
  },
  {
    id: 'ins-2',
    title: 'Screen Time Impact',
    description: 'Late-night screen usage correlates with a higher fatigue score the following morning.',
    category: 'activity',
    trend: 'declining',
    impactScore: 7,
    createdAt: '2026-06-26T18:00:00Z',
  },
];

const initialPatterns: Pattern[] = [
  {
    id: 'pat-1',
    trigger: 'Caffeine after 3 PM',
    occurrenceCount: 5,
    correlatedMood: 'anxious',
    confidence: 85,
  },
  {
    id: 'pat-2',
    trigger: 'Morning Walk',
    occurrenceCount: 8,
    correlatedMood: 'happy',
    confidence: 90,
  },
];

const initialRecommendations: Recommendation[] = [
  {
    id: 'rec-1',
    title: '4-7-8 Breathing Technique',
    description: 'Inhale for 4 seconds, hold for 7, exhale for 8 to settle your nervous system.',
    durationMinutes: 5,
    difficulty: 'easy',
    category: 'breathing',
    completed: false,
  },
  {
    id: 'rec-2',
    title: 'Reflective Journaling',
    description: 'Write about three positive things that occurred today and why they happened.',
    durationMinutes: 10,
    difficulty: 'easy',
    category: 'journaling',
    completed: false,
  },
  {
    id: 'rec-3',
    title: 'Mindful Body Scan',
    description: 'Slowly focus attention on different parts of your body to release stored tension.',
    durationMinutes: 15,
    difficulty: 'medium',
    category: 'meditation',
    completed: true,
  },
];

const initialProgress: ProgressDataPoint[] = [
  { date: 'Jun 21', moodScore: 7, stressScore: 60, sleepHours: 6.5, studyHours: 4.5, burnoutScore: 55 },
  { date: 'Jun 22', moodScore: 8, stressScore: 40, sleepHours: 7.0, studyHours: 5.0, burnoutScore: 35 },
  { date: 'Jun 23', moodScore: 6, stressScore: 55, sleepHours: 6.0, studyHours: 5.5, burnoutScore: 50 },
  { date: 'Jun 24', moodScore: 9, stressScore: 30, sleepHours: 8.0, studyHours: 4.0, burnoutScore: 25 },
  { date: 'Jun 25', moodScore: 8, stressScore: 35, sleepHours: 7.5, studyHours: 6.0, burnoutScore: 30 },
  { date: 'Jun 26', moodScore: 5, stressScore: 50, sleepHours: 6.2, studyHours: 7.0, burnoutScore: 45 },
  { date: 'Jun 27', moodScore: 9, stressScore: 25, sleepHours: 8.2, studyHours: 3.5, burnoutScore: 20 },
];

export function useMindState() {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [stress] = useState<StressData>(initialStress);
  const [insights] = useState<Insight[]>(initialInsights);
  const [patterns] = useState<Pattern[]>(initialPatterns);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(initialRecommendations);
  const [progress, setProgress] = useState<ProgressDataPoint[]>(initialProgress);

  const addJournalEntry = useCallback((text: string, mood: MoodType, moodScore: number, tags: string[]) => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      text,
      createdAt: new Date().toISOString(),
      mood,
      moodScore,
      tags,
    };
    setEntries((prev) => [newEntry, ...prev]);

    // Update progress chart point for today
    const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    setProgress((prev) => {
      const existsIdx = prev.findIndex((p) => p.date === todayStr);
      if (existsIdx > -1) {
        const updated = [...prev];
        updated[existsIdx] = {
          ...updated[existsIdx],
          moodScore: (updated[existsIdx].moodScore + moodScore) / 2, // simple moving average
        };
        return updated;
      } else {
        return [...prev, {
          date: todayStr,
          moodScore,
          stressScore: stress.score,
          sleepHours: 7.5,
          studyHours: 4.0,
          burnoutScore: stress.score * 0.7 + 10,
        }];
      }
    });
  }, [stress.score]);

  const toggleRecommendation = useCallback((id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, completed: !rec.completed } : rec))
    );
  }, []);

  return {
    entries,
    stress,
    insights,
    patterns,
    recommendations,
    progress,
    addJournalEntry,
    toggleRecommendation,
  };
}
