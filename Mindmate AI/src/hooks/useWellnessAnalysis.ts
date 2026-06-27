import { useState } from 'react';
import { AnalysisResult, ProgressDataPoint, WellnessFormData, JournalEntry } from '@/types';
import { getMoodScore } from '@/utils/helpers';

export function useWellnessAnalysis(initialProgress: ProgressDataPoint[], entries: JournalEntry[]) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedResult, setGeneratedResult] = useState<AnalysisResult | null>(null);
  const [timelineData, setTimelineData] = useState<ProgressDataPoint[]>(initialProgress);

  const analyzeWellness = async (data: WellnessFormData) => {
    setIsGenerating(true);
    setGeneratedResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: data.mood,
          stressScore: data.stressLevel,
          sleepHours: data.sleepHours,
          studyHours: data.studyHours,
          screenTime: data.screenTime,
          examName: data.examName || '',
          daysRemaining: data.daysRemaining ?? null,
          journalText: data.journalEntry,
          history: entries,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result: AnalysisResult = await response.json();
      setGeneratedResult(result);

      // Add to progress timeline
      const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      setTimelineData((prev) => {
        const cleaned = prev.filter((p) => p.date !== todayStr);
        return [...cleaned, {
          date: todayStr,
          moodScore: result.overallMoodScore,
          stressScore: result.stressScore,
          sleepHours: data.sleepHours,
          studyHours: data.studyHours,
          burnoutScore: Math.min(100, Math.max(0, Math.round(result.stressScore * 0.7 + (10 - data.sleepHours) * 3))),
        }];
      });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn('[API Fallback] Server-side endpoint error, falling back to simulated insights:', errorMessage);
      
      const baselineMood = getMoodScore(data.mood);

      // Simulated engine recommendations mapping
      const simulatedRecs = [];
      if (data.stressLevel >= 60) {
        simulatedRecs.push(
          {
            recommendation: '3-Minute Box Breathing Technique',
            explanation: 'Rhythmic breath-holds slow down autonomic heart rate, immediately dampening sympathetic output.',
            category: 'stress' as const,
          },
          {
            recommendation: '5-Minute Guided Grounding Meditation',
            explanation: 'A quick cognitive pause releases active mental loops and clears short-term study memory.',
            category: 'stress' as const,
          },
          {
            recommendation: '15-Minute Outdoor Bilateral Walk',
            explanation: 'Brisk movement in natural light resets cortisol cycles and boosts visual focus distance.',
            category: 'stress' as const,
          },
          {
            recommendation: 'Reduce active study duration by 20%',
            explanation: 'Shortening study blocks preserves active recall efficiency and offsets mental blockages.',
            category: 'study' as const,
          }
        );
      }
      if (data.sleepHours < 7) {
        simulatedRecs.push({
          recommendation: 'Establish an offline bedtime routine',
          explanation: 'Shutting off high-luminance digital displays 45 minutes before sleep allows natural melatonin production.',
          category: 'sleep' as const,
        });
      }
      if (data.stressLevel > 70) {
        simulatedRecs.push({
          recommendation: 'Implement structured rest breaks (50-10 rule)',
          explanation: 'Resting for 10 minutes every 50 minutes of intense study prevents cognitive exhaustion.',
          category: 'burnout' as const,
        });
      }

      if (simulatedRecs.length === 0) {
        simulatedRecs.push({
          recommendation: 'Maintain current study and relaxation cycles',
          explanation: 'Your sleep, study, and stress ratios are well within optimal recovery zones.',
          category: 'general' as const,
        });
      }

      const textLower = data.journalEntry.toLowerCase();
      const distressKeywords = [
        'hopeless', 'give up', 'panic', 'die', 'quit', 'worthless', 'despair',
        'anxiety attack', 'cannot cope', 'can\'t cope', 'suicide', 'self-harm',
        'crying all day', 'crying constantly', 'completely broken'
      ];
      const hasConcerningLanguage = distressKeywords.some(keyword => textLower.includes(keyword)) || data.stressLevel > 90;

      const supportiveMsg = hasConcerningLanguage
        ? "It looks like you might be going through a particularly difficult or overwhelming moment right now. Please know that you are not alone, and it is okay to ask for help. We strongly encourage you to connect with a trusted family member, close friend, teacher, or counselor to talk about how you are feeling. Sharing a heavy load can make a meaningful difference."
        : "Your current mental parameters are being tracked. Remember to prioritize consistent sleep and study intervals to support cognitive performance.";

      const simulatedResult: AnalysisResult = {
        overallMoodScore: baselineMood,
        stressScore: data.stressLevel,
        emotionalPattern: data.examName 
          ? `Preparations for ${data.examName} (${data.daysRemaining ?? '?'} days remaining) are introducing localized pressure. Extended study blocks are correlating with late fatigue spikes.` 
          : 'High screen time ratios and dense evening studying correlate with slight disruptions in focus levels.',
        hiddenStressTriggers: [
          'Subconscious performance anxiety regarding academic outcomes',
          'Extended periods of intense visual focus without cognitive spacing',
          data.screenTime > 6 ? 'Excessive screen blue-light loading late at night' : 'Minor circadian variance',
        ],
        burnoutRisk: data.stressLevel > 75 ? 'High' : data.stressLevel > 45 ? 'Moderate' : 'Low',
        positiveBehaviors: [
          data.sleepHours >= 7 ? 'Maintaining healthy sleep baseline (>7 hours)' : 'Consistent bedtime efforts',
          data.studyHours > 3 ? 'Dedicated learning blocks' : 'Regular study intervals',
        ],
        areasOfConcern: [
          data.screenTime > 7 ? 'Excessive daily screen exposure' : 'General blue-light loads',
          data.stressLevel > 60 ? 'Mild sympathetic overload risk' : 'Temporary mental fatigue',
        ],
        personalizedCopingStrategies: [
          'Adopt the Pomodoro model (50 mins study, 10 mins screen-free rest).',
          'Disconnect from digital interfaces at least 45 minutes before sleep.',
          'Take a 10-minute brisk walk outside to reset active memory processing.',
        ],
        motivationalMessage: `Academic prep is a steady marathon, not a short sprint. Rest is an active component of high performance, not a lack of productivity. Take care of your mind today.`,
        todaysWellnessGoal: 'Commit to three screen-free study breaks and a 20-minute evening offline wind-down.',
        threeMinuteMindfulnessExercise: 'Box Breathing: Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Repeat for 3 minutes to re-balance your autonomic baseline.',
        studyRecommendation: data.examName 
          ? `Focus on active recall and practice papers for ${data.examName} today instead of re-reading textbooks. Study in a quiet, distraction-free environment.`
          : 'Schedule your most complex cognitive tasks during your morning peak alertness window.',
        confidenceScore: 85,
        riskLevel: data.stressLevel > 70 ? 'High' : data.stressLevel > 45 ? 'Moderate' : 'Low',
        insightsEngine: {
          repeatedEmotions: entries.length > 0 
            ? `Across your last ${entries.length} logs, you exhibit recurring patterns of ${data.mood} states, frequently correlating with high academic workloads.` 
            : 'Initial session. No repeated emotions identified yet.',
          repeatedStressTriggers: entries.length > 0 
            ? ['Exam pressure', 'Screen-induced attention fatigue'] 
            : ['Academic pressure'],
          improvingTrends: data.sleepHours > 6.5 
            ? 'Sleep duration has stabilized above 6.5 hours compared to earlier study blocks.' 
            : 'Initial trend lines are establishing.',
          negativeTrends: data.screenTime > 6 
            ? 'Screen time duration remains high (above 6 hours daily), risking visual overload.' 
            : 'No negative trends identified in this cycle.',
          burnoutWarning: data.stressLevel > 65 
            ? 'Elevated stress index with high study loads flags active burnout watch. Rest periods are highly recommended.' 
            : 'Burnout indices remain within manageable safety limits.',
          studyHabitsAnalysis: `Study density of ${data.studyHours} hours is effective, but efficiency is impacted by ${data.screenTime} hours of screen exposure. Balance study blocks with off-screen recall phases.`,
        },
        recommendationsList: simulatedRecs,
        safetyLayer: {
          concerningLanguageDetected: hasConcerningLanguage,
          supportiveMessage: supportiveMsg
        }
      };

      setGeneratedResult(simulatedResult);

      const todayStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      setTimelineData((prev) => {
        const cleaned = prev.filter((p) => p.date !== todayStr);
        return [...cleaned, {
          date: todayStr,
          moodScore: simulatedResult.overallMoodScore,
          stressScore: simulatedResult.stressScore,
          sleepHours: data.sleepHours,
          studyHours: data.studyHours,
          burnoutScore: Math.min(100, Math.max(0, Math.round(simulatedResult.stressScore * 0.7 + (10 - data.sleepHours) * 3))),
        }];
      });

      if (errorMessage.includes('unconfigured') || errorMessage.includes('401')) {
        alert("MindMate AI Info:\nFalling back to Client-Side Simulation. Set GEMINI_API_KEY to enable live server-side AI analytics.");
      } else {
        alert(`API Error: ${errorMessage}\nFell back to simulation.`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatedResult,
    timelineData,
    analyzeWellness
  };
}
