import Phaser from 'phaser';

export default class Character extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
    this.scene = scene;
    this.scene.add.existing(this);
    
    this.createAnimations();
  }

  createAnimations() {
    this.scene.anims.create({
      key: 'mouth_open',
      frames: this.scene.anims.generateFrameNames('characters', {
        prefix: 'mouth_',
        start: 1,
        end: 4
      }),
      frameRate: 10
    });
  }

  openMouth() {
    this.play('mouth_open');
    this.scene.time.delayedCall(2000, () => {
      this.setFrame('idle');
    });
  }
}
