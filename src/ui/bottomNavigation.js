import { COLORS, FONT_FAMILIES, UI_LAYOUT } from '../config/theme.js';
import { UI_TEXT } from '../config/uiText.js';
import { IS_MOBILE_UI } from '../config/gameConfig.js';

const MIN_TAB_HIT = 44;

const MAX_VISIBLE_TABS = 5;

const DESKTOP_TABS = [
  { label: UI_TEXT.tabs[0], index: 0 },
  { label: UI_TEXT.tabs[3], index: 3 },
  { label: UI_TEXT.tabs[4], index: 4 },
];

export function buildBottomNavigation({ scene, navTop, navHeight, onSelect, onOverflow }) {
  const width = scene.scale.width;
  const tabs = UI_TEXT.tabs;
  const height = Math.max(navHeight, MIN_TAB_HIT);
  const container = scene.add.container(0, 0).setDepth(1000);
  const background = scene.add
    .rectangle(width / 2, navTop + height / 2, width, height, COLORS.nav, 1)
    .setStrokeStyle(2, COLORS.navBorder);
  container.add(background);

  const needsOverflow = tabs.length > MAX_VISIBLE_TABS;
  const visibleCount = needsOverflow ? MAX_VISIBLE_TABS - 1 : tabs.length;
  const slotCount = needsOverflow ? MAX_VISIBLE_TABS : tabs.length;
  const tabWidth = Math.max(MIN_TAB_HIT, width / slotCount);
  const overflowLabel = UI_TEXT.tabsOverflow ?? '…';
  const labelFontSize = tabWidth < 96 ? '11px' : tabs.length > 4 ? '12px' : '18px';

  const tabEntries = [];

  for (let index = 0; index < visibleCount; index += 1) {
    const x = tabWidth * index + tabWidth / 2;
    const indicator = scene.add
      .rectangle(x, navTop + 6, Math.max(24, tabWidth - 24), 4, COLORS.navIndicator)
      .setOrigin(0.5, 0);
    const hitArea = scene.add.zone(x, navTop + height / 2, tabWidth, height).setInteractive({ useHandCursor: true });
    const text = scene.add
      .text(x, navTop + height / 2 + 4, tabs[index], {
        fontFamily: FONT_FAMILIES.body,
        fontSize: labelFontSize,
        color: COLORS.inactiveText,
        fontStyle: '800',
      })
      .setOrigin(0.5);
    hitArea.on('pointerup', () => onSelect(index));
    container.add([indicator, hitArea, text]);
    tabEntries.push({ index, indicator, text, hitArea });
  }

  if (needsOverflow) {
    const overflowIndex = visibleCount;
    const x = tabWidth * overflowIndex + tabWidth / 2;
    const indicator = scene.add
      .rectangle(x, navTop + 6, Math.max(24, tabWidth - 24), 4, COLORS.navIndicator)
      .setOrigin(0.5, 0)
      .setVisible(false);
    const hitArea = scene.add.zone(x, navTop + height / 2, tabWidth, height).setInteractive({ useHandCursor: true });
    const text = scene.add
      .text(x, navTop + height / 2 + 4, overflowLabel, {
        fontFamily: FONT_FAMILIES.body,
        fontSize: '18px',
        color: COLORS.inactiveText,
        fontStyle: '800',
      })
      .setOrigin(0.5);
    hitArea.on('pointerup', () => {
      if (typeof onOverflow === 'function') {
        onOverflow(tabs.slice(visibleCount).map((label, i) => ({ label, index: visibleCount + i })));
        return;
      }

      const hidden = tabs.length - visibleCount;
      const current = scene.activePage ?? 0;
      const next = current < visibleCount || current >= tabs.length - 1 ? visibleCount : current + 1;
      onSelect(next % tabs.length < visibleCount && hidden > 0 ? visibleCount : next);
    });
    container.add([indicator, hitArea, text]);
    tabEntries.push({ index: -1, indicator, text, hitArea, isOverflow: true, hiddenStart: visibleCount });
  }

  return tabEntries;
}

export function buildDesktopTopTabs({ scene, onSelect }) {
  const cols = scene.uiColumns;
  const y = UI_LAYOUT.sideMenuY ?? 40;
  const gap = 32;
  const middleCenterX = cols.middleLeft + cols.middleWidth / 2;
  const tabEntries = [];

  const measured = DESKTOP_TABS.map((tab) => {
    const text = scene.add
      .text(0, y, tab.label, {
        fontFamily: FONT_FAMILIES.body,
        fontSize: '18px',
        color: COLORS.inactiveText,
        fontStyle: '800',
      })
      .setOrigin(0.5)
      .setDepth(1000)
      .setInteractive({ useHandCursor: true });
    return { tab, text, width: text.width };
  });

  const totalWidth = measured.reduce((sum, entry) => sum + entry.width, 0) + gap * (measured.length - 1);
  let x = middleCenterX - totalWidth / 2;

  measured.forEach(({ tab, text, width }) => {
    const centerX = x + width / 2;
    text.setPosition(centerX, y);
    const indicator = scene.add
      .rectangle(centerX, y + 16, Math.max(28, width), 3, COLORS.navIndicator)
      .setOrigin(0.5, 0.5)
      .setDepth(1000)
      .setVisible(false);
    text.on('pointerup', () => onSelect(tab.index));
    tabEntries.push({ index: tab.index, indicator, text, hitArea: text });
    x += width + gap;
  });

  return tabEntries;
}

export function getNavHeight() {
  if (!IS_MOBILE_UI) {
    return 0;
  }
  return Math.max(UI_LAYOUT.navHeight, MIN_TAB_HIT);
}
