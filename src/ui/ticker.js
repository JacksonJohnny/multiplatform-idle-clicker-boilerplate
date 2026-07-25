import { COLORS, FONT_FAMILIES, UI_LAYOUT } from '../config/theme.js';
import { TICKER_LINES, tickerLineAt } from '../data/tickerLines.js';

const ROTATE_MS = 12000;

export function createTicker(scene) {
  const x = scene.tapCenterX ?? scene.scale.width / 2;
  const y = Math.max(18, (UI_LAYOUT.titleY ?? 48) - 28);
  const maxWidth = (scene.hudMaxWidth ?? scene.uiColumns?.leftWidth ?? scene.scale.width) - 8;
  const text = scene.add
    .text(x, y, tickerLineAt(0), {
      fontFamily: FONT_FAMILIES.body,
      fontSize: '14px',
      color: COLORS.mutedText,
      align: 'center',
      wordWrap: { width: Math.max(120, maxWidth) },
    })
    .setOrigin(0.5)
    .setDepth(50);

  let index = 0;
  scene.time.addEvent({
    delay: ROTATE_MS,
    loop: true,
    callback: () => {
      index = (index + 1) % TICKER_LINES.length;
      text.setText(tickerLineAt(index));
      text.setAlpha(0);
      scene.tweens.add({ targets: text, alpha: 1, duration: 280, ease: 'Sine.Out' });
    },
  });

  return text;
}
