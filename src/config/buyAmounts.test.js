import { describe, expect, it } from 'vitest';
import { buyAmountWithModifiers, normalizeBuyAmount } from './buyAmounts.js';

describe('buyAmounts modifiers', () => {
  it('keeps the base amount without modifiers', () => {
    expect(buyAmountWithModifiers(25)).toBe(25);
    expect(buyAmountWithModifiers('max')).toBe('max');
  });

  it('uses Shift for ×10 and Ctrl for MAX (Ctrl wins)', () => {
    expect(buyAmountWithModifiers(1, { shift: true })).toBe(10);
    expect(buyAmountWithModifiers(25, { ctrl: true })).toBe('max');
    expect(buyAmountWithModifiers(1, { shift: true, ctrl: true })).toBe('max');
  });

  it('still normalizes legacy values', () => {
    expect(normalizeBuyAmount(100)).toBe(25);
  });
});
