import { COLORS, FONT_FAMILIES } from '../config/theme.js';
import { BUY_AMOUNT_OPTIONS, buyAmountLabel } from '../config/buyAmounts.js';
import { IS_MOBILE_UI } from '../config/gameConfig.js';

const MIN_HIT = 44;

export function buildBuyAmountBar({ scene, y, selected, onSelect, bounds }) {
  const desktop = !IS_MOBILE_UI;
  const left = desktop ? (bounds?.left ?? 0) : 0;
  const width = desktop ? (bounds?.width ?? scene.scale.width) : scene.scale.width;
  const padding = desktop ? 0 : 28;
  const gap = desktop ? 4 : 10;
  const count = BUY_AMOUNT_OPTIONS.length;
  const inner = width - padding * 2;
  const buttonWidth = Math.max(desktop ? 28 : MIN_HIT, (inner - gap * (count - 1)) / count);
  const buttonHeight = desktop ? 28 : Math.max(MIN_HIT, 44);
  const fontSize = desktop ? '12px' : '16px';
  const stroke = desktop ? 1 : 2;
  const startX = left + padding + buttonWidth / 2;

  const buttons = BUY_AMOUNT_OPTIONS.map((amount, index) => {
    const x = startX + index * (buttonWidth + gap);
    const background = scene.add
      .rectangle(x, y, buttonWidth, buttonHeight, COLORS.panel)
      .setStrokeStyle(stroke, COLORS.panelBorder)
      .setInteractive({ useHandCursor: true });
    const label = scene.add
      .text(x, y, buyAmountLabel(amount), {
        fontFamily: FONT_FAMILIES.display,
        fontSize,
        color: COLORS.inactiveText,
      })
      .setOrigin(0.5);

    background.on('pointerup', () => onSelect(amount));
    return { amount, background, label };
  });

  function refresh(nextSelected) {
    buttons.forEach((button) => {
      const active = button.amount === nextSelected;
      button.background.setFillStyle(active ? COLORS.primary : COLORS.panel);
      button.background.setStrokeStyle(stroke, active ? COLORS.primaryBorder : COLORS.panelBorder);
      button.label.setColor(active ? COLORS.primaryText : COLORS.inactiveText);
    });
  }

  refresh(selected);

  return {
    buttons,
    nodes: buttons.flatMap((button) => [button.background, button.label]),
    setVisible(visible) {
      buttons.forEach((button) => {
        button.background.setVisible(visible);
        button.label.setVisible(visible);
      });
    },
    refresh,
  };
}
