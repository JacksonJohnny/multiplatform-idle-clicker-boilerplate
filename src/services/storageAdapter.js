import { SAVE_KEY, LEGACY_SAVE_KEYS } from '../config/gameConfig.js';

const SETTINGS_SUFFIX = '-settings';

export function storageGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (_error) {
    return null;
  }
}

export function storageSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (_error) {}
}

export function storageRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (_error) {}
}

export function purgeGameStorageKeys() {
  const keys = [SAVE_KEY, `${SAVE_KEY}${SETTINGS_SUFFIX}`, ...LEGACY_SAVE_KEYS];
  keys.forEach((key) => storageRemoveItem(key));
}
