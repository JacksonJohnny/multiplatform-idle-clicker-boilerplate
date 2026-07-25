import { describe, expect, it } from 'vitest';
import {
  calculateBulkUpgradeCost,
  calculateStats,
  calculateUpgradeCost,
  estimateGeneratorRateGain,
  formatCoins,
  formatEta,
  formatIdleSharePercent,
  getAutoTapWaveWhiteEquivalents,
  getGeneratorEfficiencyPipCount,
  getGeneratorIdleShare,
  isUpgradeUnlocked,
  paybackSeconds,
  secondsUntilAffordable,
} from './clickerMath.js';
import { getMaxAutoTapPowerSlots } from './autoTapProgress.js';

describe('clickerMath', () => {
  it('formats small, suffixed and very large values', () => {
    expect(formatCoins(999)).toBe('999');
    expect(formatCoins(999.4)).toBe('999.4');
    expect(formatCoins(1500)).toBe('1,500');
    expect(formatCoins(705_026)).toBe('705,026');
    expect(formatCoins(1_014_000_000)).toBe('1.014 billion');
    expect(formatCoins(1_000_000)).toBe('1 million');
    expect(formatCoins(152_661_000_000)).toBe('152.661 billion');
    expect(formatCoins(4_652_000_000_000)).toBe('4.652 trillion');
    expect(formatCoins('1e33')).toBe('1 decillion');
    expect(formatCoins('1e40')).toMatch(/e40$/);
  });

  it('caps large coefficients at 3 decimals (max 6 digits)', () => {
    expect(formatCoins(152_661_000_000)).toBe('152.661 billion');
    expect(formatCoins(388_557_000)).toBe('388.557 million');
    expect(formatCoins(999_499_000_000)).toBe('999.499 billion');
  });

  it('computes geometric upgrade costs', () => {
    const upgrade = { baseCost: 15, growth: 1.15, level: 0 };
    expect(calculateUpgradeCost(upgrade).toString()).toBe('15');
    expect(calculateBulkUpgradeCost({ ...upgrade, level: 0 }, 2).toString()).toBe('32');
  });

  it('checks generator unlock prerequisites', () => {
    const upgrades = [
      { id: 'upgrade-1', level: 0 },
      { id: 'upgrade-2', unlockAfter: 'upgrade-1', level: 0 },
    ];
    expect(isUpgradeUnlocked(upgrades[1], upgrades)).toBe(false);
    upgrades[0].level = 1;
    expect(isUpgradeUnlocked(upgrades[1], upgrades)).toBe(true);
  });

  it('reports idle production share and percent labels', () => {
    const state = {
      boosts: [],
      upgrades: [
        { id: 'upgrade-1', type: 'auto', baseValue: 1, level: 10 },
        { id: 'upgrade-2', type: 'auto', baseValue: 8, level: 5 },
      ],
    };

    expect(getGeneratorIdleShare(state, 'upgrade-1')).toBeCloseTo(0.2, 5);
    expect(getGeneratorIdleShare(state, 'upgrade-2')).toBeCloseTo(0.8, 5);
    expect(getGeneratorIdleShare(state, 'upgrade-3')).toBeNull();
    expect(formatIdleSharePercent(0.2)).toBe('20%');
    expect(formatIdleSharePercent(0.012)).toBe('1.2%');
    expect(formatIdleSharePercent(0.0008)).toBe('0.08%');
    expect(formatIdleSharePercent(null)).toBeNull();
  });

  it('hides idle share when no generators produce', () => {
    const state = {
      boosts: [],
      upgrades: [{ id: 'upgrade-1', type: 'auto', baseValue: 1, level: 0 }],
    };
    expect(getGeneratorIdleShare(state, 'upgrade-1')).toBeNull();
  });

  it('counts efficiency stars and calculates production stats', () => {
    const state = {
      unlockedAchievements: [],
      ascensionTokens: 0,
      boosts: [
        { id: 'upgrade-1-efficiency-1', kind: 'generator', targetId: 'upgrade-1', multiplier: 2, purchased: true },
      ],
      upgrades: [
        { id: 'tap-power', type: 'click', baseValue: 1, level: 1 },
        { id: 'upgrade-1', type: 'auto', baseValue: 1, level: 5 },
      ],
    };

    expect(getGeneratorEfficiencyPipCount(state, 'upgrade-1')).toBe(1);
    const stats = calculateStats(state);
    expect(stats.perSecond.toString()).toBe('10');
    expect(stats.perClick.toString()).toBe('2');
  });

  it('sums white-click equivalents for an Auto Tap wave', () => {
    const slots = getMaxAutoTapPowerSlots();
    expect(getAutoTapWaveWhiteEquivalents(2).toString()).toBe('2');

    expect(getAutoTapWaveWhiteEquivalents(slots + 1).toString()).toBe(String(slots + 3));
  });

  it('estimates afford wait and payback', () => {
    expect(secondsUntilAffordable(100, 100, 5)).toBe(0);
    expect(secondsUntilAffordable(100, 50, 10)).toBe(5);
    expect(secondsUntilAffordable(100, 0, 0)).toBe(Number.POSITIVE_INFINITY);
    expect(paybackSeconds(100, 25)).toBe(4);
    expect(formatEta(65)).toBe('1m 5s');
    expect(formatEta(0)).toBe('now');
  });

  it('estimates generator rate gain for bulk buys', () => {
    const state = {
      upgrades: [{ id: 'upgrade-1', type: 'auto', baseValue: 2, level: 3, growth: 1.15 }],
      boosts: [],
      unlockedAchievements: [],
      ascensionTokens: 0,
    };
    expect(estimateGeneratorRateGain(state, state.upgrades[0], 2)?.toString()).toBe('4');
  });
});
