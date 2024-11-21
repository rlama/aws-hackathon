import { EXTRA_SCALE, EXTRA_TYPES, AVAILABLE_EXTRAS } from "../config/gameConfig";


export default class ExtraManager {
    constructor(scene, gameStateManager) {
        this.scene = scene;
        this.gameStateManager = gameStateManager;
        this.extras = this.scene.physics.add.group();
        this.createExtrasAnimations()
        this.setupSpawnTimer();
    }


    setupSpawnTimer() {
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                if (!this.gameStateManager.isGamePaused()) {
                    this.spawnExtra();
                }
            },
            callbackScope: this,
            loop: true
        });
    }


    createExtrasAnimations() {
        // Dragon animations

        this.scene.anims.create({
            key: 'dragon_fly',
            frames: this.scene.anims.generateFrameNames('extras', {
                prefix: 'frame_',
                start: 0,
                end: 4
            }),
            frameRate: 30,
            repeat: -1
        });


        this.scene.anims.create({
            key: 'bird_fly',
            frames: this.scene.anims.generateFrameNames('extras', {
                prefix: 'frame_',
                start: 7,
                end: 14
            }),
            frameRate: 30,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'gold_box',
            frames: [{ key: 'extras', frame: 'frame_6' }],
            frameRate: 1,
            repeat: 0
        });


        this.scene.anims.create({
            key: 'five_coin',
            frames: [{ key: 'extras', frame: 'frame_77' }],
            frameRate: 1,
            repeat: 0
        });


        this.scene.anims.create({
            key: 'onion',
            frames: [{ key: 'extras', frame: 'frame_80' }],
            frameRate: 1,
            repeat: 0
        });


        this.scene.anims.create({
            key: 'fruit',
            frames: [
                { key: 'extras', frame: 'frame_37' },
                { key: 'extras', frame: 'frame_71' },
                { key: 'extras', frame: 'frame_75' }
            ],
            frameRate: 15,
            repeat: -1
        });
        // Other animations...
    }



    spawnExtra() {
        const { chad, barry } = this.scene.characterManager.getCharacters();

        // Random position at top of screen
        const x = Phaser.Math.RND.pick([chad.x, barry.x]);
        const randomType = Phaser.Math.RND.pick(EXTRA_TYPES);

        // Create the extra
        const extra = this.scene.add.sprite(x, -50, 'extras', 'frame_0');
        extra.setData('type', randomType);
        extra.setScale(EXTRA_SCALE);

        
        // Add physics
        this.scene.physics.add.existing(extra);

        // console.log("extra: ", extra)

        extra.body.setSize(
            extra.width * EXTRA_SCALE,
            extra.height * EXTRA_SCALE
        );

        // Play animation and apply velocity
        extra.play(randomType);

        // Add animation switching capability
        extra.setData('animationTimer', 0);
        extra.setData('switchInterval', this.getSpawnInterval());

        this.gameStateManager.applyVelocityToExtra(extra);

        // Add to physics group
        this.extras.add(extra);

        // Setup collisions
        this.scene.collisionManager.setupCollisions(extra, this.scene.characterManager.getCharacters());

        return extra;
    }


    switchAnimation(extra) {
        const type = extra.getData('type');
        const currentAnim = extra.anims.currentAnim?.key;
        
        // Get possible animations based on type
        const baseAnimations = [
            type,
            `${type}_spin`,
            `${type}_zigzag`
        ];

        // Filter out current animation and verify animations exist
        const availableAnimations = baseAnimations.filter(animKey => 
            animKey !== currentAnim && this.scene.anims.exists(animKey)
        );

        if (availableAnimations.length > 0) {
            const newAnim = Phaser.Utils.Array.GetRandom(availableAnimations);
            this.applyMovementPattern(extra, newAnim);
            extra.play(newAnim);
        }
    }

    applyMovementPattern(extra, animKey) {
        // Clear any existing tweens
        this.scene.tweens.killTweensOf(extra);
        extra.setAngularVelocity(0);

        if (animKey.includes('spin')) {
            extra.setAngularVelocity(150);
        } else if (animKey.includes('zigzag')) {
            this.scene.tweens.add({
                targets: extra,
                x: extra.x + 100,
                yoyo: true,
                duration: 1000,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }


    getSpawnInterval() {
        const gameTime = this.gameStateManager.getGameTime();
            // console.log("gameTime: ",gameTime)
        if (gameTime > 5000) {
            return Phaser.Math.Between(100, 200);
        } else if (gameTime > 10000) {
            return Phaser.Math.Between(100, 200);
        }
        return Phaser.Math.Between(100, 200);
    }

    _getSpawnInterval() {
        const gameTime = this.gameStateManager.getGameTime();
            // console.log("gameTime: ",gameTime)
        if (gameTime > 60000) {
            return Phaser.Math.Between(500, 1500);
        } else if (gameTime > 30000) {
            return Phaser.Math.Between(800, 2000);
        }
        return Phaser.Math.Between(1000, 3000);
    }

    update(time, delta) {
        this.extras.getChildren().forEach(extra => {
            // Update animation timer
            extra.setData('animationTimer', extra.getData('animationTimer') + delta);

            // Check if it's time to switch animation
            if (extra.getData('animationTimer') >= extra.getData('switchInterval')) {
                this.switchAnimation(extra);
                extra.setData('animationTimer', 0);
                extra.setData('switchInterval', this.getSpawnInterval());
            }

            // Remove if off screen
            if (extra.y > this.scene.game.config.height + 50) {
                this.destroyExtra(extra);
            }
        });
    }

    // update(time, delta) {
    //     // Update and clean up extras that are off screen
    //     this.extras.getChildren().forEach(extra => {
    //         if (extra.y > this.scene.game.config.height + 50) {
    //             this.destroyExtra(extra);
    //         }
    //     });
    // }

    // _update(time, delta) {
    //     // Update existing extras
    //     this.extras.getChildren().forEach(extra => {
    //         if (extra.update) {
    //             extra.update(time, delta);
    //         }
    //     });
    // }

    getExtrasGroup() {
        return this.extras;
    }

    destroyExtra(extra) {
        if (extra) {
            this.scene.tweens.killTweensOf(extra);
            extra.destroy();
        }
    }
}
