import { describe, expect, it } from 'vitest';
import { isMobileUi } from './platform.js';

describe('isMobileUi', () => {
  it('honors ?ui= override', () => {
    const original = window.location.search;
    window.history.replaceState({}, '', '?ui=mobile');
    expect(isMobileUi()).toBe(true);
    window.history.replaceState({}, '', '?ui=desktop');
    expect(isMobileUi()).toBe(false);
    window.history.replaceState({}, '', original || '/');
  });
});
