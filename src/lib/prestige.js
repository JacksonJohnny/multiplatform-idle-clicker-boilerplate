import Decimal from 'decimal.js';

export function calculateAscensionTokenGain(coinsThisAscension) {
  const amount = coinsThisAscension instanceof Decimal ? coinsThisAscension : new Decimal(coinsThisAscension || 0);
  if (amount.lt(1e6)) {
    return 0;
  }

  return Math.floor(amount.div(1e6).sqrt().toNumber());
}

export function getAscensionTokenIdleMultiplier(tokens) {
  const safe = Math.max(0, tokens | 0);
  return 1 + safe * 0.01;
}
