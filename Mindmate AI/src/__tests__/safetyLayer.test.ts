/**
 * Tests for the Safety Layer distress detection logic.
 * Extracted from useWellnessAnalysis for unit testability.
 */

const DISTRESS_KEYWORDS = [
  'hopeless', 'give up', 'panic', 'die', 'quit', 'worthless', 'despair',
  'anxiety attack', 'cannot cope', "can't cope", 'suicide', 'self-harm',
  'crying all day', 'crying constantly', 'completely broken',
];

function detectConcerningLanguage(journalEntry: string, stressLevel: number): boolean {
  const textLower = journalEntry.toLowerCase();
  return DISTRESS_KEYWORDS.some((kw) => textLower.includes(kw)) || stressLevel > 90;
}

function buildRecommendations(stressLevel: number, sleepHours: number) {
  const recs: { recommendation: string; category: string }[] = [];

  if (stressLevel >= 60) {
    recs.push(
      { recommendation: '3-Minute Box Breathing Technique', category: 'stress' },
      { recommendation: '5-Minute Guided Grounding Meditation', category: 'stress' },
      { recommendation: '15-Minute Outdoor Bilateral Walk', category: 'stress' },
      { recommendation: 'Reduce active study duration by 20%', category: 'study' },
    );
  }
  if (sleepHours < 7) {
    recs.push({ recommendation: 'Establish an offline bedtime routine', category: 'sleep' });
  }
  if (stressLevel > 70) {
    recs.push({ recommendation: 'Implement structured rest breaks (50-10 rule)', category: 'burnout' });
  }
  if (recs.length === 0) {
    recs.push({ recommendation: 'Maintain current study and relaxation cycles', category: 'general' });
  }
  return recs;
}

// ─── Safety Layer Tests ───────────────────────────────────────────────────────

describe('Safety Layer — distress keyword detection', () => {
  it('detects "hopeless" in journal entry', () => {
    expect(detectConcerningLanguage('I feel hopeless about everything', 50)).toBe(true);
  });

  it('detects "panic" in journal entry', () => {
    expect(detectConcerningLanguage('I panic every night before bed', 40)).toBe(true);
  });

  it('detects "cannot cope" in journal entry', () => {
    expect(detectConcerningLanguage('I cannot cope with this stress', 55)).toBe(true);
  });

  it('detects "give up" in journal entry', () => {
    expect(detectConcerningLanguage('I want to give up studying', 30)).toBe(true);
  });

  it('detects keyword case-insensitively', () => {
    expect(detectConcerningLanguage('FEELING HOPELESS AND WORTHLESS', 50)).toBe(true);
  });

  it('does NOT trigger on a healthy journal entry', () => {
    expect(detectConcerningLanguage('Had a productive day, feeling good!', 40)).toBe(false);
  });

  it('triggers when stress level exceeds 90 even without keywords', () => {
    expect(detectConcerningLanguage('Feeling fine today.', 95)).toBe(true);
  });

  it('does NOT trigger when stress is exactly 90', () => {
    expect(detectConcerningLanguage('Feeling fine today.', 90)).toBe(false);
  });

  it('detects "suicide" in journal entry', () => {
    expect(detectConcerningLanguage('I have thoughts of suicide', 50)).toBe(true);
  });

  it('detects "self-harm" in journal entry', () => {
    expect(detectConcerningLanguage('I have been thinking about self-harm', 50)).toBe(true);
  });

  it('triggers on combined stress + keywords', () => {
    expect(detectConcerningLanguage('I feel hopeless and worthless', 95)).toBe(true);
  });

  it('returns false for empty journal with normal stress', () => {
    expect(detectConcerningLanguage('', 30)).toBe(false);
  });
});

// ─── Recommendation Engine Tests ──────────────────────────────────────────────

describe('Recommendation Engine — conditional wellness interventions', () => {
  it('returns breathing, meditation, walk recommendations when stress >= 60', () => {
    const recs = buildRecommendations(75, 7.5);
    const categories = recs.map((r) => r.category);
    expect(categories).toContain('stress');
  });

  it('returns sleep recommendation when sleep < 7 hours', () => {
    const recs = buildRecommendations(30, 5.5);
    expect(recs.some((r) => r.category === 'sleep')).toBe(true);
  });

  it('returns burnout recommendation when stress > 70', () => {
    const recs = buildRecommendations(80, 8);
    expect(recs.some((r) => r.category === 'burnout')).toBe(true);
  });

  it('returns general recommendation when all metrics are healthy', () => {
    const recs = buildRecommendations(40, 8);
    expect(recs.some((r) => r.category === 'general')).toBe(true);
  });

  it('does NOT return stress recommendations when stress < 60', () => {
    const recs = buildRecommendations(50, 8);
    expect(recs.some((r) => r.category === 'stress')).toBe(false);
  });

  it('does NOT return sleep recommendation when sleep >= 7', () => {
    const recs = buildRecommendations(50, 7.5);
    expect(recs.some((r) => r.category === 'sleep')).toBe(false);
  });

  it('returns at least 4 recs for high stress + poor sleep', () => {
    const recs = buildRecommendations(80, 5);
    expect(recs.length).toBeGreaterThanOrEqual(4);
  });

  it('always returns at least 1 recommendation', () => {
    const recs = buildRecommendations(10, 9);
    expect(recs.length).toBeGreaterThanOrEqual(1);
  });

  it('returns study recommendation when stress >= 60', () => {
    const recs = buildRecommendations(65, 8);
    expect(recs.some((r) => r.category === 'study')).toBe(true);
  });
});
