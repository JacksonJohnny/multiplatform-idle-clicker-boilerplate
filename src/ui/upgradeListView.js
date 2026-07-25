import { COLORS, FONT_FAMILIES } from '../config/theme.js';
import { GENERATOR_EFFICIENCY_STAR_MAX } from '../data/metaUpgrades.js';
import { IS_MOBILE_UI, POINTER_DRAG_THRESHOLD_PX } from '../config/gameConfig.js';

export function buildUpgradeListView({ scene, container, upgrades, layout, onBuy }) {
  const { rowHeight, rowGap, compactRows, listTop, listLeft, listWidth } = layout;
  const step = rowHeight + rowGap;
  const startY = listTop + rowHeight / 2;
  const desktopStore = !IS_MOBILE_UI;
  const labelFontSize = desktopStore ? '15px' : compactRows ? '20px' : '24px';
  const infoFontSize = desktopStore ? '13px' : compactRows ? '15px' : '17px';
  const costFontSize = desktopStore ? '13px' : compactRows ? '16px' : '18px';
  const rowCenterX = listLeft + listWidth / 2;
  const levelX = listLeft + listWidth - 8;
  const labelX = listLeft + 14;
  const costRail = desktopStore ? Math.min(150, Math.floor(listWidth * 0.42)) : Math.floor(listWidth * 0.4);
  const infoMaxWidth = Math.max(72, listWidth - costRail - 20);
  const starFontSize = desktopStore ? '11px' : compactRows ? '14px' : '15px';
  const topY = desktopStore ? 0.28 : 0.22;
  const botY = desktopStore ? 0.28 : 0.22;

  return upgrades.map((upgrade, index) => {
    const y = startY + index * step;
    const rowBg = scene.add
      .rectangle(rowCenterX, y, listWidth - 2, rowHeight, COLORS.upgradeRow, 0.95)
      .setStrokeStyle(2, COLORS.upgradeRowBorder)
      .setInteractive({ useHandCursor: true });
    const label = scene.add
      .text(labelX, y - rowHeight * topY, '', {
        fontFamily: FONT_FAMILIES.body,
        fontSize: labelFontSize,
        color: COLORS.upgradeText,
        fontStyle: '700',
      })
      .setOrigin(0, 0.5);
    const level = scene.add
      .text(levelX, y - rowHeight * topY, '', {
        fontFamily: FONT_FAMILIES.body,
        fontSize: labelFontSize,
        color: COLORS.upgradeText,
        fontStyle: '700',
      })
      .setOrigin(1, 0.5);
    // Efficiency ★ pips (not prestige / Ascension Tokens).
    const efficiencyPips = Array.from({ length: GENERATOR_EFFICIENCY_STAR_MAX }, () =>
      scene.add
        .text(0, y - rowHeight * topY, '★', {
          fontFamily: 'Arial, "Segoe UI Symbol", sans-serif',
          fontSize: starFontSize,
          color: COLORS.efficiencyPip,
        })
        .setOrigin(0, 0.5)
        .setVisible(false),
    );
    const info = scene.add
      .text(labelX, y + rowHeight * botY, '', {
        fontFamily: FONT_FAMILIES.body,
        fontSize: infoFontSize,
        color: COLORS.upgradeInfo,
        wordWrap: { width: infoMaxWidth },
      })
      .setOrigin(0, 0.5);
    const cost = scene.add
      .text(levelX, y + rowHeight * botY, '', {
        fontFamily: FONT_FAMILIES.body,
        fontSize: costFontSize,
        color: COLORS.whiteText,
        fontStyle: '800',
      })
      .setOrigin(1, 0.5);

    rowBg.on('pointerdown', (pointer) => {
      rowBg.pointerDownAt = { x: pointer.x, y: pointer.y };
      scene.beginPageSwipe?.(pointer);
    });
    rowBg.on('pointerup', (pointer) => {
      const start = rowBg.pointerDownAt;
      const moved = start && Math.hypot(pointer.x - start.x, pointer.y - start.y) > POINTER_DRAG_THRESHOLD_PX;
      rowBg.pointerDownAt = null;
      if (!moved) {
        onBuy(upgrade);
      }
    });

    const item = { id: upgrade.id, baseY: y, rowBg, label, level, info, cost, efficiencyPips };
    container.add([rowBg, label, level, info, cost, ...efficiencyPips]);
    return item;
  });
}
