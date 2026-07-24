import { describe, expect, it } from 'vitest';
import Decimal from 'decimal.js';
import { buildStoreItemTooltipBody, buildStoreItemTooltipLines } from '../ui/storeItemTooltip.js';

describe('store item tooltip', () => {
  const state = {
    upgrades: [{ id: 'upgrade-1', label: 'Generator 1', type: 'auto', baseValue: 1, level: 2, growth: 1.15 }],
    boosts: [],
    unlockedAchievements: [],
    ascensionTokens: 0,
  };

  it('includes owned count and generator rates', () => {
    const body = buildStoreItemTooltipBody(state, state.upgrades[0], { cost: new Decimal(100) });
    expect(body).toContain('Generator 1');
    expect(body).toContain('owned: 2');
    expect(body).toContain('cost');
    expect(body).toContain('each produces');
    expect(body).toContain('2 producing');
  });

  it('marks numeric values for emphasis', () => {
    const lines = buildStoreItemTooltipLines(state, state.upgrades[0], { cost: new Decimal(100) });
    const flat = lines.flat();
    expect(flat.some((part) => part.emph && part.text === '2')).toBe(true);
    expect(flat.some((part) => part.emph && part.text.includes('100'))).toBe(true);
  });
});
