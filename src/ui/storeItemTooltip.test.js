import { describe, expect, it } from 'vitest';
import Decimal from 'decimal.js';
import { buildStoreItemTooltipBody, buildStoreItemTooltipLines } from '../ui/storeItemTooltip.js';

describe('store item tooltip', () => {
  const state = {
    coins: 10,
    perSecond: 5,
    upgrades: [{ id: 'upgrade-1', label: 'Generator 1', type: 'auto', baseValue: 1, level: 2, growth: 1.15 }],
    boosts: [],
    unlockedAchievements: [],
    ascensionTokens: 0,
  };

  it('groups content into INFO / PRODUCTION / BUY sections', () => {
    const body = buildStoreItemTooltipBody(state, state.upgrades[0], { cost: new Decimal(100) });
    expect(body).toContain('Generator 1');
    expect(body).toContain('INFO');
    expect(body).toContain('Owned  2');
    expect(body).toContain('Cost  ');
    expect(body).toContain('PRODUCTION');
    expect(body).toContain('Each  ');
    expect(body).toContain('Total  ');
    expect(body).toContain('BUY');
    expect(body).not.toContain('Produces ');
  });

  it('marks numeric values for emphasis', () => {
    const lines = buildStoreItemTooltipLines(state, state.upgrades[0], { cost: new Decimal(100) });
    const flat = lines.flat();
    expect(flat.some((part) => part.emph && part.text === '2')).toBe(true);
    expect(flat.some((part) => part.emph && part.text.includes('100'))).toBe(true);
    expect(flat.some((part) => part.section && part.text === 'PRODUCTION')).toBe(true);
  });

  it('shows affordable ETA and payback for generators', () => {
    const body = buildStoreItemTooltipBody(state, state.upgrades[0], { cost: new Decimal(100), amount: 1 });
    expect(body).toContain('Affordable in');
    expect(body).toContain('Payback');
  });
});
