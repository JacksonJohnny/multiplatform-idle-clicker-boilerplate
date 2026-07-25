import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { SAVE_KEY } from '../config/gameConfig.js';
import { loadSettings, saveSettings } from './settingsStorage.js';
import { loadGameState, saveGameState } from './saveStorage.js';
import { normalizeSaveState } from '../lib/saveState.js';

describe('settingsStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('round-trips sound and buy amount', () => {
    saveSettings({ soundEnabled: false, buyAmount: 25 });
    expect(loadSettings()).toEqual({ soundEnabled: false, buyAmount: 25 });
  });
});

describe('resetSave query param', () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/?resetSave=1');
  });

  afterEach(() => {
    localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('purges save and settings when resetSave=1', () => {
    saveGameState({ coins: '99', upgrades: [], boosts: [] });
    saveSettings({ soundEnabled: false, buyAmount: 10 });
    expect(localStorage.getItem(SAVE_KEY)).toBeTruthy();
    expect(localStorage.getItem(`${SAVE_KEY}-settings`)).toBeTruthy();

    const loaded = loadGameState();
    expect(loaded).toBeNull();
    expect(localStorage.getItem(SAVE_KEY)).toBeNull();
    expect(localStorage.getItem(`${SAVE_KEY}-settings`)).toBeNull();
  });
});

describe('achievement id aliases', () => {
  it('maps legacy stars-10 to ascension-tokens-10', () => {
    const normalized = normalizeSaveState({
      coins: '0',
      unlockedAchievements: ['stars-10', 'prestige-1', 'stars-10'],
    });
    expect(normalized.unlockedAchievements).toEqual(['ascension-tokens-10', 'prestige-1']);
  });
});
