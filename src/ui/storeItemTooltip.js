import { COLORS, FONT_FAMILIES } from '../config/theme.js';
import { UI_TEXT } from '../config/uiText.js';
import { AUTO_TAP_INTERVAL_SECONDS } from '../data/upgrades.js';
import { IS_MOBILE_UI } from '../config/gameConfig.js';
import {
  formatCoins,
  formatIdleSharePercent,
  getGeneratorAutoRate,
  getGeneratorIdleShare,
  calculateStats,
} from '../lib/clickerMath.js';

const LINE_GAP = 4;
const FONT_SIZE = '15px';
const LINE_HEIGHT = 19;

function emph(text) {
  return { text: String(text), emph: true };
}

function plain(text) {
  return { text: String(text), emph: false };
}

export function buildStoreItemTooltipLines(state, upgrade, { cost } = {}) {
  const lines = [];
  lines.push([plain(upgrade.label)]);
  lines.push([plain(UI_TEXT.tooltipOwnedLabel), emph(upgrade.level)]);
  if (cost != null) {
    lines.push([plain(UI_TEXT.tooltipCostLabel), emph(formatCoins(cost))]);
  }
  lines.push([]);

  if (upgrade.type === 'auto') {
    const { productionMultiplier } = calculateStats(state);
    const each = getGeneratorAutoRate(state, { ...upgrade, level: 1 }).times(productionMultiplier);
    const eachLabel = formatCoins(each);
    lines.push([plain(UI_TEXT.tooltipProducesPrefix), emph(eachLabel), plain(UI_TEXT.tooltipProducesSuffix)]);
    lines.push([]);
    lines.push([plain(UI_TEXT.tooltipEachPrefix), emph(eachLabel), plain(UI_TEXT.tooltipEachSuffix)]);
    if (upgrade.level > 0) {
      const total = getGeneratorAutoRate(state, upgrade).times(productionMultiplier);
      const share = formatIdleSharePercent(getGeneratorIdleShare(state, upgrade.id));
      const row = [
        emph(upgrade.level),
        plain(UI_TEXT.tooltipTotalMid),
        emph(formatCoins(total)),
        plain(UI_TEXT.tooltipTotalSuffix),
      ];
      if (share) {
        row.push(plain(' '), emph(`(${share})`));
      }
      lines.push(row);
    }
  } else if (upgrade.type === 'click') {
    lines.push([plain(UI_TEXT.tooltipTapPrefix), emph(upgrade.baseValue), plain(UI_TEXT.tooltipTapSuffix)]);
  } else if (upgrade.type === 'auto_tap') {
    lines.push([
      plain(UI_TEXT.tooltipAutoTapBefore),
      emph(AUTO_TAP_INTERVAL_SECONDS),
      plain(UI_TEXT.tooltipAutoTapMid),
      emph(upgrade.baseValue),
      plain(UI_TEXT.tooltipAutoTapAfter),
    ]);
  }

  return lines;
}

export function buildStoreItemTooltipBody(state, upgrade, options) {
  return buildStoreItemTooltipLines(state, upgrade, options)
    .map((line) => line.map((part) => part.text).join(''))
    .join('\n');
}

export function createStoreItemTooltip(scene) {
  const pad = 14;
  const maxWidth = 340;
  const bg = scene.add
    .rectangle(0, 0, 200, 100, COLORS.overlayPanel, 0.96)
    .setStrokeStyle(2, COLORS.accent)
    .setOrigin(1, 0.5)
    .setDepth(2500)
    .setVisible(false);
  const content = scene.add.container(0, 0).setDepth(2501).setVisible(false);
  const owned = new Set([bg, content]);

  let currentId = null;
  let wiredCameras = false;

  function wireCameras() {
    if (wiredCameras) {
      return;
    }
    wiredCameras = true;

    scene.cameras.main.ignore([bg, content]);
    scene.upgradeCamera?.ignore([bg, content]);
    scene.metaCamera?.ignore([bg, content]);
    scene.statusCamera?.ignore([bg, content]);

    const camera = scene.cameras.add(0, 0, scene.scale.width, scene.scale.height);
    camera.setBackgroundColor('rgba(0,0,0,0)');
    camera.ignore(scene.children.list.filter((obj) => !owned.has(obj)));
    scene.tooltipCamera = camera;

    scene.events.on('addedtoscene', (gameObject) => {
      if (owned.has(gameObject) || gameObject.parentContainer === content) {
        return;
      }
      camera.ignore(gameObject);
    });
  }

  function renderLines(lines) {
    content.iterate((child) => owned.delete(child));
    content.removeAll(true);
    let y = 0;
    let maxW = 0;

    lines.forEach((line) => {
      if (!line.length) {
        y += LINE_HEIGHT / 2;
        return;
      }
      let x = 0;
      line.forEach((part) => {
        const node = scene.make.text({
          x,
          y,
          text: part.text,
          add: false,
          style: {
            fontFamily: FONT_FAMILIES.body,
            fontSize: FONT_SIZE,
            color: part.emph ? COLORS.whiteText : COLORS.overlayText,
            fontStyle: part.emph ? '800' : 'normal',
          },
        });
        owned.add(node);
        content.add(node);
        x += node.width;
      });
      maxW = Math.max(maxW, x);
      y += LINE_HEIGHT + LINE_GAP;
    });

    return { width: maxW, height: Math.max(LINE_HEIGHT, y - LINE_GAP) };
  }

  function hide() {
    currentId = null;
    bg.setVisible(false);
    content.setVisible(false);
  }

  function show(upgrade, anchorY) {
    if (IS_MOBILE_UI || !upgrade) {
      hide();
      return;
    }
    wireCameras();
    const live = scene.state.upgrades.find((entry) => entry.id === upgrade.id) ?? upgrade;
    const preview = scene.engine.getUpgradeBuyPreview(live.id, scene.settings?.buyAmount ?? 1);
    const { width: contentW, height: contentH } = renderLines(
      buildStoreItemTooltipLines(scene.state, live, { cost: preview?.cost }),
    );
    const width = Math.min(maxWidth, Math.max(180, contentW + pad * 2));
    const height = contentH + pad * 2;
    bg.setSize(width, height);
    const x = scene.uiColumns.rightLeft - 10;
    const y = Math.min(Math.max(anchorY, height / 2 + 8), scene.scale.height - height / 2 - 8);
    bg.setPosition(x, y);
    content.setPosition(x - width + pad, y - height / 2 + pad);
    bg.setVisible(true);
    content.setVisible(true);
    currentId = live.id;
  }

  function refresh() {
    if (!currentId) {
      return;
    }
    const upgrade = scene.state.upgrades.find((entry) => entry.id === currentId);
    if (!upgrade) {
      hide();
      return;
    }
    show(upgrade, bg.y);
  }

  return { show, hide, refresh };
}

export function bindStoreItemTooltips(scene) {
  if (IS_MOBILE_UI || !scene.storeTooltip) {
    return;
  }

  scene.upgradeItems.forEach((item) => {
    item.rowBg.on('pointerover', () => {
      if (item.isLockedPreview) {
        scene.storeTooltip.hide();
        return;
      }
      scene.storeTooltip.show({ id: item.id }, item.rowBg.y);
    });
    item.rowBg.on('pointerout', () => {
      scene.storeTooltip.hide();
    });
  });
}
