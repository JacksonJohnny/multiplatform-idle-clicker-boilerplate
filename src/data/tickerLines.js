export const TICKER_LINES = Object.freeze([
  'Idle progress continues while you are away.',
  'Tip: Shift buys ×10. Ctrl buys MAX.',
  'Ascension Tokens permanently boost idle income.',
  'Achievements raise your idle multiplier.',
  'Backup your save from Settings.',
  'MAX buy spends only what you can afford.',
  'Prestige soft-resets the run, not Ascension Tokens.',
  'Efficiency upgrades stack on each generator.',
]);

export function tickerLineAt(index) {
  const i = ((Number(index) || 0) % TICKER_LINES.length + TICKER_LINES.length) % TICKER_LINES.length;
  return TICKER_LINES[i];
}
