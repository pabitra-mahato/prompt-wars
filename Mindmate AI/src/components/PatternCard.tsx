'use client';

import React from 'react';
import { Eye, Percent, Repeat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Pattern } from '@/types';
import { getMoodColor } from '@/utils/helpers';
import { cn } from '@/lib/utils';

export interface PatternCardProps {
  patterns: Pattern[];
}

export function PatternCard({ patterns }: PatternCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <Eye className="h-4.5 w-4.5" />
          </div>
          <CardTitle className="text-lg font-bold">Identified Patterns</CardTitle>
        </div>
        <CardDescription>Behavioral sequences that regularly result in specific affective states.</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {patterns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">No patterns identified yet. Keep logging daily.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {patterns.map((pattern) => {
              const moodTheme = getMoodColor(pattern.correlatedMood);
              return (
                <div
                  key={pattern.id}
                  className="rounded-xl border border-slate-100 dark:border-slate-800/40 bg-slate-50/40 dark:bg-slate-900/10 p-4 space-y-3 flex flex-col justify-between transition-all hover:bg-slate-50 dark:hover:bg-slate-900/20"
                >
                  <div>
                    {/* Trigger Name */}
                    <h4 className="text-sm font-bold text-slate-850 dark:text-slate-100 mb-1 leading-tight">
                      {pattern.trigger}
                    </h4>
                    
                    {/* Correlated Mood */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-slate-400 font-medium">Correlates to:</span>
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold border",
                        moodTheme.bg,
                        moodTheme.text,
                        moodTheme.border
                      )}>
                        <span>{moodTheme.emoji}</span>
                        <span>{moodTheme.label}</span>
                      </span>
                    </div>
                  </div>

                  {/* Frequency and Confidence Stats */}
                  <div className="flex items-center justify-between border-t border-slate-200/40 dark:border-slate-800/40 pt-3 text-[11px] font-semibold text-slate-500">
                    <div className="flex items-center gap-1">
                      <Repeat className="h-3.5 w-3.5 text-slate-400" />
                      <span>{pattern.occurrenceCount} occurrences</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                      <Percent className="h-3 w-3" />
                      <span>{pattern.confidence}% Confidence</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
