// Never rename the default SAVE_KEY — use SAVE_VERSION + migrations instead.
// Optional Vite override: VITE_SAVE_KEY (see .env.example).
// Desktop id: src-tauri/tauri.conf.json (identifier). Mobile id: capacitor.config.json (appId).
const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};

export const SAVE_KEY = env.VITE_SAVE_KEY || 'clicker-phaser-save-v1';
export const LEGACY_SAVE_KEYS = [];
export const SAVE_VERSION = 10;
export const SCENE_KEY = 'clicker-scene';

export const GAME_CONFIG = {
  width: 1280,
  height: 720,
  backgroundColor: '#111822',
};

/** null = no offline earnings cap */
export const LOOP_CONFIG = {
  autoSaveDelayMs: 10000,
  maxOfflineSeconds: null,
};
