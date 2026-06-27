'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'list' | 'chart' | 'generic';
  count?: number;
}

export function LoadingSkeleton({
  className,
  variant = 'generic',
  count = 1,
}: LoadingSkeletonProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-950/40 p-6 space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-1/3 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-1/2 rounded bg-slate-100 dark:bg-slate-900" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3.5 w-full rounded bg-slate-150 dark:bg-slate-900" />
              <div className="h-3.5 w-5/6 rounded bg-slate-150 dark:bg-slate-900" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-16 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-6 w-20 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
        );

      case 'list':
        return (
          <div className="space-y-3.5 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 border border-slate-100 dark:border-slate-800/40 rounded-xl p-4 bg-slate-50/40 dark:bg-slate-900/10">
                <div className="h-6 w-6 rounded bg-slate-200 dark:bg-slate-800 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
                  <div className="h-3 w-5/6 rounded bg-slate-100 dark:bg-slate-900" />
                </div>
              </div>
            ))}
          </div>
        );

      case 'chart':
        return (
          <div className="rounded-2xl border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-950/40 p-6 space-y-6 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="space-y-2 flex-1">
                <div className="h-4 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-2/5 rounded bg-slate-100 dark:bg-slate-900" />
              </div>
              <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
            </div>
            {/* Mock Chart Lines */}
            <div className="relative aspect-[22/7] min-h-[160px] border-b border-l border-slate-150 dark:border-slate-800/60 flex items-end justify-between px-4 pb-2">
              {[60, 40, 80, 50, 70, 30, 90].map((h, i) => (
                <div
                  key={i}
                  className="w-[10%] rounded-t bg-slate-200 dark:bg-slate-800/60"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3.5 w-full rounded bg-slate-150 dark:bg-slate-900" />
            <div className="h-3.5 w-5/6 rounded bg-slate-150 dark:bg-slate-900" />
          </div>
        );
    }
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      {[...Array(count)].map((_, i) => (
        <React.Fragment key={i}>
          {renderSkeleton()}
        </React.Fragment>
      ))}
    </div>
  );
}
