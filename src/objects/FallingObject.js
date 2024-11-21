import Phaser from 'phaser';

export default class FallingObject extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.scene = scene;
    this.scene.add.existing(this);
    
    this.speed = scene.gameSpeed;
    this.scene.physics.world.enable(this);
  }

  update() {
    this.y += this.speed;
    
    if (this.y > this.scene.game.config.height) {
      this.destroy();
    }
  }
}
