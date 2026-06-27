import React from 'react';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
            &copy; {new Date().getFullYear()} MindMate AI. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span>Built with</span>
            <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500 animate-pulse" />
            <span>for mental wellness</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
