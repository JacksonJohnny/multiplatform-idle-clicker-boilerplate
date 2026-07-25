import { describe, expect, it } from 'vitest';
import {
  AUTO_TAP_CURSOR_TINTS,
  AUTO_TAP_POWER_SLOTS,
  getAutoTapCursorMultiplier,
  getAutoTapCursorTint,
  getMaxAutoTapCursorSlots,
  getMaxAutoTapPowerSlots,
} from '../lib/autoTapProgress.js';

describe('autoTapProgress', () => {
  const visualSlots = getMaxAutoTapCursorSlots();
  const powerSlots = getMaxAutoTapPowerSlots();

  it('keeps power slots frozen and independent of layout helpers', () => {
    expect(powerSlots).toBe(AUTO_TAP_POWER_SLOTS);
    expect(visualSlots).toBe(63);
    expect(powerSlots).toBe(63);
  });

  it('keeps all cursors white while the rings are filling', () => {
    expect(getAutoTapCursorTint(1, 0, powerSlots)).toBe(AUTO_TAP_CURSOR_TINTS[0]);
    expect(getAutoTapCursorTint(powerSlots, powerSlots - 1, powerSlots)).toBe(AUTO_TAP_CURSOR_TINTS[0]);
    expect(getAutoTapCursorMultiplier(powerSlots, 0, powerSlots)).toBe(1);
  });

  it('paints one cursor per level after the rings are full', () => {
    expect(getAutoTapCursorTint(powerSlots + 1, 0, powerSlots)).toBe(AUTO_TAP_CURSOR_TINTS[1]);
    expect(getAutoTapCursorTint(powerSlots + 1, 1, powerSlots)).toBe(AUTO_TAP_CURSOR_TINTS[0]);
    expect(getAutoTapCursorMultiplier(powerSlots + 1, 0, powerSlots)).toBe(2);
    expect(getAutoTapCursorMultiplier(powerSlots + 1, 1, powerSlots)).toBe(1);
    expect(getAutoTapCursorTint(powerSlots * 2, powerSlots - 1, powerSlots)).toBe(AUTO_TAP_CURSOR_TINTS[1]);
    expect(getAutoTapCursorTint(powerSlots * 2 + 1, 0, powerSlots)).toBe(AUTO_TAP_CURSOR_TINTS[2]);
    expect(getAutoTapCursorMultiplier(powerSlots * 2 + 1, 0, powerSlots)).toBe(3);
  });
});
