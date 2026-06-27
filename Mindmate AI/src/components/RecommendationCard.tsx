'use client';

import React from 'react';
import { Compass, CheckCircle2, Circle, Clock, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Recommendation } from '@/types';
import { cn } from '@/lib/utils';

export interface RecommendationCardProps {
  recommendations: Recommendation[];
  onToggle: (id: string) => void;
}

export function RecommendationCard({ recommendations, onToggle }: RecommendationCardProps) {
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'meditation':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400 border-purple-100 dark:border-purple-800/30';
      case 'exercise':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100 dark:border-rose-800/30';
      case 'journaling':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100 dark:border-amber-800/30';
      case 'breathing':
        return 'bg-sky-50 text-sky-700 dark:bg-sky-950/20 dark:text-sky-400 border-sky-100 dark:border-sky-800/30';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-950/20 dark:text-slate-400 border-slate-100 dark:border-slate-800/30';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <Compass className="h-4.5 w-4.5" />
          </div>
          <CardTitle className="text-lg font-bold">Self-Care Navigator</CardTitle>
        </div>
        <CardDescription>Tailored clinical activities to optimize today&apos;s mood and relieve tension.</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {recommendations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">No active recommendations. You are fully charged!</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                onClick={() => onToggle(rec.id)}
                className={cn(
                  "flex items-start gap-3.5 rounded-xl border p-4 cursor-pointer select-none transition-all duration-200",
                  rec.completed
                    ? "bg-slate-50/50 dark:bg-slate-900/10 border-slate-200/50 dark:border-slate-800/50 opacity-65"
                    : "bg-white dark:bg-slate-950 border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-sm"
                )}
              >
                {/* Checkbox Icon */}
                <button
                  type="button"
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full mt-0.5 transition-colors focus:outline-none",
                    rec.completed ? "text-emerald-500" : "text-slate-300 dark:text-slate-700 hover:text-emerald-500"
                  )}
                >
                  {rec.completed ? (
                    <CheckCircle2 className="h-5 w-5 fill-emerald-100 dark:fill-emerald-950/20" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={cn(
                      "text-xs font-semibold leading-none tracking-tight",
                      rec.completed ? "line-through text-slate-400 dark:text-slate-550" : "text-slate-900 dark:text-slate-50"
                    )}>
                      {rec.title}
                    </span>
                    <span className={cn(
                      "inline-flex items-center rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border",
                      getCategoryTheme(rec.category)
                    )}>
                      {rec.category}
                    </span>
                  </div>

                  <p className={cn(
                    "text-xs leading-relaxed",
                    rec.completed ? "line-through text-slate-400 dark:text-slate-550" : "text-slate-600 dark:text-slate-350"
                  )}>
                    {rec.description}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center gap-3 pt-1 text-[10px] font-semibold text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{rec.durationMinutes} min</span>
                    </div>
                    <div className="flex items-center gap-1 capitalize">
                      <Flame className="h-3.5 w-3.5" />
                      <span>{rec.difficulty} difficulty</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
