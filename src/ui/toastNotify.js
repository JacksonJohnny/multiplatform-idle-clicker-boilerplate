import { COLORS, FONT_FAMILIES } from '../config/theme.js';

const DEFAULT_MS = 2200;

export function createToastNotify(scene) {
  const width = Math.min(420, scene.scale.width - 48);
  const x = scene.scale.width / 2;
  const y = scene.scale.height - (scene.navHeight ?? 0) - 40;
  const bg = scene.add
    .rectangle(x, y, width, 40, COLORS.overlayPanel, 0.94)
    .setStrokeStyle(2, COLORS.overlayBorder)
    .setDepth(4000)
    .setVisible(false)
    .setScrollFactor(0);
  const text = scene.add
    .text(x, y, '', {
      fontFamily: FONT_FAMILIES.body,
      fontSize: '16px',
      color: COLORS.whiteText,
      align: 'center',
      wordWrap: { width: width - 24 },
    })
    .setOrigin(0.5)
    .setDepth(4001)
    .setVisible(false)
    .setScrollFactor(0);

  let hideEvent = null;

  function hide() {
    bg.setVisible(false);
    text.setVisible(false);
    if (hideEvent) {
      hideEvent.remove(false);
      hideEvent = null;
    }
  }

  function show(message, options = {}) {
    const body = String(message ?? '').trim();
    if (!body) {
      return;
    }
    text.setText(body);
    text.setColor(options.danger ? COLORS.dangerText : COLORS.whiteText);
    bg.setStrokeStyle(2, options.danger ? COLORS.dangerBorder : COLORS.overlayBorder);
    const height = Math.max(40, text.height + 16);
    bg.setSize(width, height);
    bg.setPosition(x, y);
    text.setPosition(x, y);
    bg.setVisible(true);
    text.setVisible(true);
    if (hideEvent) {
      hideEvent.remove(false);
    }
    hideEvent = scene.time.delayedCall(options.durationMs ?? DEFAULT_MS, hide);
  }

  scene.events.once('shutdown', hide);

  return { show, hide };
}
