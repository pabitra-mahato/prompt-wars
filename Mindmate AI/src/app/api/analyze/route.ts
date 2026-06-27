import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  // 1. Verify API Key configuration
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[API] Configuration Error: GEMINI_API_KEY environment variable is missing.');
    return NextResponse.json(
      { error: 'Gemini service is unconfigured. Please set the GEMINI_API_KEY environment variable.' },
      { status: 401 }
    );
  }

  try {
    // 2. Parse request body
    const body = await request.json();
    const { 
      mood, 
      stressScore, 
      sleepHours, 
      studyHours, 
      screenTime, 
      examName, 
      daysRemaining, 
      journalText,
      history
    } = body;

    // Validation
    if (
      !mood || 
      typeof stressScore !== 'number' || 
      typeof sleepHours !== 'number' || 
      typeof studyHours !== 'number' || 
      typeof screenTime !== 'number' || 
      !journalText?.trim()
    ) {
      return NextResponse.json(
        { error: 'Missing or invalid parameters. Requires mood, stressScore, sleepHours, studyHours, screenTime, and journalText.' },
        { status: 400 }
      );
    }

    // 3. Initialize Gemini SDK
    const ai = new GoogleGenAI({ apiKey });

    // 4. Set up dynamic prompt
    const prompt = `
      You are an experienced mental wellness coach specializing in students preparing for competitive exams.
      
      Compare today's student wellness parameters and journal entry with previous entries to provide a comparative diagnostics analysis.
      
      Today's Parameters:
      - Mood Archetype: ${mood}
      - Stress Level: ${stressScore}%
      - Sleep Hours: ${sleepHours} hours
      - Screen Time: ${screenTime} hours
      - Study Hours: ${studyHours} hours
      ${examName ? `- Target Exam: ${examName} (${daysRemaining ?? 'unknown'} days remaining)` : ''}
      - Personal Journal Entry: "${journalText}"
      
      Historical Log Context:
      ${
        Array.isArray(history) && history.length > 0 
          ? (history as Array<{ createdAt?: string; mood?: string; text?: string; journalEntry?: string }>).map((h, idx: number) => `Prior Log ${idx + 1}:
            - Date/Time: ${h.createdAt || 'unknown'}
            - Mood Archetype: ${h.mood || 'unknown'}
            - Journal Text: "${h.text || h.journalEntry || ''}"`).join('\n\n')
          : 'No historical entries available (First log session).'
      }

      Generate personalized recommendations based on these conditional rules:
      - If Stress Level is High (60% or above): Recommend:
        1. A breathing exercise
        2. A 5-minute meditation
        3. Walking
        4. Reducing active study duration
      - If Sleep Hours are Poor (less than 7 hours): Suggest a better sleep routine.
      - If Burnout Risk is High or Severe: Suggest taking breaks.
      - Provide a clear cognitive explanation for each recommendation generated.

      Cognitive Safety Monitoring:
      - Monitor the journal entry text for any indications of concerning language.
      - Examples: expressions of deep hopelessness, extreme stress, panic, feeling overwhelmed to the point of giving up, or self-harm hints.
      - If concerning language is detected:
        1. Set "concerningLanguageDetected" to true inside the "safetyLayer" response object.
        2. Set "supportiveMessage" to an empathetic, non-alarmist, and warm supportive statement encouraging them to talk to a trusted family member, close friend, teacher, or counselor.
        3. Never make any medical or psychological diagnoses (e.g. do not diagnose clinical depression, clinical anxiety, or panic disorder). Keep the tone supportive.
      - If no concerning language is detected:
        1. Set "concerningLanguageDetected" to false.
        2. Set "supportiveMessage" to a simple, encouraging general wellness statement.

      Constraints:
      1. Always be empathetic.
      2. Never diagnose medical conditions.
      3. Never return markdown (no backticks, no markdown fencing). Return raw JSON only.
      4. Conform strictly to the response schema.
    `;

    // Define response schema
    const responseSchema = {
      type: 'OBJECT',
      properties: {
        overallMoodScore: {
          type: 'INTEGER',
          description: 'An overall assessment of their mood on a 1-10 scale.'
        },
        stressScore: {
          type: 'INTEGER',
          description: 'An overall assessment of their stress load on a 0-100 scale.'
        },
        emotionalPattern: {
          type: 'STRING',
          description: 'Insightful description connecting their current behaviors and logs to cognitive-behavioral patterns.'
        },
        hiddenStressTriggers: {
          type: 'ARRAY',
          items: { type: 'STRING' },
          description: 'Specific subconscious or unrecognized causes contributing to their stress load.'
        },
        burnoutRisk: {
          type: 'STRING',
          enum: ['Low', 'Moderate', 'High', 'Severe'],
          description: 'Assessment of burnout risk.'
        },
        positiveBehaviors: {
          type: 'ARRAY',
          items: { type: 'STRING' },
          description: 'Positive habits or coping mechanisms identified in the logs.'
        },
        areasOfConcern: {
          type: 'ARRAY',
          items: { type: 'STRING' },
          description: 'Key areas requiring wellness attention.'
        },
        personalizedCopingStrategies: {
          type: 'ARRAY',
          items: { type: 'STRING' },
          description: 'Direct, actionable coping strategies tailored to this student.'
        },
        motivationalMessage: {
          type: 'STRING',
          description: 'An encouraging, empathetic statement tailored to their current stress and exam load.'
        },
        todaysWellnessGoal: {
          type: 'STRING',
          description: 'A realistic, achievable wellness task for today.'
        },
        threeMinuteMindfulnessExercise: {
          type: 'STRING',
          description: 'A simple, step-by-step 3-minute mindfulness exercise (e.g. 5-4-3-2-1 grounding, Box breathing).'
        },
        studyRecommendation: {
          type: 'STRING',
          description: 'Actionable advice to optimize learning efficiency without compromising mental health.'
        },
        confidenceScore: {
          type: 'INTEGER',
          description: 'Coach self-assessed confidence in this evaluation (0-100).'
        },
        riskLevel: {
          type: 'STRING',
          enum: ['Low', 'Moderate', 'High', 'Severe'],
          description: 'Overall clinical wellness risk level.'
        },
        insightsEngine: {
          type: 'OBJECT',
          properties: {
            repeatedEmotions: {
              type: 'STRING',
              description: 'Explanations identifying any repeated emotional patterns observed across the logs.'
            },
            repeatedStressTriggers: {
              type: 'ARRAY',
              items: { type: 'STRING' },
              description: 'Explanations identifying any recurring stress triggers or stressors.'
            },
            improvingTrends: {
              type: 'STRING',
              description: 'Clear diagnostic explanation of improving behavioral or emotional metrics over time.'
            },
            negativeTrends: {
              type: 'STRING',
              description: 'Clear diagnostic explanation of negative or concerning trends over time.'
            },
            burnoutWarning: {
              type: 'STRING',
              description: 'Specific warning indicators regarding student burnout with explanations.'
            },
            studyHabitsAnalysis: {
              type: 'STRING',
              description: 'Detailed analysis of study habit changes, study hours efficiency, and screen time balance compared to previous entries.'
            }
          },
          required: [
            'repeatedEmotions',
            'repeatedStressTriggers',
            'improvingTrends',
            'negativeTrends',
            'burnoutWarning',
            'studyHabitsAnalysis'
          ]
        },
        recommendationsList: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              recommendation: {
                type: 'STRING',
                description: 'The specific actionable recommendation.'
              },
              explanation: {
                type: 'STRING',
                description: 'The cognitive explanation of why this recommendation helps.'
              },
              category: {
                type: 'STRING',
                enum: ['stress', 'sleep', 'burnout', 'study', 'general'],
                description: 'The category that triggered this recommendation.'
              }
            },
            required: ['recommendation', 'explanation', 'category']
          },
          description: 'A list of wellness recommendations generated based on stress, sleep, and burnout states.'
        },
        safetyLayer: {
          type: 'OBJECT',
          properties: {
            concerningLanguageDetected: {
              type: 'BOOLEAN',
              description: 'Whether concerning language or distress markers were found in the text.'
            },
            supportiveMessage: {
              type: 'STRING',
              description: 'An empathetic, encouraging message directing them to trusted contacts if distressed.'
            }
          },
          required: ['concerningLanguageDetected', 'supportiveMessage']
        }
      },
      required: [
        'overallMoodScore',
        'stressScore',
        'emotionalPattern',
        'hiddenStressTriggers',
        'burnoutRisk',
        'positiveBehaviors',
        'areasOfConcern',
        'personalizedCopingStrategies',
        'motivationalMessage',
        'todaysWellnessGoal',
        'threeMinuteMindfulnessExercise',
        'studyRecommendation',
        'confidenceScore',
        'riskLevel',
        'insightsEngine',
        'recommendationsList',
        'safetyLayer'
      ]
    };

    // 5. Implement timeout race (8 seconds limit)
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), 8000)
    );

    const apiCallPromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      }
    });

    const result = (await Promise.race([apiCallPromise, timeoutPromise])) as { text?: string };
    const responseText = result.text;

    if (!responseText) {
      throw new Error('Empty response received from Gemini.');
    }

    // 6. Return response
    const jsonOutput = JSON.parse(responseText);
    return NextResponse.json(jsonOutput, { status: 200 });

  } catch (error: unknown) {
    console.error('[API] Error in /api/analyze:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage === 'TIMEOUT') {
      return NextResponse.json(
        { error: 'Gateway Timeout: Request to the Gemini API took too long to complete.' },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error: Failed to analyze journal log. ' + errorMessage },
      { status: 500 }
    );
  }
}
