export const AUTO_TAP_CURSOR_ARC = 34;
export const AUTO_TAP_ORBIT_RADIUS = 150;
export const AUTO_TAP_CURSOR_DISPLAY_H = 44;
export const AUTO_TAP_RING_GAP = AUTO_TAP_CURSOR_DISPLAY_H + 2;

export const AUTO_TAP_VISUAL_RING_COUNT = 2;

export const AUTO_TAP_CURSOR_TINTS = [
  0xffffff, 0x9bd3ff, 0x9df4a3, 0xffd166, 0xff9f43, 0xff6b6b, 0xc792ff, 0x5ef2e0, 0xff8fd6, 0xffe08a,
];

function ringCapacity(radius) {
  return Math.max(12, Math.floor((Math.PI * 2 * radius) / AUTO_TAP_CURSOR_ARC));
}

export function getMaxAutoTapCursorSlots() {
  let total = 0;

  for (let ring = 0; ring < AUTO_TAP_VISUAL_RING_COUNT; ring += 1) {
    total += ringCapacity(AUTO_TAP_ORBIT_RADIUS + ring * AUTO_TAP_RING_GAP);
  }

  return total;
}

export function getAutoTapCursorTier(level, index, maxSlots = getMaxAutoTapCursorSlots()) {
  const safeLevel = Math.max(0, level | 0);
  const slots = Math.max(1, maxSlots | 0);
  const safeIndex = Math.max(0, index | 0);

  if (safeLevel <= slots) {
    return 0;
  }

  const extra = safeLevel - slots;
  const fullCycles = Math.floor(extra / slots);
  const partial = extra % slots;
  return fullCycles + (safeIndex < partial ? 1 : 0);
}

export function getAutoTapCursorTint(level, index, maxSlots = getMaxAutoTapCursorSlots()) {
  const tier = getAutoTapCursorTier(level, index, maxSlots);
  return AUTO_TAP_CURSOR_TINTS[tier % AUTO_TAP_CURSOR_TINTS.length];
}

export function getAutoTapCursorMultiplier(level, index, maxSlots = getMaxAutoTapCursorSlots()) {
  return getAutoTapCursorTier(level, index, maxSlots) + 1;
}
