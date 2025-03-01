import Phaser from 'phaser';
import MainScene from './scenes/MainScene.js';
import { GAME_CONFIG } from './config.js';

// Function to get the actual viewport dimensions
function getViewportDimensions() {
  return {
    width: window.visualViewport?.width || window.innerWidth * window.devicePixelRatio,
    height: window.visualViewport?.height || window.innerHeight * window.devicePixelRatio,
  };
}

// Phaser game configuration
const config = {
  type: Phaser.AUTO, // Use WebGL if available, otherwise Canvas
  scene: [MainScene], // Add your scenes here
  physics: {
    default: 'arcade', // Use the Arcade Physics engine
    arcade: {
      gravity: { y: 0 }, // No gravity for a card game
      debug: false,      // Set to true to see physics debug overlay
    },
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    ...getViewportDimensions(), // Use the actual viewport dimensions
    parent: 'game', // Ensure the canvas is a child of the #game div
  }
};

// Create the Phaser game instance
const game = new Phaser.Game(config);

// Function to resize the game canvas
function resizeGame() {
  const { width, height } = getViewportDimensions();
  game.scale.resize(width, height);
}

// Handle window resizing
window.addEventListener('resize', () => {
  resizeGame();
});

// Ensure the game resizes after the page has fully loaded
window.addEventListener('load', () => {
  // Add a small delay to allow the browser UI to settle
  setTimeout(resizeGame, 100);
});

// Handle visual viewport changes (e.g., when the mobile browser UI appears/disappears)
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', () => {
    resizeGame();
  });
}