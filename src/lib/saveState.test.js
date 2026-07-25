import { describe, expect, it } from 'vitest';
import { CLICKER_GENERATORS } from '../data/generators.js';
import { normalizeSaveState, UPGRADE_ID_ALIASES } from './saveState.js';

describe('saveState', () => {
  it('clamps negative upgrade levels to 0', () => {
    const normalized = normalizeSaveState({
      coins: '1',
      upgrades: [
        { id: 'upgrade-1', level: -5 },
        { id: 'tap-power', level: 1.9 },
      ],
      boosts: [],
    });
    expect(normalized.upgrades.find((u) => u.id === 'upgrade-1')?.level).toBe(0);
    expect(normalized.upgrades.find((u) => u.id === 'tap-power')?.level).toBe(1);
  });

  it('derives generator aliases from the catalog length', () => {
    expect(Object.keys(UPGRADE_ID_ALIASES)).toHaveLength(CLICKER_GENERATORS.length);
    expect(UPGRADE_ID_ALIASES['generator-1']).toBe('upgrade-1');
    expect(UPGRADE_ID_ALIASES[`generator-${CLICKER_GENERATORS.length}`]).toBe(`upgrade-${CLICKER_GENERATORS.length}`);
  });

  it('maps legacy Portuguese geral-upgrade ids', () => {
    const normalized = normalizeSaveState({
      coins: '0',
      upgrades: [],
      boosts: [{ id: 'geral-upgrade-1', purchased: true }],
    });
    expect(normalized.boosts.find((b) => b.id === 'base-multiplier-1')?.purchased).toBe(true);
  });
});
