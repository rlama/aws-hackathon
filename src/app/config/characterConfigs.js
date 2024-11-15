// config/characterConfigs.js
import chadBarryAtlasData from '../gameAssets/chad_atlas.json';
import chadBarryImage from '../gameAssets/chad_atlas.png';
import extraAtlasData from '../gameAssets/extra_atlas.json';
import extraImage from '../gameAssets/extra_atlas.png';

export const CHAD_CONFIG = { 
  name: 'chad',
  animations: {
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
  },
  position: { x: 0.2, y: 0.65 },
  scale: 0.8,
  defaultAnimation: 'idle',
  atlasData: chadBarryAtlasData,
  image: chadBarryImage
};

export const BARRY_CONFIG = {
    name: 'barry',
    animations: {
      idle: {
        frames: Array.from({ length: 12 }, (_, i) => i + 75),
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
    },
    position: { x: 0.6, y: 0.65 },
    scale: 0.8,
    defaultAnimation: 'idle',
    atlasData: chadBarryAtlasData,
    image: chadBarryImage
  };

export const EXTRAS = {
  name: 'extras',
  animations: {
    dragon: {
      frames: Array.from({ length: 2 }, (_, i) => i + 4),
      speed: 0.5,
      next: "dragon"
    },
    bird: {
      frames: Array.from({ length: 2 }, (_, i) => i + 13),
      speed: 0.5,
      next: "bird"
    },
    onion: {
      frames: Array.from({ length: 1 }, (_, i) => i + 99),
      speed: 0.5,
      next: "onion"
    }
  },
  position: { x: 2/3, y: 1/2 },
  scale: 0.6,
  defaultAnimation: 'dragon',
  atlasData: extraAtlasData,
  image: extraImage
};

export const CHARACTERS = [CHAD_CONFIG, BARRY_CONFIG, EXTRAS];
