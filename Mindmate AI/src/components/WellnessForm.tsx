'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { WellnessFormData, MoodType } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BrainCircuit, Sparkles, Smile, ShieldAlert, BookOpen, AlertCircle } from 'lucide-react';

export interface WellnessFormProps {
  onSubmit: (data: WellnessFormData) => void;
  isSubmitting?: boolean;
}

const moodOptions: { id: MoodType; emoji: string; label: string; color: string }[] = [
  { id: 'happy', emoji: '😊', label: 'Happy', color: 'border-emerald-250 bg-emerald-50/40 hover:bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/10 dark:text-emerald-400 dark:hover:bg-emerald-950/20' },
  { id: 'energetic', emoji: '😀', label: 'Energetic', color: 'border-amber-250 bg-amber-50/40 hover:bg-amber-50 text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/10 dark:text-amber-450 dark:hover:bg-amber-950/20' },
  { id: 'neutral', emoji: '😐', label: 'Neutral', color: 'border-slate-250 bg-slate-50/40 hover:bg-slate-50 text-slate-700 dark:border-slate-800/50 dark:bg-slate-900/10 dark:text-slate-400 dark:hover:bg-slate-900/20' },
  { id: 'down', emoji: '😔', label: 'Down', color: 'border-indigo-250 bg-indigo-50/40 hover:bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/10 dark:text-indigo-400 dark:hover:bg-indigo-950/20' },
  { id: 'sad', emoji: '😢', label: 'Sad', color: 'border-blue-250 bg-blue-50/40 hover:bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/10 dark:text-blue-400 dark:hover:bg-blue-950/20' },
  { id: 'angry', emoji: '😡', label: 'Angry', color: 'border-rose-250 bg-rose-50/40 hover:bg-rose-50 text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/10 dark:text-rose-450 dark:hover:bg-rose-950/20' },
  { id: 'anxious', emoji: '😰', label: 'Anxious', color: 'border-purple-250 bg-purple-50/40 hover:bg-purple-50 text-purple-700 dark:border-purple-900/50 dark:bg-purple-950/10 dark:text-purple-400 dark:hover:bg-purple-950/20' },
];

export function WellnessForm({ onSubmit, isSubmitting = false }: WellnessFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<WellnessFormData>({
    defaultValues: {
      stressLevel: 30,
      sleepHours: 7,
      studyHours: 4,
      screenTime: 5,
      examName: '',
      journalEntry: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Section 1: Emotional and Wellness Baseline (Col-span 2) */}
        <Card className="lg:col-span-2 shadow-sm border border-slate-200/80 dark:border-slate-800">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-900">
              <Smile className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider">
                1. Emotional & Wellness Baseline
              </h3>
            </div>

            {/* Today's Mood selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span id="mood-group-label" className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Today&apos;s Mood *
                </span>
                {errors.mood && (
                  <span id="mood-error" className="text-xs font-bold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Mood selection is required
                  </span>
                )}
              </div>

              <Controller
                name="mood"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <div
                    role="radiogroup"
                    aria-labelledby="mood-group-label"
                    aria-invalid={!!errors.mood}
                    aria-describedby={errors.mood ? "mood-error" : undefined}
                    className="grid grid-cols-4 sm:grid-cols-7 gap-2.5"
                  >
                    {moodOptions.map((opt) => {
                      const isChecked = value === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          role="radio"
                          aria-checked={isChecked}
                          tabIndex={isChecked || !value ? 0 : -1}
                          onClick={() => onChange(opt.id)}
                          className={cn(
                            "flex flex-col items-center justify-center rounded-xl p-2.5 border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 active:scale-[0.96]",
                            opt.color,
                            isChecked
                              ? "ring-2 ring-emerald-500 scale-[1.04] border-emerald-400 dark:border-emerald-600 shadow-sm"
                              : "border-slate-200/50 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10"
                          )}
                        >
                          <span className="text-2xl mb-1 filter drop-shadow-sm select-none">{opt.emoji}</span>
                          <span className="text-[10px] font-semibold tracking-wide capitalize">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              />
            </div>

            {/* Stress Level & Sleep Hours Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Stress Level Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label htmlFor="stressLevel" className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Stress Level *
                  </label>
                  <Controller
                    name="stressLevel"
                    control={control}
                    render={({ field: { value } }) => (
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                        {value}%
                      </span>
                    )}
                  />
                </div>
                <input
                  id="stressLevel"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  {...register('stressLevel', { required: true })}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 dark:bg-slate-805 accent-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                />
              </div>

              {/* Sleep Hours Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="sleepHours" className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Sleep Duration (Hours) *
                  </label>
                  {errors.sleepHours && (
                    <span id="sleep-error" className="text-xs font-bold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Must be 0-24 hrs
                    </span>
                  )}
                </div>
                <input
                  id="sleepHours"
                  type="number"
                  step="0.5"
                  aria-invalid={!!errors.sleepHours}
                  aria-describedby={errors.sleepHours ? "sleep-error" : undefined}
                  {...register('sleepHours', {
                    required: true,
                    min: 0,
                    max: 24,
                    valueAsNumber: true,
                  })}
                  className={cn(
                    "h-10 w-full rounded-xl border border-slate-205 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 px-3 text-sm text-slate-800 dark:text-slate-200 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500",
                    errors.sleepHours && "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                  )}
                />
              </div>

            </div>

            {/* Screen Time & Study Hours Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Study Hours */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="studyHours" className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Study Duration (Hours) *
                  </label>
                  {errors.studyHours && (
                    <span id="study-error" className="text-xs font-bold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Must be 0-24 hrs
                    </span>
                  )}
                </div>
                <input
                  id="studyHours"
                  type="number"
                  step="0.5"
                  aria-invalid={!!errors.studyHours}
                  aria-describedby={errors.studyHours ? "study-error" : undefined}
                  {...register('studyHours', {
                    required: true,
                    min: 0,
                    max: 24,
                    valueAsNumber: true,
                  })}
                  className={cn(
                    "h-10 w-full rounded-xl border border-slate-205 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 px-3 text-sm text-slate-800 dark:text-slate-200 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500",
                    errors.studyHours && "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                  )}
                />
              </div>

              {/* Screen Time */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="screenTime" className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Daily Screen Time (Hours) *
                  </label>
                  {errors.screenTime && (
                    <span id="screen-error" className="text-xs font-bold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Must be 0-24 hrs
                    </span>
                  )}
                </div>
                <input
                  id="screenTime"
                  type="number"
                  step="0.5"
                  aria-invalid={!!errors.screenTime}
                  aria-describedby={errors.screenTime ? "screen-error" : undefined}
                  {...register('screenTime', {
                    required: true,
                    min: 0,
                    max: 24,
                    valueAsNumber: true,
                  })}
                  className={cn(
                    "h-10 w-full rounded-xl border border-slate-205 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 px-3 text-sm text-slate-800 dark:text-slate-200 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500",
                    errors.screenTime && "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                  )}
                />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Section 2: Academic Focus Context (Col-span 1) */}
        <Card className="shadow-sm border border-slate-200/80 dark:border-slate-805">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-900">
              <ShieldAlert className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider">
                2. Academic Pressures
              </h3>
            </div>

            {/* Exam Name */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="examName" className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Upcoming Exam (Optional)
                </label>
                {errors.examName && (
                  <span id="exam-error" className="text-xs font-bold text-rose-500 flex items-center gap-1">
                    Min 2 chars
                  </span>
                )}
              </div>
              <input
                id="examName"
                type="text"
                placeholder="e.g. Cognitive Neurology"
                aria-invalid={!!errors.examName}
                aria-describedby={errors.examName ? "exam-error" : undefined}
                {...register('examName', {
                  minLength: 2,
                })}
                className={cn(
                  "h-10 w-full rounded-xl border border-slate-205 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 px-3 text-sm text-slate-800 dark:text-slate-200 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500",
                  errors.examName && "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                )}
              />
            </div>

            {/* Days Remaining */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="daysRemaining" className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Days Remaining
                </label>
                {errors.daysRemaining && (
                  <span id="days-error" className="text-xs font-bold text-rose-500 flex items-center gap-1">
                    Must be ≥ 0
                  </span>
                )}
              </div>
              <input
                id="daysRemaining"
                type="number"
                placeholder="e.g. 5"
                aria-invalid={!!errors.daysRemaining}
                aria-describedby={errors.daysRemaining ? "days-error" : undefined}
                {...register('daysRemaining', {
                  min: 0,
                  valueAsNumber: true,
                })}
                className={cn(
                  "h-10 w-full rounded-xl border border-slate-205 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 px-3 text-sm text-slate-800 dark:text-slate-200 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500",
                  errors.daysRemaining && "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
                )}
              />
            </div>

            <div className="pt-2 text-[10px] leading-relaxed text-slate-400 font-semibold italic">
              Academic contexts allow the AI scanner to evaluate performance load vs cognitive health ratios.
            </div>

          </CardContent>
        </Card>

      </div>

      {/* Section 3: Reflective Journal & Action Row */}
      <Card className="shadow-sm border border-slate-200/80 dark:border-slate-800">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-900">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider">
                3. Consciousness Log
              </h3>
            </div>
            {errors.journalEntry && (
              <span id="journal-error" className="text-xs font-bold text-rose-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Must be at least 10 characters
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="journalEntry" className="sr-only">
              Journal Entry *
            </label>
            <textarea
              id="journalEntry"
              rows={4}
              placeholder="What details characterized today's cognitive load? Write about your focus, fatigue levels, or stressors..."
              aria-invalid={!!errors.journalEntry}
              aria-describedby={errors.journalEntry ? "journal-error" : undefined}
              {...register('journalEntry', {
                required: true,
                minLength: 10,
              })}
              className={cn(
                "w-full rounded-xl border border-slate-205 dark:border-slate-800 bg-white/40 dark:bg-slate-900/10 p-3.5 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500",
                errors.journalEntry && "border-rose-400 focus:border-rose-500 focus:ring-rose-500"
              )}
            />
          </div>

          {/* Submit Action Block */}
          <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-slate-900">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-xl px-8 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-xs uppercase tracking-widest shadow-md shadow-emerald-600/10 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 animate-spin" />
                  Running Cognitive Scanner...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                  Generate Insights
                </span>
              )}
            </Button>
          </div>

        </CardContent>
      </Card>
    </form>
  );
}
