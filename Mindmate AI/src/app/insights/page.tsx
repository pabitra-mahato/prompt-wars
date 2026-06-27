import type { Metadata } from 'next';
import { BrainCircuit, TrendingUp, TrendingDown, AlertTriangle, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Insights — MindMate AI',
  description: 'Review your personalized wellness patterns, emotional trends, and comparative burnout analysis over time.',
};

const insights = [
  {
    icon: TrendingUp,
    color: 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400',
    trend: 'improving',
    title: 'Sleep & Mood Correlation',
    description: 'When you maintain 7.5+ hours of sleep, your average mood score increases by 25% the following day. Sleep is your most impactful recovery lever.',
    metric: '+25% mood uplift',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800',
    badgeLabel: 'Improving',
  },
  {
    icon: AlertTriangle,
    color: 'bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
    trend: 'declining',
    title: 'Screen Time Impact',
    description: 'Late-night screen usage above 6 hours correlates with elevated morning fatigue scores and reduced study retention the next day.',
    metric: '−18% retention',
    badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800',
    badgeLabel: 'Needs Attention',
  },
  {
    icon: BarChart2,
    color: 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
    trend: 'stable',
    title: 'Study Efficiency Patterns',
    description: 'Your cognitive output peaks between 9–11 AM and 4–6 PM. Scheduling complex subjects during these windows boosts active recall by up to 30%.',
    metric: 'Peak: 9–11 AM',
    badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800',
    badgeLabel: 'Stable',
  },
  {
    icon: TrendingDown,
    color: 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
    trend: 'declining',
    title: 'Stress Accumulation Pattern',
    description: 'Stress tends to accumulate significantly mid-week (Wed–Thu). Scheduling a short decompression break on Wednesday evenings can prevent the spike.',
    metric: 'Mid-week spike',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-800',
    badgeLabel: 'Watch',
  },
];

export default function InsightsPage() {
  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8 max-w-5xl space-y-10">

      {/* Header */}
      <div className="space-y-2 border-b border-slate-200/60 dark:border-slate-800 pb-6">
        <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/20">
          Wellness Intelligence
        </span>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-2">
          Your <span className="text-emerald-500">Insights</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
          Personalized behavioral patterns and cognitive trends identified across your wellness journal logs.
        </p>
      </div>

      {/* Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights.map((insight, idx) => (
          <Card
            key={idx}
            className="border border-slate-200/80 dark:border-slate-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01]"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${insight.color} shrink-0`}>
                    <insight.icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-black text-slate-850 dark:text-slate-100">
                      {insight.title}
                    </CardTitle>
                    <CardDescription className="text-[10px] font-bold text-slate-400 mt-0.5">
                      {insight.metric}
                    </CardDescription>
                  </div>
                </div>
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border shrink-0 ${insight.badge}`}>
                  {insight.badgeLabel}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                {insight.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state callout */}
      <Card className="border border-dashed border-slate-200/60 dark:border-slate-800 bg-white/40 dark:bg-slate-950/10 shadow-inner">
        <CardContent className="flex flex-col items-center justify-center py-12 gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500">
            <BrainCircuit className="h-6 w-6 animate-pulse" />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100">More Insights Unlock Over Time</h3>
            <p className="text-xs text-slate-500 dark:text-slate-455 leading-relaxed">
              Continue logging your daily wellness entries on the Dashboard. MindMate AI builds deeper pattern recognition as your history grows.
            </p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
