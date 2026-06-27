import type { Metadata } from 'next';
import { History, CalendarDays, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'History — MindMate AI',
  description: 'Review your past wellness journal entries, mood trends, and session logs.',
};

const moodColorMap: Record<string, string> = {
  happy: 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
  energetic: 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900',
  neutral: 'bg-slate-100 dark:bg-slate-900/40 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800',
  down: 'bg-indigo-100 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900',
  sad: 'bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900',
  angry: 'bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900',
  anxious: 'bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900',
};

const moodEmojiMap: Record<string, string> = {
  happy: '😊',
  energetic: '😀',
  neutral: '😐',
  down: '😔',
  sad: '😢',
  angry: '😡',
  anxious: '😰',
};

const sampleHistory = [
  {
    id: '3',
    date: 'Jun 27, 2026',
    time: '9:00 PM',
    mood: 'neutral',
    moodScore: 9,
    stressScore: 25,
    sleepHours: 8.2,
    studyHours: 3.5,
    journalEntry: 'Had a very relaxing evening reading my favorite novel. Sleep quality was also amazing.',
    tags: ['reading', 'sleep', 'relaxing'],
  },
  {
    id: '2',
    date: 'Jun 26, 2026',
    time: '9:15 AM',
    mood: 'anxious',
    moodScore: 5,
    stressScore: 50,
    sleepHours: 6.2,
    studyHours: 7.0,
    journalEntry: 'Felt a bit anxious before the team presentation, but deep breathing exercises helped me ground myself.',
    tags: ['presentation', 'breathing', 'stress'],
  },
  {
    id: '1',
    date: 'Jun 25, 2026',
    time: '2:30 PM',
    mood: 'happy',
    moodScore: 8,
    stressScore: 35,
    sleepHours: 7.5,
    studyHours: 6.0,
    journalEntry: 'Had a productive coding session today, feeling accomplished and stable. Spent some time walking in the park.',
    tags: ['work', 'nature', 'productivity'],
  },
];

export default function HistoryPage() {
  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8 max-w-4xl space-y-10">

      {/* Header */}
      <div className="space-y-2 border-b border-slate-200/60 dark:border-slate-800 pb-6">
        <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/20 px-2.5 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/20">
          Session Archive
        </span>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-2">
          Wellness <span className="text-indigo-500">History</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
          A chronological archive of your past wellness journal sessions and coaching analysis logs.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative space-y-6">
        {/* Timeline vertical line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        {sampleHistory.map((entry) => (
          <div key={entry.id} className="flex gap-4 sm:gap-6">
            {/* Timeline dot */}
            <div className="flex flex-col items-center shrink-0 hidden sm:flex">
              <div className="h-10 w-10 rounded-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center text-lg shadow-sm z-10">
                {moodEmojiMap[entry.mood] ?? '😐'}
              </div>
            </div>

            {/* Card */}
            <Card className="flex-1 border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <CalendarDays className="h-4 w-4 text-slate-400" />
                    <CardTitle className="text-sm font-black text-slate-800 dark:text-slate-100">
                      {entry.date}
                    </CardTitle>
                    <span className="text-xs text-slate-400 font-semibold">{entry.time}</span>
                  </div>
                  <span className={cn(
                    'text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border',
                    moodColorMap[entry.mood]
                  )}>
                    {moodEmojiMap[entry.mood]} {entry.mood}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stats row */}
                <div className="flex gap-4 flex-wrap">
                  <div className="text-center">
                    <div className="text-lg font-black text-slate-800 dark:text-slate-100">{entry.moodScore}<span className="text-xs text-slate-400 font-bold">/10</span></div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Mood</div>
                  </div>
                  <div className="w-px bg-slate-100 dark:bg-slate-900 self-stretch" />
                  <div className="text-center">
                    <div className="text-lg font-black text-slate-800 dark:text-slate-100">{entry.stressScore}<span className="text-xs text-slate-400 font-bold">%</span></div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Stress</div>
                  </div>
                  <div className="w-px bg-slate-100 dark:bg-slate-900 self-stretch" />
                  <div className="text-center">
                    <div className="text-lg font-black text-slate-800 dark:text-slate-100">{entry.sleepHours}<span className="text-xs text-slate-400 font-bold">h</span></div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Sleep</div>
                  </div>
                  <div className="w-px bg-slate-100 dark:bg-slate-900 self-stretch" />
                  <div className="text-center">
                    <div className="text-lg font-black text-slate-800 dark:text-slate-100">{entry.studyHours}<span className="text-xs text-slate-400 font-bold">h</span></div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Study</div>
                  </div>
                </div>

                {/* Journal entry */}
                <div className="flex items-start gap-2.5 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/40 rounded-xl p-3.5">
                  <BookOpen className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-normal italic">
                    &ldquo;{entry.journalEntry}&rdquo;
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {entry.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-450 border border-slate-150 dark:border-slate-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {/* Empty state at bottom */}
        <div className="flex gap-4 sm:gap-6">
          <div className="shrink-0 hidden sm:flex flex-col items-center">
            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center z-10">
              <History className="h-4 w-4 text-slate-400" />
            </div>
          </div>
          <Card className="flex-1 border border-dashed border-slate-200/60 dark:border-slate-800 bg-white/30 dark:bg-slate-950/5 shadow-none">
            <CardContent className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
              Your future wellness logs will appear here as you submit the form on the Dashboard.
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
