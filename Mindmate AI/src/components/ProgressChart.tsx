'use client';

import React, { useState } from 'react';
import { Activity, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressDataPoint } from '@/types';
import { cn } from '@/lib/utils';

export interface ProgressChartProps {
  data: ProgressDataPoint[];
}

export function ProgressChart({ data }: ProgressChartProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [activeTrends, setActiveTrends] = useState({
    mood: true,
    stress: true,
    sleep: true,
    study: true,
    burnout: true,
  });

  // SVG Chart Config
  const width = 600;
  const height = 200;
  const padding = 35;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Max values for plotting scale
  const maxMood = 10;
  const maxStress = 100;
  const maxSleep = 24;
  const maxStudy = 24;
  const maxBurnout = 100;

  // Generate SVG Coordinates
  const getCoordinates = (index: number, val: number, max: number) => {
    // Prevent divide-by-zero if data array has 1 element
    const xDivider = data.length > 1 ? data.length - 1 : 1;
    const x = padding + (index / xDivider) * chartWidth;
    const y = padding + chartHeight - (val / max) * chartHeight;
    return { x, y };
  };

  const moodPoints = data.map((d, i) => getCoordinates(i, d.moodScore, maxMood));
  const stressPoints = data.map((d, i) => getCoordinates(i, d.stressScore, maxStress));
  const sleepPoints = data.map((d, i) => getCoordinates(i, d.sleepHours, maxSleep));
  const studyPoints = data.map((d, i) => getCoordinates(i, d.studyHours, maxStudy));
  const burnoutPoints = data.map((d, i) => getCoordinates(i, d.burnoutScore, maxBurnout));

  const getPath = (points: { x: number; y: number }[]) => {
    return points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');
  };

  const getAreaPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    const mainPath = getPath(points);
    return `${mainPath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;
  };

  const toggleTrend = (key: keyof typeof activeTrends) => {
    setActiveTrends((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Card className="w-full col-span-1 md:col-span-2 lg:col-span-3 hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Activity className="h-4.5 w-4.5" />
            </div>
            <div>
              <CardTitle className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider">
                Progress & Trend Dashboard
              </CardTitle>
              <CardDescription className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                Toggle legend pills below to overlay and compare custom performance metrics.
              </CardDescription>
            </div>
          </div>

          {/* Interactive Legend Toggles */}
          <div className="flex flex-wrap gap-2 text-[10px] font-extrabold uppercase tracking-wider">
            <button
              onClick={() => toggleTrend('mood')}
              className={cn(
                "px-2.5 py-1 rounded-full border transition-all cursor-pointer",
                activeTrends.mood
                  ? "bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-950/30 dark:text-emerald-450 dark:border-emerald-800"
                  : "bg-slate-50/20 text-slate-400 border-slate-200 dark:border-slate-800"
              )}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
              Mood
            </button>

            <button
              onClick={() => toggleTrend('stress')}
              className={cn(
                "px-2.5 py-1 rounded-full border transition-all cursor-pointer",
                activeTrends.stress
                  ? "bg-orange-50 text-orange-700 border-orange-250 dark:bg-orange-950/30 dark:text-orange-450 dark:border-orange-800"
                  : "bg-slate-50/20 text-slate-400 border-slate-200 dark:border-slate-800"
              )}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5" />
              Stress
            </button>

            <button
              onClick={() => toggleTrend('sleep')}
              className={cn(
                "px-2.5 py-1 rounded-full border transition-all cursor-pointer",
                activeTrends.sleep
                  ? "bg-indigo-50 text-indigo-700 border-indigo-250 dark:bg-indigo-950/30 dark:text-indigo-450 dark:border-indigo-800"
                  : "bg-slate-50/20 text-slate-400 border-slate-200 dark:border-slate-800"
              )}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5" />
              Sleep
            </button>

            <button
              onClick={() => toggleTrend('study')}
              className={cn(
                "px-2.5 py-1 rounded-full border transition-all cursor-pointer",
                activeTrends.study
                  ? "bg-amber-50 text-amber-700 border-amber-250 dark:bg-amber-950/30 dark:text-amber-450 dark:border-amber-800"
                  : "bg-slate-50/20 text-slate-400 border-slate-200 dark:border-slate-800"
              )}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
              Study
            </button>

            <button
              onClick={() => toggleTrend('burnout')}
              className={cn(
                "px-2.5 py-1 rounded-full border transition-all cursor-pointer",
                activeTrends.burnout
                  ? "bg-rose-50 text-rose-700 border-rose-250 dark:bg-rose-950/30 dark:text-rose-450 dark:border-rose-800"
                  : "bg-slate-50/20 text-slate-400 border-slate-200 dark:border-slate-800"
              )}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" />
              Burnout
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* SVG Drawing area */}
        <div className="relative w-full aspect-[22/7] min-h-[160px] overflow-visible select-none">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = padding + ratio * chartHeight;
              return (
                <line
                  key={idx}
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  className="stroke-slate-100 dark:stroke-slate-900/60"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Render Areas & Lines depending on toggle state */}
            {activeTrends.sleep && (
              <>
                <path d={getAreaPath(sleepPoints)} className="fill-indigo-500/5 dark:fill-indigo-500/2.5" />
                <path d={getPath(sleepPoints)} className="stroke-indigo-500/60" strokeWidth="2" fill="none" strokeDasharray="3 3" />
              </>
            )}

            {activeTrends.study && (
              <>
                <path d={getAreaPath(studyPoints)} className="fill-amber-500/5 dark:fill-amber-500/2.5" />
                <path d={getPath(studyPoints)} className="stroke-amber-500/60" strokeWidth="2" fill="none" strokeDasharray="3 3" />
              </>
            )}

            {activeTrends.burnout && (
              <>
                <path d={getAreaPath(burnoutPoints)} className="fill-rose-500/5 dark:fill-rose-500/2.5" />
                <path d={getPath(burnoutPoints)} className="stroke-rose-500" strokeWidth="2" fill="none" />
              </>
            )}

            {activeTrends.stress && (
              <>
                <path d={getAreaPath(stressPoints)} className="fill-orange-400/5 dark:fill-orange-400/2.5" />
                <path d={getPath(stressPoints)} className="stroke-orange-400/80" strokeWidth="2.5" fill="none" />
              </>
            )}

            {activeTrends.mood && (
              <>
                <path d={getAreaPath(moodPoints)} className="fill-emerald-500/10 dark:fill-emerald-500/5" />
                <path d={getPath(moodPoints)} className="stroke-emerald-500" strokeWidth="3" fill="none" />
              </>
            )}

            {/* Interactive hitboxes & markers */}
            {data.map((_, idx) => {
              const xDivider = data.length > 1 ? data.length - 1 : 1;
              const x = padding + (idx / xDivider) * chartWidth;
              const isHovered = activeIdx === idx;
              return (
                <g key={idx}>
                  {/* Broad hover rect */}
                  <rect
                    x={x - chartWidth / xDivider / 2}
                    y={padding}
                    width={chartWidth / xDivider}
                    height={chartHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setActiveIdx(idx)}
                    onMouseLeave={() => setActiveIdx(null)}
                  />

                  {isHovered && (
                    <line
                      x1={x}
                      y1={padding}
                      x2={x}
                      y2={height - padding}
                      className="stroke-slate-350 dark:stroke-slate-750"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                      pointerEvents="none"
                    />
                  )}

                  {/* Draw small markers for active lines */}
                  {activeTrends.mood && (
                    <circle
                      cx={moodPoints[idx].x}
                      cy={moodPoints[idx].y}
                      r={isHovered ? 5.5 : 3.5}
                      className="fill-emerald-500 stroke-white dark:stroke-slate-950 transition-all duration-150"
                      strokeWidth={1.5}
                      pointerEvents="none"
                    />
                  )}

                  {activeTrends.stress && (
                    <circle
                      cx={stressPoints[idx].x}
                      cy={stressPoints[idx].y}
                      r={isHovered ? 5 : 3}
                      className="fill-orange-400 stroke-white dark:stroke-slate-950 transition-all duration-150"
                      strokeWidth={1.2}
                      pointerEvents="none"
                    />
                  )}

                  {activeTrends.sleep && (
                    <circle
                      cx={sleepPoints[idx].x}
                      cy={sleepPoints[idx].y}
                      r={isHovered ? 4.5 : 2.5}
                      className="fill-indigo-500 stroke-white dark:stroke-slate-950 transition-all duration-150"
                      strokeWidth={1}
                      pointerEvents="none"
                    />
                  )}

                  {activeTrends.study && (
                    <circle
                      cx={studyPoints[idx].x}
                      cy={studyPoints[idx].y}
                      r={isHovered ? 4.5 : 2.5}
                      className="fill-amber-500 stroke-white dark:stroke-slate-950 transition-all duration-150"
                      strokeWidth={1}
                      pointerEvents="none"
                    />
                  )}

                  {activeTrends.burnout && (
                    <circle
                      cx={burnoutPoints[idx].x}
                      cy={burnoutPoints[idx].y}
                      r={isHovered ? 5 : 3}
                      className="fill-rose-500 stroke-white dark:stroke-slate-950 transition-all duration-150"
                      strokeWidth={1}
                      pointerEvents="none"
                    />
                  )}
                </g>
              );
            })}

            {/* X-Axis Labels */}
            {data.map((d, idx) => {
              const xDivider = data.length > 1 ? data.length - 1 : 1;
              const x = padding + (idx / xDivider) * chartWidth;
              return (
                <text
                  key={idx}
                  x={x}
                  y={height - padding + 18}
                  className="fill-slate-400 dark:fill-slate-500 text-[9px] font-extrabold"
                  textAnchor="middle"
                >
                  {d.date}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Hover status detailed panel */}
        <div className="mt-4 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/20 p-3 min-h-[58px] flex items-center justify-between transition-all">
          {activeIdx !== null ? (
            <>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Timeline Data - {data[activeIdx].date}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-455 mt-0.5">
                  Sleep: <span className="text-slate-900 dark:text-white font-bold">{data[activeIdx].sleepHours}h</span> &bull; 
                  Study: <span className="text-slate-900 dark:text-white font-bold">{data[activeIdx].studyHours}h</span>
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-right">
                {activeTrends.mood && (
                  <div>
                    <div className="text-[8px] font-extrabold text-slate-400 dark:text-slate-500 uppercase leading-none">Mood</div>
                    <div className="text-xs font-black text-emerald-500 leading-tight mt-0.5">
                      {data[activeIdx].moodScore}/10
                    </div>
                  </div>
                )}
                {activeTrends.stress && (
                  <div>
                    <div className="text-[8px] font-extrabold text-slate-400 dark:text-slate-500 uppercase leading-none">Stress</div>
                    <div className="text-xs font-black text-orange-400 leading-tight mt-0.5">
                      {data[activeIdx].stressScore}%
                    </div>
                  </div>
                )}
                {activeTrends.burnout && (
                  <div>
                    <div className="text-[8px] font-extrabold text-slate-400 dark:text-slate-500 uppercase leading-none">Burnout</div>
                    <div className="text-xs font-black text-rose-500 leading-tight mt-0.5">
                      {data[activeIdx].burnoutScore}%
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Info className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-700" />
              <span>Hover over chart columns to view holistic daily health factors.</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
