import Phaser from 'phaser';
import MainScene from './scenes/MainScene.js';

// Phaser game configuration
const config = {
  type: Phaser.AUTO, // Use WebGL if available, otherwise Canvas
  width: 800,       // Game width
  height: 800,      // Game height
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
