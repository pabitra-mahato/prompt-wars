'use client';

import React from 'react';
import { Lightbulb, Moon, Smile, Heart, Users, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Insight } from '@/types';
import { cn } from '@/lib/utils';

export interface InsightsCardProps {
  insights: Insight[];
}

export function InsightsCard({ insights }: InsightsCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sleep':
        return <Moon className="h-4 w-4" />;
      case 'mood':
        return <Smile className="h-4 w-4" />;
      case 'activity':
        return <Heart className="h-4 w-4" />;
      case 'social':
        return <Users className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-emerald-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-rose-500" />;
      default:
        return <RefreshCw className="h-3.5 w-3.5 text-slate-400" />;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <Lightbulb className="h-4.5 w-4.5" />
          </div>
          <CardTitle className="text-lg font-bold">Cognitive Insights</CardTitle>
        </div>
        <CardDescription>AI-discovered patterns and behavioral correlations across your timeline.</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {insights.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">No insights available yet. Submit logs to unlock.</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-100 dark:border-slate-800/40 bg-slate-50/40 dark:bg-slate-900/10 p-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-900/20"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={cn(
                      "flex h-7.5 w-7.5 items-center justify-center rounded-lg border",
                      {
                        "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800/20": insight.category === 'sleep',
                        "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/20": insight.category === 'mood',
                        "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800/20": insight.category === 'activity',
                        "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-800/20": insight.category === 'social',
                      }
                    )}>
                      {getCategoryIcon(insight.category)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-850 dark:text-slate-100 leading-tight">
                        {insight.title}
                      </h4>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                        {insight.category} correlation
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 bg-white dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 px-2 py-0.5 rounded-md">
                    {getTrendIcon(insight.trend)}
                    <span className="text-[10px] font-bold text-slate-500 capitalize">{insight.trend}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed pl-10">
                  {insight.description}
                </p>

                {/* Impact Level Bar */}
                <div className="flex items-center gap-3 pl-10 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Impact Rating</span>
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full bg-emerald-500",
                        insight.impactScore > 7 ? "bg-emerald-500" : "bg-teal-500"
                      )}
                      style={{ width: `${insight.impactScore * 10}%` }}
                    />
                  </div>
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
                    {insight.impactScore}/10
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
