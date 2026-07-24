import { describe, expect, it } from 'vitest';
import { getUiColumns } from './theme.js';
import { getNavHeight } from '../ui/bottomNavigation.js';

describe('desktop cookie-clicker layout', () => {
  it('uses tap | middle | narrow store columns', () => {
    const cols = getUiColumns(1280);
    expect(cols.leftWidth + cols.middleWidth + cols.rightWidth).toBe(1280);
    expect(cols.leftWidth / 1280).toBeCloseTo(0.32, 2);
    expect(cols.rightWidth / 1280).toBeCloseTo(0.18, 2);
    expect(cols.middleWidth).toBeGreaterThan(cols.leftWidth);
    expect(cols.rightLeft).toBe(cols.leftWidth + cols.middleWidth);
    expect(getNavHeight()).toBe(0);
  });
});
