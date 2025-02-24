import Phaser from 'phaser';
import MainScene from './scenes/MainScene.js';
import { GAME_CONFIG } from './config.js';

// Phaser game configuration
const config = {
  type: Phaser.AUTO, // Use WebGL if available, otherwise Canvas
  width: GAME_CONFIG.CANVAS_WIDTH,       // Game width
  height: GAME_CONFIG.CANVAS_HEIGHT,      // Game height
  scene: [MainScene], // Add your scenes here
  physics: {
    default: 'arcade', // Use the Arcade Physics engine
    arcade: {
      gravity: { y: 0 }, // No gravity for a card game
      debug: false,      // Set to true to see physics debug overlay
    },
  },
};

// Create the Phaser game instance
const game = new Phaser.Game(config);
