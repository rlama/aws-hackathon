// hooks/useSpriteSheet.js
import { SpriteSheet } from 'createjs-module';

export const useSpriteSheet = () => {
  const createSpriteSheet = (image, atlasData, animations) => {
    return new SpriteSheet({
      images: [image],
      frames: atlasData.frames,
      animations: animations
    });
  };

  return { createSpriteSheet };
};
