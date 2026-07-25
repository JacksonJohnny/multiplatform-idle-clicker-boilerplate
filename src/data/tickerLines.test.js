import { describe, expect, it } from 'vitest';
import { tickerLineAt, TICKER_LINES } from './tickerLines.js';

describe('tickerLines', () => {
  it('wraps indices', () => {
    expect(tickerLineAt(0)).toBe(TICKER_LINES[0]);
    expect(tickerLineAt(TICKER_LINES.length)).toBe(TICKER_LINES[0]);
    expect(tickerLineAt(-1)).toBe(TICKER_LINES[TICKER_LINES.length - 1]);
  });
});
