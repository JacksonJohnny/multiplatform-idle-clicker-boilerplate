import { COLORS, FONT_FAMILIES, UI_LAYOUT } from '../../config/theme.js';
import { UI_TEXT } from '../../config/uiText.js';
import { IS_MOBILE_UI } from '../../config/gameConfig.js';
import { normalizeBuyAmount } from '../../config/buyAmounts.js';
import { ListScrollController } from '../../controllers/ListScrollController.js';
import { buildMetaUpgradesView } from '../../ui/metaUpgradesView.js';
import { buildStatusView } from '../../ui/statusView.js';
import { buildPrestigeView } from '../../ui/prestigeView.js';
import { buildSettingsView, buildSettingsButton } from '../../ui/settingsView.js';
import { buildBottomNavigation, buildDesktopTopTabs } from '../../ui/bottomNavigation.js';
import { buildBuyAmountBar } from '../../ui/buyAmountBar.js';
import { buildUpgradeListView } from '../../ui/upgradeListView.js';
import { createStoreItemTooltip, bindStoreItemTooltips } from '../../ui/storeItemTooltip.js';
import { setupListViewportCameras } from './viewportCameras.js';
import { isStoreInteractive, PAGE } from './pageNavigation.js';

function createFullHeightListLayout(
  scene,
  { panelTop = UI_LAYOUT.panelTop, rowHeight, rowGap = 0, panelPadding = 12, column = 'right' } = {},
) {
  const cols = scene.uiColumns;
  let colLeft;
  let colWidth;
  if (column === 'middle') {
    colLeft = cols.middleLeft;
    colWidth = cols.middleWidth || cols.leftWidth;
  } else if (column === 'left') {
    colLeft = 0;
    colWidth = cols.leftWidth;
  } else {
    colLeft = cols.rightLeft;
    colWidth = cols.rightWidth;
  }
  const colCenterX = colLeft + colWidth / 2;
  const height = scene.scale.height;
  const panelBottomMargin = scene.navHeight + 14;
  const panelHeight = height - panelTop - panelBottomMargin;
  const panelCenterY = height - panelBottomMargin - panelHeight / 2;
  const panelTopY = panelCenterY - panelHeight / 2;
  const panelBottomY = panelCenterY + panelHeight / 2;
  const listTop = panelTopY + panelPadding;
  const listBottom = panelBottomY - panelPadding;
  const tight = !IS_MOBILE_UI && (column === 'right' || column === 'middle');
  const edge = tight ? 8 : 17;
  const padX = tight ? 16 : 24;

  return {
    rowHeight,
    rowGap,
    panelCenterY,
    panelTopY,
    panelBottomY,
    panelCenterX: colCenterX,
    listLeft: colLeft + edge + padX,
    listWidth: colWidth - (edge + padX) * 2,
    panelWidth: colWidth - edge * 2,
    titleX: colLeft + edge + padX,
    listTop,
    listBottom,
    visibleListHeight: listBottom - listTop,
    listHeight: 0,
    panelHeight,
  };
}

export function createStorePage(scene) {
  const compactRows = IS_MOBILE_UI ? scene.state.upgrades.length > 4 : true;
  const rowHeight = IS_MOBILE_UI ? Math.max(compactRows ? 72 : 84, 72) : 56;
  const rowGap = IS_MOBILE_UI ? (compactRows ? 12 : 16) : 6;
  const layout = createFullHeightListLayout(scene, {
    rowHeight,
    rowGap,
    panelPadding: IS_MOBILE_UI ? 12 : 8,
    column: 'right',
  });
  scene.upgradeLayout = { ...layout, compactRows };

  scene.storeTitle = scene.add
    .text(layout.titleX, UI_LAYOUT.sectionTitleY, UI_TEXT.storeTitle, {
      fontFamily: FONT_FAMILIES.display,
      fontSize: IS_MOBILE_UI ? '24px' : '18px',
      color: COLORS.accentText,
    })
    .setOrigin(0, 0.5);

  const titleBottom = scene.storeTitle.y + scene.storeTitle.height / 2;
  const buyBarY = (titleBottom + layout.panelTopY) / 2;

  scene.buyAmountBar = buildBuyAmountBar({
    scene,
    y: buyBarY,
    selected: normalizeBuyAmount(scene.settings.buyAmount),
    onSelect: (amount) => scene.setBuyAmount(amount),
    bounds: IS_MOBILE_UI ? { left: 0, width: scene.scale.width } : { left: layout.listLeft, width: layout.listWidth },
  });
  scene.buyAmountBar.setVisible(false);

  scene.upgradePanelBg = scene.add
    .rectangle(layout.panelCenterX, layout.panelCenterY, layout.panelWidth, layout.panelHeight, COLORS.storePanel, 0.86)
    .setStrokeStyle(2, COLORS.storePanelBorder);

  scene.upgradeContent = scene.add.container(0, 0);
  scene.upgradeItems = buildUpgradeListView({
    scene,
    container: scene.upgradeContent,
    upgrades: scene.state.upgrades,
    layout: scene.upgradeLayout,
    onBuy: (upgrade) => scene.buyStoreUpgrade(upgrade),
  });
}

export function createMetaUpgradePage(scene) {
  const layout = createFullHeightListLayout(scene, {
    rowHeight: 98,
    rowGap: 16,
    panelPadding: 12,
    panelTop: IS_MOBILE_UI ? UI_LAYOUT.panelTop : 88,
    column: IS_MOBILE_UI ? 'left' : 'middle',
  });
  scene.metaLayout = layout;

  scene.metaUpgradesTitle = scene.add
    .text(layout.titleX, UI_LAYOUT.sectionTitleY, UI_TEXT.metaUpgradesTitle, {
      fontFamily: FONT_FAMILIES.display,
      fontSize: '24px',
      color: COLORS.accentText,
    })
    .setOrigin(0, 0.5)
    .setVisible(IS_MOBILE_UI);

  scene.metaPanelBg = scene.add
    .rectangle(layout.panelCenterX, layout.panelCenterY, layout.panelWidth, layout.panelHeight, COLORS.storePanel, 0.86)
    .setStrokeStyle(2, COLORS.storePanelBorder);

  scene.metaEmptyText = scene.add
    .text(layout.panelCenterX, layout.panelCenterY, UI_TEXT.unlockHint, {
      fontFamily: FONT_FAMILIES.body,
      fontSize: '20px',
      color: COLORS.mutedText,
    })
    .setOrigin(0.5)
    .setVisible(false);

  scene.metaContent = scene.add.container(0, 0);
  // Persist field remains state.boosts (legacy save key).
  scene.metaItems = buildMetaUpgradesView({
    scene,
    container: scene.metaContent,
    metaUpgrades: scene.state.boosts,
    layout: scene.metaLayout,
    onPointerDown: (pointer) => scene.beginPageSwipe(pointer),
    onBuy: (meta) => scene.buyMetaUpgrade(meta),
  });
}

export function createStatusPage(scene) {
  const layout = createFullHeightListLayout(scene, {
    rowHeight: 28,
    rowGap: 0,
    panelPadding: IS_MOBILE_UI ? 12 : 20,
    panelTop: IS_MOBILE_UI ? UI_LAYOUT.panelTop : 88,
    column: IS_MOBILE_UI ? 'left' : 'middle',
  });
  scene.statusLayout = layout;

  scene.statusPage = scene.add.container(0, 0).setVisible(false);
  scene.statusPanelBg = scene.add
    .rectangle(layout.panelCenterX, layout.panelCenterY, layout.panelWidth, layout.panelHeight, COLORS.storePanel, 0.86)
    .setStrokeStyle(2, COLORS.storePanelBorder)
    .setVisible(false);
  scene.statusContent = scene.add.container(0, 0);
  scene.statusView = buildStatusView({
    scene,
    content: scene.statusContent,
    listTop: layout.listTop,
    listLeft: layout.listLeft,
  });
  scene.statusView.title.setVisible(IS_MOBILE_UI);
  scene.statusPage.add(scene.statusView.title);
}

export function createPrestigePage(scene) {
  scene.prestigePage = scene.add.container(0, 0).setVisible(false);
  scene.prestigeView = buildPrestigeView({
    scene,
    container: scene.prestigePage,
    onRequestPrestige: () => scene.requestPrestige(),
  });
}

export function createSettingsChrome(scene) {
  scene.settingItems = buildSettingsView({
    scene,
    container: scene.settingsPage,
    onToggle: (settingKey) => scene.toggleSetting(settingKey),
  });
  const settingsButton = buildSettingsButton(scene, () => scene.toggleSettingsPage());
  scene.settingsButtonBackground = settingsButton.background;
  scene.settingsButtonIcon = settingsButton.icon;

  if (IS_MOBILE_UI) {
    scene.navTabs = buildBottomNavigation({
      scene,
      navTop: scene.navTop,
      navHeight: scene.navHeight,
      onSelect: (index) => scene.selectPage(index),
    });
  } else {
    const cols = scene.uiColumns;
    if (cols.middleWidth > 0) {
      scene.add
        .rectangle(cols.middleLeft, scene.scale.height / 2, 2, scene.scale.height, COLORS.navBorder, 0.45)
        .setOrigin(0.5);
    }
    scene.add
      .rectangle(cols.rightLeft, scene.scale.height / 2, 2, scene.scale.height, COLORS.navBorder, 0.85)
      .setOrigin(0.5);
    scene.navTabs = buildDesktopTopTabs({
      scene,
      onSelect: (index) => scene.selectPage(index),
    });
  }
}

export function setupListInteraction(scene) {
  setupListViewportCameras(scene, [
    { key: 'upgradeCamera', content: scene.upgradeContent, layout: scene.upgradeLayout },
    { key: 'metaCamera', content: scene.metaContent, layout: scene.metaLayout },
    { key: 'statusCamera', content: scene.statusContent, layout: scene.statusLayout },
  ]);
  scene.statusCamera.setVisible(false);

  scene.upgradeScroll = new ListScrollController({
    scene,
    layout: scene.upgradeLayout,
    items: scene.upgradeItems,
    isEnabled: () => isStoreInteractive(scene),
  });
  scene.upgradeScroll.setup();

  scene.metaScroll = new ListScrollController({
    scene,
    layout: scene.metaLayout,
    items: scene.metaItems,
    isEnabled: () => scene.gameStarted && scene.activePage === PAGE.UPGRADE,
    syncItem: (item, y) => {
      item.background.y = y;
      item.name.y = y - 22;
      item.condition.y = y + 8;
      item.effect.y = y + 30;
      item.buyButton.y = y;
      item.buyText.y = y;
    },
  });
  scene.metaScroll.setup();

  scene.statusScroll = new ListScrollController({
    scene,
    layout: scene.statusLayout,
    items: scene.statusView.items,
    isEnabled: () => scene.gameStarted && scene.activePage === PAGE.STATUS,
    syncItem: (item, y) => {
      const yy = y + (item.offsetY ?? 0);
      (item.nodes ?? [item.node]).forEach((node) => {
        node.y = yy;
      });
    },
  });
  scene.statusScroll.setup();
  scene.statusScroll.setVisible(false);

  scene.storeTooltip = createStoreItemTooltip(scene);
  bindStoreItemTooltips(scene);
}
