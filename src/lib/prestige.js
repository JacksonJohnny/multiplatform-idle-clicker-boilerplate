import Decimal from 'decimal.js';

export function asNonNegInt(value) {
  let n = Math.floor(Number(value));
  if (!Number.isFinite(n)) {
    return 0;
  }
  // Heal values truncated with `| 0` (signed int32 wrap), e.g. 3258494147 → -1036473149.
  if (n < 0) {
    n = n >>> 0;
  }
  return n;
}

export function calculateAscensionTokenGain(coinsThisAscension) {
  const amount = coinsThisAscension instanceof Decimal ? coinsThisAscension : new Decimal(coinsThisAscension || 0);
  if (amount.lt(1e6)) {
    return 0;
  }

  return Math.floor(amount.div(1e6).sqrt().toNumber());
}

export function getAscensionTokenIdleMultiplier(tokens) {
  return 1 + asNonNegInt(tokens) * 0.01;
}
