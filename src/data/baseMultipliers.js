import Decimal from 'decimal.js';
import tiers from './baseMultiplierTiers.json';

export function buildBaseMultipliers() {
  return tiers.map((tier, index) => ({
    id: `base-multiplier-${index + 1}`,
    name: `BASE MULTIPLIER ${index + 1}`,
    kind: 'base_multiplier',
    requiredTotalCoins: String(tier.unlock),
    multiplier: tier.mult,
    cost: new Decimal(tier.cost).toFixed(0),
  }));
}
