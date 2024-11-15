// utils/spriteInitializer.js
import { Sprite } from 'createjs-module';

export const initializeSprite = (spriteSheet, positionX, positionY, canvasWidth, canvasHeight, scale = 1) => {
  const sprite = new Sprite(spriteSheet);
  sprite.x = canvasWidth * positionX;
  sprite.y = canvasHeight * positionY;
  sprite.scaleX = sprite.scaleY = scale;
  return sprite;
};
