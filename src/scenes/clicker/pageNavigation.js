import { COLORS } from '../../config/theme.js';
import { IS_MOBILE_UI } from '../../config/gameConfig.js';

export const PAGE = {
  UPGRADE: 0,
  STORE: 1,
  TAP: 2,
  STATUS: 3,
  PRESTIGE: 4,
  SETTINGS: 5,
};

const MAIN_PAGE_MAX = PAGE.PRESTIGE;
const DESKTOP_PAGES = [PAGE.UPGRADE, PAGE.STATUS, PAGE.PRESTIGE];
export const SETTINGS_PAGE = PAGE.SETTINGS;

export function isTapSurfaceActive(scene) {
  if (!scene.gameStarted || scene.activePage === SETTINGS_PAGE) {
    return false;
  }
  return IS_MOBILE_UI ? scene.activePage === PAGE.TAP : true;
}

export function isStoreInteractive(scene) {
  if (!scene.gameStarted || scene.activePage === SETTINGS_PAGE) {
    return false;
  }
  return IS_MOBILE_UI ? scene.activePage === PAGE.STORE : true;
}

function stepMainPage(scene, direction) {
  if (IS_MOBILE_UI) {
    setActivePage(scene, Math.min(MAIN_PAGE_MAX, Math.max(0, scene.activePage + direction)));
    return;
  }
  let i = DESKTOP_PAGES.indexOf(scene.activePage);
  if (i < 0) i = 0;
  setActivePage(scene, DESKTOP_PAGES[Math.min(DESKTOP_PAGES.length - 1, Math.max(0, i + direction))]);
}

export function setupPageSwipe(scene) {
  if (IS_MOBILE_UI) {
    scene.input.on('pointerdown', (pointer) => {
      beginPageSwipe(scene, pointer);
    });

    scene.input.on('pointerup', (pointer) => {
      if (!scene.pageSwipeStart) {
        scene.pageSwipeStart = null;
        return;
      }

      const deltaX = pointer.x - scene.pageSwipeStart.x;
      const deltaY = pointer.y - scene.pageSwipeStart.y;
      scene.pageSwipeStart = null;

      const scroll =
        scene.activePage === PAGE.STORE
          ? scene.upgradeScroll
          : scene.activePage === PAGE.UPGRADE
            ? scene.metaScroll
            : scene.activePage === PAGE.STATUS
              ? scene.statusScroll
              : null;
      if (scroll?.lastGestureAxis === 'vertical') {
        return;
      }

      if (Math.abs(deltaX) < 56 || Math.abs(deltaX) <= Math.abs(deltaY)) {
        return;
      }

      stepMainPage(scene, deltaX < 0 ? 1 : -1);
    });
  }

  scene.input.keyboard?.on('keydown-LEFT', () => {
    if (!scene.gameStarted || scene.activePage === SETTINGS_PAGE || scene.offlineReturn || scene.confirmDialog) {
      return;
    }
    stepMainPage(scene, -1);
  });
  scene.input.keyboard?.on('keydown-RIGHT', () => {
    if (!scene.gameStarted || scene.activePage === SETTINGS_PAGE || scene.offlineReturn || scene.confirmDialog) {
      return;
    }
    stepMainPage(scene, 1);
  });
}

export function beginPageSwipe(scene, pointer) {
  if (
    !IS_MOBILE_UI ||
    !scene.gameStarted ||
    scene.activePage === SETTINGS_PAGE ||
    scene.offlineReturn ||
    scene.confirmDialog ||
    pointer.y >= scene.navTop
  ) {
    return;
  }

  scene.pageSwipeStart = { x: pointer.x, y: pointer.y };
}

export function setActivePage(scene, index) {
  if (scene.offlineReturn || scene.confirmDialog) {
    scene.activePage = Math.min(SETTINGS_PAGE, Math.max(0, index));
    scene.upgradeCamera?.setVisible(false);
    scene.metaCamera?.setVisible(false);
    scene.statusCamera?.setVisible(false);
    scene.upgradeScroll?.setVisible(false);
    scene.metaScroll?.setVisible(false);
    scene.statusScroll?.setVisible(false);
    return;
  }

  scene.activePage = Math.min(SETTINGS_PAGE, Math.max(0, index));
  const showSettings = scene.activePage === SETTINGS_PAGE;
  const showMeta = scene.activePage === PAGE.UPGRADE;
  const showStatus = scene.activePage === PAGE.STATUS;
  const showPrestige = scene.activePage === PAGE.PRESTIGE;
  const showStore = IS_MOBILE_UI ? scene.activePage === PAGE.STORE : !showSettings;
  const showGame = IS_MOBILE_UI ? scene.activePage === PAGE.TAP : !showSettings;

  scene.gamePage.setVisible(showGame);
  scene.storeTitle.setVisible(showStore);
  scene.buyAmountBar?.setVisible(showStore);
  scene.upgradePanelBg.setVisible(showStore);
  scene.upgradeCamera.setVisible(scene.gameStarted && showStore);
  scene.upgradeScroll.setVisible(showStore);
  if (!showStore) {
    scene.storeTooltip?.hide();
  }
  scene.metaUpgradesTitle.setVisible(showMeta && IS_MOBILE_UI);
  scene.metaPanelBg.setVisible(showMeta);
  scene.metaCamera.setVisible(scene.gameStarted && showMeta);
  scene.metaScroll.setVisible(showMeta);
  scene.statusPage?.setVisible(showStatus);
  scene.statusPanelBg?.setVisible(showStatus);
  scene.statusCamera?.setVisible(scene.gameStarted && showStatus);
  scene.statusScroll?.setVisible(showStatus);
  scene.statusView?.title?.setVisible(showStatus && IS_MOBILE_UI);
  scene.prestigePage?.setVisible(showPrestige);
  scene.prestigeView?.title?.setVisible(showPrestige && IS_MOBILE_UI);
  scene.settingsPage.setVisible(showSettings);

  if (showMeta) {
    scene.updateMetaListLayout();
  } else {
    scene.metaEmptyText.setVisible(false);
  }

  if (showStatus) {
    scene.refreshStatusList?.();
  }
  if (showPrestige) {
    scene.prestigeView?.refresh(scene.state, scene.engine.getPrestigePreview());
  }

  scene.settingsButtonIcon.setColor(showSettings ? COLORS.accent : COLORS.navIndicator);

  scene.navTabs?.forEach((tab) => {
    if (tab.isOverflow) {
      const inOverflow = scene.activePage >= (tab.hiddenStart ?? 0);
      tab.indicator.setVisible(inOverflow && scene.activePage !== SETTINGS_PAGE);
      tab.text.setColor(inOverflow ? COLORS.activeText : COLORS.inactiveText);
      return;
    }
    const active = tab.index === scene.activePage;
    tab.indicator.setVisible(active);
    tab.text.setColor(active ? COLORS.activeText : COLORS.inactiveText);
  });
}
