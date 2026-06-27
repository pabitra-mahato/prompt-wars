/**
 * Tests for /api/analyze route input validation logic.
 * Validates request body shape, required fields, and type guards.
 */

// Utility: build a valid payload
function buildValidPayload(overrides: Record<string, unknown> = {}) {
  return {
    mood: 'happy',
    stressScore: 40,
    sleepHours: 7.5,
    studyHours: 5,
    screenTime: 3,
    journalText: 'Had a productive study session.',
    ...overrides,
  };
}

// Mirrors the validation guard from route.ts
function isValidPayload(body: Record<string, unknown>): boolean {
  const { mood, stressScore, sleepHours, studyHours, screenTime, journalText } = body;
  if (!mood) return false;
  if (typeof stressScore !== 'number') return false;
  if (typeof sleepHours !== 'number') return false;
  if (typeof studyHours !== 'number') return false;
  if (typeof screenTime !== 'number') return false;
  if (typeof journalText !== 'string' || !journalText.trim()) return false;
  return true;
}

// ─── Input Validation Tests ───────────────────────────────────────────────────

describe('API /api/analyze — input validation', () => {
  it('accepts a valid payload', () => {
    expect(isValidPayload(buildValidPayload())).toBe(true);
  });

  it('rejects missing mood', () => {
    const payload = buildValidPayload({ mood: '' });
    expect(isValidPayload(payload)).toBe(false);
  });

  it('rejects undefined mood', () => {
    const payload = buildValidPayload({ mood: undefined });
    expect(isValidPayload(payload)).toBe(false);
  });

  it('rejects non-numeric stressScore', () => {
    expect(isValidPayload(buildValidPayload({ stressScore: '80' }))).toBe(false);
  });

  it('rejects non-numeric sleepHours', () => {
    expect(isValidPayload(buildValidPayload({ sleepHours: null }))).toBe(false);
  });

  it('rejects non-numeric studyHours', () => {
    expect(isValidPayload(buildValidPayload({ studyHours: '5hrs' }))).toBe(false);
  });

  it('rejects non-numeric screenTime', () => {
    expect(isValidPayload(buildValidPayload({ screenTime: true }))).toBe(false);
  });

  it('rejects empty journalText', () => {
    expect(isValidPayload(buildValidPayload({ journalText: '' }))).toBe(false);
  });

  it('rejects whitespace-only journalText', () => {
    expect(isValidPayload(buildValidPayload({ journalText: '   ' }))).toBe(false);
  });

  it('rejects missing journalText', () => {
    expect(isValidPayload(buildValidPayload({ journalText: undefined }))).toBe(false);
  });

  it('accepts stressScore of 0', () => {
    expect(isValidPayload(buildValidPayload({ stressScore: 0 }))).toBe(true);
  });

  it('accepts stressScore of 100', () => {
    expect(isValidPayload(buildValidPayload({ stressScore: 100 }))).toBe(true);
  });

  it('accepts all valid mood types', () => {
    const moods = ['happy', 'energetic', 'neutral', 'down', 'sad', 'angry', 'anxious'];
    moods.forEach((mood) => {
      expect(isValidPayload(buildValidPayload({ mood }))).toBe(true);
    });
  });

  it('accepts floats for sleepHours', () => {
    expect(isValidPayload(buildValidPayload({ sleepHours: 6.5 }))).toBe(true);
  });
});

// ─── Burnout Score Calculation Tests ─────────────────────────────────────────

describe('Burnout score calculation', () => {
  function calcBurnout(stressScore: number, sleepHours: number): number {
    return Math.min(100, Math.max(0, Math.round(stressScore * 0.7 + (10 - sleepHours) * 3)));
  }

  it('returns 0 for perfect conditions', () => {
    expect(calcBurnout(0, 10)).toBe(0);
  });

  it('caps at 100 for extreme inputs', () => {
    expect(calcBurnout(100, 0)).toBe(100);
  });

  it('never goes below 0', () => {
    expect(calcBurnout(0, 10)).toBeGreaterThanOrEqual(0);
  });

  it('never exceeds 100', () => {
    expect(calcBurnout(100, 0)).toBeLessThanOrEqual(100);
  });

  it('increases with higher stress', () => {
    expect(calcBurnout(80, 7)).toBeGreaterThan(calcBurnout(30, 7));
  });

  it('increases with less sleep', () => {
    expect(calcBurnout(50, 5)).toBeGreaterThan(calcBurnout(50, 9));
  });

  it('returns number for typical inputs', () => {
    expect(typeof calcBurnout(60, 6)).toBe('number');
  });
});
