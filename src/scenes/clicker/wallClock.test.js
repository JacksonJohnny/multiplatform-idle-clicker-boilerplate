import { describe, expect, it } from 'vitest';
import Decimal from 'decimal.js';

/**
 * Mirrors wallClock offline modal gate: show only when gain > 0 and away ≥ 1s.
 * Keep in sync with applyWallClockProgress({ showOfflineReturn: true }).
 */
function shouldShowOfflineReturn(gain, cappedSeconds) {
  return Decimal(gain).gt(0) && cappedSeconds >= 1;
}

describe('wallClock offline gate', () => {
  it('requires both positive gain and at least 1s away', () => {
    expect(shouldShowOfflineReturn(10, 1)).toBe(true);
    expect(shouldShowOfflineReturn(10, 0.9)).toBe(false);
    expect(shouldShowOfflineReturn(0, 60)).toBe(false);
  });
});
