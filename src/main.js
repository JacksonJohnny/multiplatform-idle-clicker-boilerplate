import Phaser from 'phaser';
import { ClickerScene } from './scenes/ClickerScene.js';
import { GAME_CONFIG, IS_MOBILE_UI } from './config/gameConfig.js';
import './style.css';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: GAME_CONFIG.width,
  height: GAME_CONFIG.height,
  backgroundColor: GAME_CONFIG.backgroundColor,
  antialias: true,
  roundPixels: false,
  scale: IS_MOBILE_UI
    ? {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        autoRound: false,
      }
    : {
        mode: Phaser.Scale.RESIZE,
        parent: 'game-container',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        autoRound: false,
        min: {
          width: GAME_CONFIG.minWidth,
          height: GAME_CONFIG.minHeight,
        },
      },
  input: {
    keyboard: true,
  },
  scene: [ClickerScene],
};

new Phaser.Game(config);
