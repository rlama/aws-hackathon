import PreloadScene from '../scenes/PreloadScene';
import GameScene from '../scenes/GameScene';
import CharacterSelectScene from '../scenes/CharacterSelectScene';

export const AVAILABLE_EXTRAS = ['dragon_fly', 'bird_fly', 'gold_box', 'five_coin','fruit', 'onion'];
export const EXTRA_TYPES = ['onion', 'dragon_fly', 'onion', 'bird_fly', 'onion', 'gold_box', 'five_coin', 'onion', 'fruit', 'onion'];

export const EXTRA_SCALE = 0.4;

export const RESET_TO_IDLE_TIME = 1000;

export const EXTRA_SPAWN_TIME = 1000;

export const EXTRA_TYPE_CHANGE_INTERVAL_TIME = [300, 800];

export const PRIMARY_TEXT_COLOR = "#74b40a";


export const gameConfig = {
  type: Phaser.AUTO,
  powerPreference: 'high-performance',
  scale: {
      mode: Phaser.Scale.RESIZE,
      parent: 'game',
      width: '100%',
      height: '100%',
      autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
      default: 'arcade',
      arcade: {
        fps: 60,           // Set consistent physics FPS
        timeScale: 1,      // Normal time scale
        gravity: { y: 0 }, // Disable gravity, we'll use velocity
        debug: false,
        fixedStep: true,   // Use fixed time step
        updateIterations: 2 // Increase physics iterations for smoothness
    }
  },
  backgroundColor: '#ffffff',
  scene: [PreloadScene, CharacterSelectScene, GameScene],
  render: {
    antialias: true,
    pixelArt: false,
    roundPixels: true,
    transparent: true,
    clearBeforeRender: true
}
};



export const frameConfig = {
  chad: {
      idle: { start: 0, end: 14 },
      dead: { start: 21, end: 28 },
      mouthOpen: { start: 35, end: 51 },
      eating: { start: 14, end: 19 },
      notHappy: { start: 26, end: 34 }
  },
  barry: {
      idle: { start: 75, end: 86 },
      dead: { start: 63, end: 69 },
      mouthOpen: { start: 87, end: 93 },
      eating: { start: 56, end: 62 },
      notHappy: { start: 68, end: 74 }
  }
};