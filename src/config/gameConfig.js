// Never rename the default SAVE_KEY — use SAVE_VERSION + migrations instead.

import { isMobileUi } from './platform.js';

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

export const SAVE_KEY = env.VITE_SAVE_KEY || 'clicker-phaser-save-v1';
export const LEGACY_SAVE_KEYS = [];
export const SAVE_VERSION = 10;
export const SCENE_KEY = 'clicker-scene';

export const IS_MOBILE_UI = isMobileUi();

const DESKTOP = {
  width: 1280,
  height: 720,
  minWidth: 960,
  minHeight: 540,
  backgroundColor: '#111822',
};

const MOBILE = {
  width: 540,
  height: 960,
  minWidth: 320,
  minHeight: 568,
  backgroundColor: '#111822',
};

export const GAME_CONFIG = IS_MOBILE_UI ? MOBILE : DESKTOP;

/** null = no offline earnings cap */
export const LOOP_CONFIG = {
  autoSaveDelayMs: 10000,
  maxOfflineSeconds: null,
};
