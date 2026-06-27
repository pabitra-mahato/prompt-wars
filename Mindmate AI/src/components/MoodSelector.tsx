'use client';

import React from 'react';
import { MoodType, MoodOption } from '@/types';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const moodOptions: MoodOption[] = [
  { id: 'happy', label: 'Happy', emoji: '😊', color: 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/10 dark:text-emerald-400 dark:hover:bg-emerald-950/20', score: 9 },
  { id: 'energetic', label: 'Energetic', emoji: '😀', color: 'border-amber-200 bg-amber-50/50 hover:bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/10 dark:text-amber-450 dark:hover:bg-amber-950/20', score: 8 },
  { id: 'neutral', label: 'Neutral', emoji: '😐', color: 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-700 dark:border-slate-805/50 dark:bg-slate-900/10 dark:text-slate-400 dark:hover:bg-slate-900/20', score: 5 },
  { id: 'down', label: 'Down', emoji: '😔', color: 'border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/10 dark:text-indigo-400 dark:hover:bg-indigo-950/20', score: 4 },
  { id: 'sad', label: 'Sad', emoji: '😢', color: 'border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/10 dark:text-blue-400 dark:hover:bg-blue-950/20', score: 3 },
  { id: 'angry', label: 'Angry', emoji: '😡', color: 'border-rose-200 bg-rose-50/50 hover:bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/10 dark:text-rose-450 dark:hover:bg-rose-950/20', score: 2 },
  { id: 'anxious', label: 'Anxious', emoji: '😰', color: 'border-purple-200 bg-purple-50/50 hover:bg-purple-50 text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/10 dark:text-purple-400 dark:hover:bg-purple-950/20', score: 4 },
];

export interface MoodSelectorProps {
  selectedMood: MoodType | null;
  selectedScore: number;
  onMoodChange: (mood: MoodType) => void;
  onScoreChange: (score: number) => void;
}

export function MoodSelector({
  selectedMood,
  selectedScore,
  onMoodChange,
  onScoreChange,
}: MoodSelectorProps) {
  const getScoreDescription = (val: number) => {
    if (val <= 3) return 'Low energy / mood';
    if (val <= 6) return 'Moderate energy / mood';
    if (val <= 8) return 'Good & balanced';
    return 'Optimal & thriving';
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold">How are you feeling?</CardTitle>
        <CardDescription>Select a mood archetype and evaluate your baseline energy level.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Grid */}
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {moodOptions.map((opt) => {
            const isSelected = selectedMood === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onMoodChange(opt.id)}
                className={cn(
                  "flex flex-col items-center justify-center rounded-xl p-3.5 border transition-all duration-200 active:scale-[0.96]",
                  opt.color,
                  isSelected 
                    ? "ring-2 ring-emerald-500 scale-[1.03] border-emerald-400 dark:border-emerald-600 shadow-sm" 
                    : "border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/10"
                )}
              >
                <span className="text-3xl mb-1.5 filter drop-shadow-sm select-none">{opt.emoji}</span>
                <span className="text-xs font-semibold tracking-wide">{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Score Slider */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label htmlFor="mood-score-slider" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Mood / Energy Score
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 italic">
                {getScoreDescription(selectedScore)}
              </span>
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500 text-sm font-bold text-white shadow-sm shadow-emerald-500/10">
                {selectedScore}
              </span>
            </div>
          </div>
          
          <input
            id="mood-score-slider"
            type="range"
            min="1"
            max="10"
            step="1"
            value={selectedScore}
            onChange={(e) => onScoreChange(parseInt(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 dark:bg-slate-800 accent-emerald-600 transition-colors focus:outline-none"
          />
          
          <div className="flex justify-between px-1 text-[10px] font-medium text-slate-400">
            <span>1 (Very Low)</span>
            <span>5 (Moderate)</span>
            <span>10 (Optimal)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
