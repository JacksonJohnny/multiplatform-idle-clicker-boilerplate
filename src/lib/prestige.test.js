import { describe, expect, it } from 'vitest';
import { asNonNegInt, calculateAscensionTokenGain, getAscensionTokenIdleMultiplier } from './prestige.js';

describe('prestige', () => {
  it('gains no tokens below 1M coins this ascension', () => {
    expect(calculateAscensionTokenGain(0)).toBe(0);
    expect(calculateAscensionTokenGain(999_999)).toBe(0);
  });

  it('uses a soft sqrt curve from 1M coins', () => {
    expect(calculateAscensionTokenGain(1_000_000)).toBe(1);
    expect(calculateAscensionTokenGain(100_000_000)).toBe(10);
    expect(calculateAscensionTokenGain(10_000_000_000)).toBe(100);
  });

  it('applies +1% idle per Ascension Token', () => {
    expect(getAscensionTokenIdleMultiplier(0)).toBe(1);
    expect(getAscensionTokenIdleMultiplier(1)).toBe(1.01);
    expect(getAscensionTokenIdleMultiplier(50)).toBe(1.5);
  });

  it('does not wrap large token counts through int32', () => {
    // `| 0` truncates to signed int32: 3258494147 → -1036473149
    expect(asNonNegInt(3_258_494_147)).toBe(3_258_494_147);
    expect(3_258_494_147 | 0).toBe(-1_036_473_149);
    expect(asNonNegInt(-1_036_473_149)).toBe(3_258_494_147);
    expect(getAscensionTokenIdleMultiplier(3_258_494_147)).toBe(1 + 3_258_494_147 * 0.01);
  });
});
