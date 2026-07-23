import { describe, expect, it } from 'vitest';
import {
  AUTO_TAP_CURSOR_TINTS,
  getAutoTapCursorMultiplier,
  getAutoTapCursorTint,
  getMaxAutoTapCursorSlots,
} from '../lib/autoTapProgress.js';

describe('autoTapProgress color tiers', () => {
  const slots = getMaxAutoTapCursorSlots();

  it('fills two rings at 63 slots with current spacing', () => {
    expect(slots).toBe(63);
  });

  it('keeps all cursors white while the rings are filling', () => {
    expect(getAutoTapCursorTint(1, 0, slots)).toBe(AUTO_TAP_CURSOR_TINTS[0]);
    expect(getAutoTapCursorTint(slots, slots - 1, slots)).toBe(AUTO_TAP_CURSOR_TINTS[0]);
    expect(getAutoTapCursorMultiplier(slots, 0, slots)).toBe(1);
  });

  it('paints one cursor per level after the rings are full', () => {
    expect(getAutoTapCursorTint(slots + 1, 0, slots)).toBe(AUTO_TAP_CURSOR_TINTS[1]);
    expect(getAutoTapCursorTint(slots + 1, 1, slots)).toBe(AUTO_TAP_CURSOR_TINTS[0]);
    expect(getAutoTapCursorMultiplier(slots + 1, 0, slots)).toBe(2);
    expect(getAutoTapCursorMultiplier(slots + 1, 1, slots)).toBe(1);
    expect(getAutoTapCursorTint(slots * 2, slots - 1, slots)).toBe(AUTO_TAP_CURSOR_TINTS[1]);
    expect(getAutoTapCursorTint(slots * 2 + 1, 0, slots)).toBe(AUTO_TAP_CURSOR_TINTS[2]);
    expect(getAutoTapCursorMultiplier(slots * 2 + 1, 0, slots)).toBe(3);
  });
});
