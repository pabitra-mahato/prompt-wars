import type { Metadata } from 'next';
import { Sparkles, Clock, Heart, Wind, BookOpen, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Therapy Plans — MindMate AI',
  description: 'Structured self-care routines and evidence-based therapeutic exercises recommended for your wellness profile.',
};

const plans = [
  {
    icon: Wind,
    color: 'bg-teal-100 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400',
    title: 'Breathwork Foundation Plan',
    subtitle: '5 min / day · Beginner',
    difficulty: 'Beginner',
    duration: '5 min',
    description: 'A daily box-breathing routine to lower baseline cortisol levels and strengthen the parasympathetic response. Ideal for managing pre-exam anxiety spikes.',
    steps: [
      'Inhale deeply through the nose for 4 counts',
      'Hold breath at the top for 4 counts',
      'Exhale slowly through the mouth for 4 counts',
      'Hold at the bottom for 4 counts',
      'Repeat the cycle for 5 full minutes',
    ],
    badge: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-900',
  },
  {
    icon: BookOpen,
    color: 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
    title: 'Reflective Journaling Protocol',
    subtitle: '10 min / evening · Beginner',
    difficulty: 'Beginner',
    duration: '10 min',
    description: 'A structured evening journaling exercise that uses the "3 Good Things" method to reinforce neuroplasticity, build positive attribution bias, and reduce rumination.',
    steps: [
      'Write 3 things that went well today (no matter how small)',
      'For each, describe WHY it went well (your role in it)',
      'Write one challenging moment and what you learned from it',
      'Set one micro-intention for tomorrow',
    ],
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900',
  },
  {
    icon: Heart,
    color: 'bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
    title: 'Body Scan Relaxation',
    subtitle: '15 min / night · Intermediate',
    difficulty: 'Intermediate',
    duration: '15 min',
    description: 'A progressive body scan to release stored tension from intensive study sessions, improve sleep latency, and reduce physical stress symptom patterns.',
    steps: [
      'Lie down in a comfortable position, close your eyes',
      'Starting from your toes — slowly notice each muscle group',
      'Consciously tense each area for 3 seconds, then release',
      'Move upwards: feet → calves → thighs → core → arms → shoulders → jaw',
      'Rest in full-body relaxation for 2 minutes',
    ],
    badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900',
  },
  {
    icon: Sparkles,
    color: 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
    title: '5-4-3-2-1 Grounding Technique',
    subtitle: '5 min / as-needed · Beginner',
    difficulty: 'Beginner',
    duration: '5 min',
    description: 'A fast sensory grounding exercise for acute anxiety or panic moments during study or before exams. Anchors your nervous system in the present.',
    steps: [
      'Name 5 things you can SEE right now',
      'Name 4 things you can TOUCH and feel their texture',
      'Name 3 things you can HEAR in your environment',
      'Name 2 things you can SMELL',
      'Name 1 thing you can TASTE',
    ],
    badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900',
  },
];

export default function TherapyPage() {
  return (
    <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8 max-w-5xl space-y-10">

      {/* Header */}
      <div className="space-y-2 border-b border-slate-200/60 dark:border-slate-800 pb-6">
        <span className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-widest bg-teal-50 dark:bg-teal-950/20 px-2.5 py-1 rounded-full border border-teal-100 dark:border-teal-900/20">
          Evidence-Based Self-Care
        </span>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-2">
          Therapy <span className="text-teal-500">Plans</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
          Structured evidence-based self-care routines curated for students managing academic stress and exam pressure.
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan, idx) => (
          <Card
            key={idx}
            className="border border-slate-200/80 dark:border-slate-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${plan.color} shrink-0 mt-0.5`}>
                  <plan.icon className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm font-black text-slate-850 dark:text-slate-100 leading-snug">
                      {plan.title}
                    </CardTitle>
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border shrink-0 ${plan.badge}`}>
                      {plan.difficulty}
                    </span>
                  </div>
                  <CardDescription className="text-[10px] font-bold text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> {plan.duration} daily
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow flex flex-col">
              <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                {plan.description}
              </p>
              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Steps</span>
                {plan.steps.map((step, sIdx) => (
                  <div key={sIdx} className="flex items-start gap-2.5 text-xs text-slate-650 dark:text-slate-305">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
