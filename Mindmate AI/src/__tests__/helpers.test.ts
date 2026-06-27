import { getMoodScore, getMoodColor, getStressBadgeColor, formatDate } from '@/utils/helpers';

describe('getMoodScore', () => {
  it('returns 9 for happy mood', () => {
    expect(getMoodScore('happy')).toBe(9);
  });

  it('returns 8 for energetic mood', () => {
    expect(getMoodScore('energetic')).toBe(8);
  });

  it('returns 5 for neutral mood', () => {
    expect(getMoodScore('neutral')).toBe(5);
  });

  it('returns 4 for down mood', () => {
    expect(getMoodScore('down')).toBe(4);
  });

  it('returns 3 for sad mood', () => {
    expect(getMoodScore('sad')).toBe(3);
  });

  it('returns 2 for angry mood', () => {
    expect(getMoodScore('angry')).toBe(2);
  });

  it('returns 4 for anxious mood', () => {
    expect(getMoodScore('anxious')).toBe(4);
  });

  it('positive moods score higher than negative moods', () => {
    expect(getMoodScore('happy')).toBeGreaterThan(getMoodScore('sad'));
    expect(getMoodScore('energetic')).toBeGreaterThan(getMoodScore('angry'));
  });

  it('all scores are between 1 and 10', () => {
    const moods = ['happy', 'energetic', 'neutral', 'down', 'sad', 'angry', 'anxious'] as const;
    moods.forEach((mood) => {
      const score = getMoodScore(mood);
      expect(score).toBeGreaterThanOrEqual(1);
      expect(score).toBeLessThanOrEqual(10);
    });
  });
});

describe('getMoodColor', () => {
  it('returns correct properties for happy mood', () => {
    const result = getMoodColor('happy');
    expect(result).toHaveProperty('bg');
    expect(result).toHaveProperty('text');
    expect(result).toHaveProperty('border');
    expect(result).toHaveProperty('emoji');
    expect(result).toHaveProperty('label');
    expect(result.emoji).toBe('😊');
    expect(result.label).toBe('Happy');
  });

  it('returns correct emoji for anxious mood', () => {
    expect(getMoodColor('anxious').emoji).toBe('😰');
  });

  it('returns correct emoji for sad mood', () => {
    expect(getMoodColor('sad').emoji).toBe('😢');
  });

  it('returns correct emoji for angry mood', () => {
    expect(getMoodColor('angry').emoji).toBe('😡');
  });

  it('returns neutral defaults for unknown mood', () => {
    // @ts-expect-error - testing unknown input
    const result = getMoodColor('unknown');
    expect(result.emoji).toBe('😐');
    expect(result.label).toBe('Neutral');
  });

  it('all moods return non-empty bg and text', () => {
    const moods = ['happy', 'energetic', 'neutral', 'down', 'sad', 'angry', 'anxious'] as const;
    moods.forEach((mood) => {
      const result = getMoodColor(mood);
      expect(result.bg).not.toBe('');
      expect(result.text).not.toBe('');
    });
  });
});

describe('getStressBadgeColor', () => {
  it('returns emerald classes for low stress', () => {
    const result = getStressBadgeColor('low');
    expect(result).toContain('emerald');
  });

  it('returns amber classes for moderate stress', () => {
    const result = getStressBadgeColor('moderate');
    expect(result).toContain('amber');
  });

  it('returns orange classes for high stress', () => {
    const result = getStressBadgeColor('high');
    expect(result).toContain('orange');
  });

  it('returns rose classes for severe stress', () => {
    const result = getStressBadgeColor('severe');
    expect(result).toContain('rose');
  });

  it('returns non-empty string for all levels', () => {
    const levels = ['low', 'moderate', 'high', 'severe'] as const;
    levels.forEach((level) => {
      expect(getStressBadgeColor(level).length).toBeGreaterThan(0);
    });
  });
});

describe('formatDate', () => {
  it('formats ISO date string to readable format', () => {
    const result = formatDate('2026-06-27T00:00:00Z');
    expect(result).toMatch(/Jun/);
    expect(result).toMatch(/2026/);
  });

  it('returns a non-empty string', () => {
    expect(formatDate('2026-01-01T00:00:00Z').length).toBeGreaterThan(0);
  });
});
