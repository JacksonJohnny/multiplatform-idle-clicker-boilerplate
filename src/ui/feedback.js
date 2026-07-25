import { FONT_FAMILIES } from '../config/theme.js';

const MAX_FLOATS = 2;
const FLOAT_DURATION_MS = 420;
const FLOAT_RISE = 56;

export function createFeedbackService(scene, settings) {
  let audioContext = null;
  const activeFloats = [];

  function playPurchase() {
    if (settings.soundEnabled) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioContext ??= new AudioContextClass();
        if (audioContext.state === 'suspended') {
          audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const now = audioContext.currentTime;

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(480, now);
        oscillator.frequency.exponentialRampToValueAtTime(720, now + 0.09);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.11, now + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start(now);
        oscillator.stop(now + 0.12);
      }
    }
  }

  function spawnFloatingText(text, color = '#ffffff', y = 355, xOffset = 0) {
    while (activeFloats.length >= MAX_FLOATS) {
      const oldest = activeFloats.shift();
      oldest?.tween?.stop();
      oldest?.node?.destroy();
    }

    const jitterX = (Math.random() - 0.5) * 48;
    const jitterY = (Math.random() - 0.5) * 18;
    const startY = y + jitterY;
    const floatText = scene.add
      .text((scene.tapCenterX ?? scene.scale.width / 2) + xOffset + jitterX, startY, text, {
        fontFamily: FONT_FAMILIES.body,
        fontSize: '28px',
        color,
        fontStyle: '800',
      })
      .setOrigin(0.5);

    scene.upgradeCamera?.ignore(floatText);
    scene.metaCamera?.ignore(floatText);

    const entry = { node: floatText, tween: null };
    activeFloats.push(entry);
    entry.tween = scene.tweens.add({
      targets: floatText,
      y: startY - FLOAT_RISE,
      alpha: 0,
      duration: FLOAT_DURATION_MS,
      ease: 'Cubic.Out',
      onComplete: () => {
        const index = activeFloats.indexOf(entry);
        if (index >= 0) {
          activeFloats.splice(index, 1);
        }
        floatText.destroy();
      },
    });
  }

  return { playPurchase, spawnFloatingText };
}
