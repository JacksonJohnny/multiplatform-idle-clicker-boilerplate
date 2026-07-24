import Phaser from 'phaser';
import { COLORS, FONT_FAMILIES, UI_LAYOUT } from '../config/theme.js';
import { UI_TEXT } from '../config/uiText.js';

function createToggle(scene, { centerX, rowWidth, textX, toggleX, y }, label, description, settingKey, onToggle) {
  const background = scene.add
    .rectangle(centerX, y, rowWidth, 78, COLORS.panel, 0.96)
    .setStrokeStyle(2, COLORS.panelBorder);
  const labelText = scene.add
    .text(textX, y - 14, label, { fontFamily: FONT_FAMILIES.display, fontSize: '19px', color: COLORS.text })
    .setOrigin(0, 0.5);
  const descriptionText = scene.add
    .text(textX, y + 18, description, { fontFamily: FONT_FAMILIES.body, fontSize: '16px', color: COLORS.mutedText })
    .setOrigin(0, 0.5);
  const toggle = scene.add.rectangle(toggleX, y, 92, 46, COLORS.success).setStrokeStyle(2, COLORS.successBorder);
  const valueText = scene.add
    .text(toggleX, y, '', { fontFamily: FONT_FAMILIES.display, fontSize: '16px', color: COLORS.successText })
    .setOrigin(0.5);
  const hitArea = scene.add.zone(toggleX, y, 112, 66).setInteractive({ useHandCursor: true });
  hitArea.on('pointerup', () => onToggle(settingKey));
  return { settingKey, background, label: labelText, description: descriptionText, toggle, valueText, hitArea };
}

function toggleBox(layout) {
  const toggleWidth = 92;
  return {
    centerX: layout.listLeft + layout.listWidth / 2,
    rowWidth: layout.listWidth - 2,
    textX: layout.listLeft + 14,
    toggleX: layout.listLeft + layout.listWidth - toggleWidth / 2 - 10,
    y: layout.listTop + layout.rowHeight / 2,
  };
}

export function buildSettingsView({ scene, container, layout, onToggle }) {
  const title = scene.add
    .text(layout.titleX, UI_LAYOUT.sectionTitleY, UI_TEXT.settingsTitle, {
      fontFamily: FONT_FAMILIES.display,
      fontSize: '24px',
      color: COLORS.accentText,
    })
    .setOrigin(0, 0.5)
    .setVisible(false);
  const items = [
    createToggle(scene, toggleBox(layout), UI_TEXT.sound, UI_TEXT.soundDescription, 'soundEnabled', onToggle),
  ];
  container.add(
    items.flatMap((item) => [item.background, item.label, item.description, item.toggle, item.valueText, item.hitArea]),
  );
  return { title, items };
}

function parseColor(color) {
  if (typeof color === 'number') {
    return color;
  }
  if (typeof color === 'string' && color.startsWith('#')) {
    return Number.parseInt(color.slice(1), 16);
  }
  return COLORS.navIndicator;
}

const SETTINGS_ICON_KEY = 'ui-settings-gear';
const SETTINGS_ICON_TEX = 256;
const SETTINGS_ICON_DISPLAY = 52;

function ensureSettingsIconTexture(scene) {
  if (scene.textures.exists(SETTINGS_ICON_KEY)) {
    scene.textures.remove(SETTINGS_ICON_KEY);
  }

  const size = SETTINGS_ICON_TEX;
  const tex = scene.textures.createCanvas(SETTINGS_ICON_KEY, size, size);
  const ctx = tex.getContext();
  const cx = size / 2;
  const cy = size / 2;
  const s = size / 52;
  const teeth = 8;

  const tipR = 12.5 * s;
  const rootR = 8.2 * s;
  const hubR = 5.2 * s;
  const holeR = 3.2 * s;
  const ringR = 24 * s;
  const toothHalf = Math.PI / teeth / 2.6;

  ctx.imageSmoothingEnabled = true;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = Math.max(3, 2.2 * s);
  ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
  ctx.shadowBlur = 2.2 * s;

  ctx.beginPath();
  ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  for (let i = 0; i < teeth; i += 1) {
    const a = (i / teeth) * Math.PI * 2;
    const a0 = a - toothHalf;
    const a1 = a + toothHalf;
    const aRoot0 = a - Math.PI / teeth;
    const aRoot1 = a + Math.PI / teeth;
    if (i === 0) {
      ctx.moveTo(cx + Math.cos(aRoot0) * rootR, cy + Math.sin(aRoot0) * rootR);
    } else {
      ctx.lineTo(cx + Math.cos(aRoot0) * rootR, cy + Math.sin(aRoot0) * rootR);
    }
    ctx.lineTo(cx + Math.cos(a0) * tipR, cy + Math.sin(a0) * tipR);
    ctx.lineTo(cx + Math.cos(a1) * tipR, cy + Math.sin(a1) * tipR);
    ctx.lineTo(cx + Math.cos(aRoot1) * rootR, cy + Math.sin(aRoot1) * rootR);
  }
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, hubR, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(cx, cy, holeR, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';

  tex.refresh();
  tex.setFilter(Phaser.Textures.FilterMode.LINEAR);
}

export function buildSettingsButton(scene, onToggle) {
  const x = scene.scale.width - UI_LAYOUT.settingsInsetX;
  const y = UI_LAYOUT.settingsY;
  ensureSettingsIconTexture(scene);

  const background = scene.add
    .circle(x, y, SETTINGS_ICON_DISPLAY / 2 + 4, 0x000000, 0)
    .setInteractive({ useHandCursor: true })
    .setDepth(1100);

  const icon = scene.add
    .image(x, y, SETTINGS_ICON_KEY)
    .setOrigin(0.5)
    .setDisplaySize(SETTINGS_ICON_DISPLAY, SETTINGS_ICON_DISPLAY)
    .setDepth(1101)
    .setTint(COLORS.navIndicator);
  icon.setColor = (color) => {
    icon.setTint(parseColor(color));
  };

  background.on('pointerup', onToggle);
  icon.setInteractive({ useHandCursor: true }).on('pointerup', onToggle);
  return { background, icon };
}
