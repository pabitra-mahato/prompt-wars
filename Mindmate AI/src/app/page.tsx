'use client';

import React from 'react';
import { useMindState } from '@/hooks/useMindState';
import { useWellnessAnalysis } from '@/hooks/useWellnessAnalysis';
import { WellnessForm } from '@/components/WellnessForm';
import { ProgressChart } from '@/components/ProgressChart';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  BrainCircuit, 
  Heart, 
  Activity, 
  AlertTriangle, 
  Compass, 
  Award, 
  TrendingUp,
  TrendingDown,
  Wind,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

export default function DashboardPage() {
  const { progress, entries } = useMindState();
  const {
    isGenerating,
    generatedResult,
    timelineData,
    analyzeWellness
  } = useWellnessAnalysis(progress, entries);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl space-y-10 animate-fade-in">
      
      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.25); opacity: 0.65; }
        }
        .animate-breathe-glow {
          animation: breathe 6s infinite ease-in-out;
        }
      `}</style>

      {/* Header section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-200/60 dark:border-slate-800/80 pb-6">
        <div>
          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/20">
            Student Mental Wellness Coach
          </span>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-2.5">
            MindMate <span className="text-emerald-500">AI</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Optimized cognitive analytics for students preparing for competitive examinations.
          </p>
        </div>
      </div>

      {/* Inputs Section */}
      <div className="space-y-6">
        <h2 className="text-xs font-black text-slate-455 uppercase tracking-widest border-l-2 border-emerald-500 pl-2">
          1. Wellness Input Form
        </h2>
        <WellnessForm onSubmit={analyzeWellness} isSubmitting={isGenerating} />
      </div>

      {/* Outputs Section */}
      <div className="space-y-6">
        <h2 className="text-xs font-black text-slate-455 uppercase tracking-widest border-l-2 border-emerald-500 pl-2">
          2. Diagnostic Outputs
        </h2>

        {isGenerating ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingSkeleton variant="card" count={1} />
            <LoadingSkeleton variant="list" count={1} />
            <LoadingSkeleton variant="card" count={1} />
          </div>
        ) : generatedResult ? (
          <div className="space-y-8 animate-fade-in">
            
            {/* Safety Layer Alert Banner */}
            {generatedResult.safetyLayer.concerningLanguageDetected && (
              <Card className="border border-rose-205 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/10 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-455 shrink-0 mt-0.5 animate-pulse">
                    <AlertTriangle className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-rose-800 dark:text-rose-400 uppercase tracking-wider">
                      Coaching Care Message: Reach Out & Connect
                    </h4>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                      {generatedResult.safetyLayer.supportiveMessage}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Wide Motivational Quote Banner */}
            <Card className="border border-emerald-100 dark:border-emerald-900/40 bg-gradient-to-br from-emerald-50/30 to-teal-50/10 dark:from-emerald-950/5 dark:to-teal-950/2 relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-350 hover:scale-[1.005]">
              <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
              <CardContent className="p-6 sm:p-8 space-y-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-450 shrink-0">
                  <Heart className="h-4.5 w-4.5 fill-current" />
                </div>
                <div className="space-y-2">
                  <blockquote className="text-md sm:text-lg font-medium italic text-slate-800 dark:text-slate-205 leading-relaxed">
                    &ldquo;{generatedResult.motivationalMessage}&rdquo;
                  </blockquote>
                  <div className="pt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span className="text-emerald-600 dark:text-emerald-455 font-bold uppercase tracking-wider text-[10px] mr-2">
                      Emotional Cycle:
                    </span>
                    {generatedResult.emotionalPattern}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights Card */}
            <Card className="border border-indigo-150 dark:border-indigo-950/60 bg-indigo-50/10 dark:bg-indigo-950/5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              <CardHeader className="pb-3 border-b border-indigo-100/50 dark:border-indigo-900/20">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-650 dark:text-indigo-400">
                    <BrainCircuit className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider">
                      AI Insights Engine (Comparative Report)
                    </CardTitle>
                    <CardDescription className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                      Delta comparative patterns against prior {entries.length} wellness logs
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider block">Repeated Emotions</span>
                    <p className="text-xs text-slate-650 dark:text-slate-305 leading-relaxed font-normal">
                      {generatedResult.insightsEngine.repeatedEmotions}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider block">Repeated Triggers</span>
                    <div className="flex flex-wrap gap-1.5">
                      {generatedResult.insightsEngine.repeatedStressTriggers.map((t, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider block flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5" /> Improving Trends
                    </span>
                    <p className="text-xs text-slate-650 dark:text-slate-305 leading-relaxed font-normal">
                      {generatedResult.insightsEngine.improvingTrends}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider block flex items-center gap-1">
                      <TrendingDown className="h-3.5 w-3.5" /> Negative Trends
                    </span>
                    <p className="text-xs text-slate-650 dark:text-slate-305 leading-relaxed font-normal">
                      {generatedResult.insightsEngine.negativeTrends}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider block">Burnout Warnings</span>
                    <p className="text-xs text-slate-650 dark:text-slate-305 leading-relaxed font-normal">
                      {generatedResult.insightsEngine.burnoutWarning}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider block">Study Habit Assessment</span>
                    <p className="text-xs text-slate-650 dark:text-slate-305 leading-relaxed font-normal">
                      {generatedResult.insightsEngine.studyHabitsAnalysis}
                    </p>
                  </div>
                </div>

              </CardContent>
            </Card>

            {/* Core Outputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              
              {/* Card 1: Mood Score (Visual Gauge) */}
              <Card className="border border-slate-200/80 dark:border-slate-805 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 flex flex-col justify-between">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                      <Heart className="h-4.5 w-4.5" />
                    </div>
                    <CardTitle className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider">
                      Mood Score
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-6 space-y-4">
                  <div className="relative flex items-center justify-center">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle cx="48" cy="48" r={radius} stroke="#e2e8f0" strokeWidth="6" fill="transparent" className="dark:stroke-slate-800" />
                      <circle 
                        cx="48" 
                        cy="48" 
                        r={radius} 
                        stroke="#10b981" 
                        strokeWidth="6" 
                        fill="transparent" 
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (generatedResult.overallMoodScore / 10) * circumference}
                        className="transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
                        {generatedResult.overallMoodScore}
                      </span>
                      <span className="text-slate-400 text-xs block font-bold">/10</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 text-center">
                    Current overall mood alignment
                  </span>
                </CardContent>
              </Card>

              {/* Card 2: Stress Gauge */}
              <Card className="border border-slate-200/80 dark:border-slate-805 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 flex flex-col justify-between">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
                      <Activity className="h-4.5 w-4.5" />
                    </div>
                    <CardTitle className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider">
                      Stress Gauge
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-6 space-y-4">
                  <div className="relative flex items-center justify-center">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle cx="48" cy="48" r={radius} stroke="#e2e8f0" strokeWidth="6" fill="transparent" className="dark:stroke-slate-800" />
                      <circle 
                        cx="48" 
                        cy="48" 
                        r={radius} 
                        stroke="#f97316" 
                        strokeWidth="6" 
                        fill="transparent" 
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (generatedResult.stressScore / 100) * circumference}
                        className="transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-2xl font-black text-slate-800 dark:text-slate-100">
                        {generatedResult.stressScore}
                      </span>
                      <span className="text-slate-400 text-xs block font-bold">%</span>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 text-center">
                    Autonomic nervous system tension index
                  </span>
                </CardContent>
              </Card>

              {/* Card 3: Burnout Risk Assessment */}
              <Card className="border border-slate-200/80 dark:border-slate-805 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 flex flex-col justify-between">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-955 text-red-600 dark:text-red-400">
                      <AlertTriangle className="h-4.5 w-4.5" />
                    </div>
                    <CardTitle className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider">
                      Burnout Risk
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow flex flex-col justify-center">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Burnout Indicator</span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-wider",
                      generatedResult.burnoutRisk === 'Low' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800' :
                      generatedResult.burnoutRisk === 'Moderate' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800' :
                      'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-800'
                    )}>
                      {generatedResult.burnoutRisk}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Clinical Risk Level</span>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-wider",
                      generatedResult.riskLevel === 'Low' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800' :
                      generatedResult.riskLevel === 'Moderate' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800' :
                      'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-455 dark:border-rose-800'
                    )}>
                      {generatedResult.riskLevel}
                    </span>
                  </div>

                  <div className="h-px bg-slate-100 dark:bg-slate-900 my-2" />

                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-500 dark:text-slate-400">Analysis Confidence</span>
                    <span className="font-extrabold text-slate-700 dark:text-slate-300">
                      {generatedResult.confidenceScore}% Accurate
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4: Hidden Stress Triggers */}
              <Card className="border border-slate-200/80 dark:border-slate-805 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400">
                      <Compass className="h-4.5 w-4.5" />
                    </div>
                    <CardTitle className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider">
                      Hidden Triggers
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 flex-grow flex flex-col justify-between">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Subconscious stressors identified from today&apos;s log context:
                  </p>
                  <div className="space-y-2 pt-2">
                    {generatedResult.hiddenStressTriggers.map((trigger, idx) => (
                      <div
                        key={idx}
                        className="text-xs font-semibold text-slate-700 dark:text-slate-350 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/40 rounded-xl px-3 py-2 flex items-center gap-2"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                        <span>{trigger}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Card 5: Today's Wellness Goal */}
              <Card className="border border-slate-200/80 dark:border-slate-805 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-4.5 w-4.5" />
                    </div>
                    <CardTitle className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider">
                      Today&apos;s Goal
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
                  <p className="text-xs text-slate-500 leading-normal">
                    Achievable wellness target designed to balance cognitive performance:
                  </p>
                  <div className="bg-emerald-500/5 dark:bg-emerald-500/2.5 border border-emerald-500/10 p-4 rounded-2xl flex items-start gap-3">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs shrink-0 mt-0.5">✓</span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-205 leading-relaxed">
                      {generatedResult.todaysWellnessGoal}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Card 6: Breathing Exercise */}
              <Card className="border border-slate-200/80 dark:border-slate-805 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-950/40 text-teal-650 dark:text-teal-400">
                        <Wind className="h-4.5 w-4.5" />
                      </div>
                      <CardTitle className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider">
                        Breathing Exercise
                      </CardTitle>
                    </div>
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold text-teal-600 dark:text-teal-450 bg-teal-50 dark:bg-teal-950/20 px-2 py-0.5 rounded-md border border-teal-100/50 dark:border-teal-900/20 uppercase tracking-wider">
                      3 Min
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">
                    {generatedResult.threeMinuteMindfulnessExercise}
                  </p>
                  
                  <div className="flex items-center justify-center py-2">
                    <div className="relative flex items-center justify-center h-12 w-12">
                      <div className="absolute h-10 w-10 rounded-full bg-teal-400 dark:bg-teal-500/60 animate-breathe-glow" />
                      <div className="h-6 w-6 rounded-full bg-teal-500 dark:bg-teal-400 flex items-center justify-center text-white font-bold text-[9px] shadow-md">
                        AI
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 7: Study Recommendation */}
              <Card className="border border-slate-200/80 dark:border-slate-805 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 flex flex-col justify-between md:col-span-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-955 text-amber-600 dark:text-amber-405">
                      <BookOpen className="h-4.5 w-4.5" />
                    </div>
                    <CardTitle className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider">
                      Study Recommendation
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 flex-grow flex flex-col justify-between">
                  <p className="text-xs text-slate-500 leading-normal">
                    Cognitive study pacing tips relative to current preparation:
                  </p>
                  <p className="text-xs text-slate-650 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-850 p-3.5 rounded-xl font-normal">
                    {generatedResult.studyRecommendation}
                  </p>
                </CardContent>
              </Card>

              {/* Card 8: AI Recommendation Engine */}
              <Card className="border border-slate-200/80 dark:border-slate-805 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 flex flex-col justify-between md:col-span-2">
                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-900">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-455">
                      <Award className="h-4.5 w-4.5" />
                    </div>
                    <CardTitle className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider">
                      AI Recommendation Engine
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-grow divide-y divide-slate-100 dark:divide-slate-900">
                  {generatedResult.recommendationsList.map((item, idx) => (
                    <div key={idx} className="p-4 space-y-1.5 hover:bg-slate-50/20 dark:hover:bg-slate-950/10 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                          <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                          {item.recommendation}
                        </span>
                        
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider border",
                          item.category === 'stress' ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900/55' :
                          item.category === 'sleep' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/55' :
                          item.category === 'burnout' ? 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-400 dark:border-orange-900/55' :
                          item.category === 'study' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/55' :
                          'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/55'
                        )}>
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal pl-4">
                        {item.explanation}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Progress Timeline Chart Output */}
              <ProgressChart data={timelineData} />

            </div>
          </div>
        ) : (
          /* Placeholder Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-slate-200/60 dark:border-slate-805 rounded-3xl bg-white/40 dark:bg-slate-950/10 text-center space-y-4 shadow-inner">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 shadow-sm">
              <BrainCircuit className="h-6 w-6 animate-pulse" />
            </div>
            <div className="space-y-1.5 max-w-md">
              <h3 className="text-md font-bold text-slate-850 dark:text-slate-100">AI Wellness Scan Idle</h3>
              <p className="text-xs text-slate-500 dark:text-slate-455 leading-relaxed">
                Fill out the wellness input form in the Input Workspace above to synthesize cognitive, emotional, and mindfulness diagnostics.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
