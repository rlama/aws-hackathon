// config/animationConfigs.js
export const CHAD_ANIMATIONS = {
    idle: {
      frames: Array.from({ length: 16 }, (_, i) => i),
      speed: 0.5,
      next: "idle"
    },
    run: {
      frames: Array.from({ length: 10 }, (_, i) => i + 12),
      speed: 0.5,
      next: "run"
    },
    openMouth: {
      frames: Array.from({ length: 17 }, (_, i) => i + 35),
      speed: 0.5,
      next: "openMouth"
    }
  };
  
  export const BARRY_ANIMATIONS = {
    idle: {
      frames: Array.from({ length: 8 }, (_, i) => i),  // Adjust these numbers
      speed: 0.5,
      next: "idle"
    },
    attack: {
      frames: Array.from({ length: 12 }, (_, i) => i + 8),  // Adjust these numbers
      speed: 0.5,
      next: "attack"
    },
    jump: {
      frames: Array.from({ length: 10 }, (_, i) => i + 20),  // Adjust these numbers
      speed: 0.5,
      next: "jump"
    }
  };
  
  export const CHAD_CONFIG = {
    animations: CHAD_ANIMATIONS,
    position: { x: 1/3, y: 1/2 },
    scale: 1,
    defaultAnimation: 'idle'
  };
  
  export const BARRY_CONFIG = {
    animations: BARRY_ANIMATIONS,
    position: { x: 2/3, y: 1/2 },
    scale: 1,
    defaultAnimation: 'idle'
  };