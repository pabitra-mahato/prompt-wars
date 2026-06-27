'use client';

import React from 'react';
import { ShieldAlert, AlertCircle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StressData } from '@/types';
import { getStressBadgeColor } from '@/utils/helpers';
import { cn } from '@/lib/utils';

export interface StressCardProps {
  data: StressData;
}

export function StressCard({ data }: StressCardProps) {
  const getGaugeColor = (score: number) => {
    if (score < 30) return 'from-emerald-500 to-teal-400';
    if (score < 65) return 'from-amber-500 to-orange-400';
    return 'from-rose-500 to-red-400';
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
              <ShieldAlert className="h-4.5 w-4.5" />
            </div>
            <CardTitle className="text-lg font-bold">Stress Baseline</CardTitle>
          </div>
          <span className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider border",
            getStressBadgeColor(data.level)
          )}>
            {data.level}
          </span>
        </div>
        <CardDescription>Estimated autonomic nervous system load based on recent entries.</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Stress score progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
            <span>Relaxed</span>
            <span>Autonomic Load: {data.score}%</span>
            <span>Overloaded</span>
          </div>
          <div className="h-3.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5">
            <div
              className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", getGaugeColor(data.score))}
              style={{ width: `${data.score}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Triggers list */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              <AlertCircle className="h-3.5 w-3.5 text-slate-400" />
              <span>Core Triggers</span>
            </div>
            <ul className="space-y-1.5">
              {data.triggers.map((trigger) => (
                <li
                  key={trigger}
                  className="text-xs font-medium text-slate-700 dark:text-slate-350 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/40 rounded-lg px-2.5 py-1.5"
                >
                  {trigger}
                </li>
              ))}
            </ul>
          </div>

          {/* Symptoms list */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-slate-400" />
              <span>Manifestations</span>
            </div>
            <ul className="space-y-1.5">
              {data.symptoms.map((symptom) => (
                <li
                  key={symptom}
                  className="text-xs font-medium text-slate-700 dark:text-slate-350 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/40 rounded-lg px-2.5 py-1.5"
                >
                  {symptom}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
