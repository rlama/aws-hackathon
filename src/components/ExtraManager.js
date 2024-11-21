import { EXTRA_SCALE, EXTRA_TYPES, AVAILABLE_EXTRAS, EXTRA_SPAWN_TIME, EXTRA_TYPE_CHANGE_INTERVAL_TIME } from "../config/gameConfig";

export default class ExtraManager {
    constructor(scene, gameStateManager) {
        this.scene = scene;
        // Set a consistent physics time step
        this.scene.physics.world.setFPS(60);

        this.gameStateManager = gameStateManager;
        this.extras = this.scene.physics.add.group();
        this.createExtrasAnimations();

        // Initial fall speed and speed increase settings
        this.FALL_SPEED = 200;
        this.SPEED_INCREMENT = 50;
        this.SPEED_INTERVAL = 5000;

        // Spawn delay settings
        this.SPAWN_DELAY = 1000;
        this.MIN_SPAWN_DELAY = 300;
        this.SPAWN_DELAY_DECREASE = 100;

        // Game time tracking
        this.gameStartTime = Date.now();
        this.TYPE_CHANGE_START_DELAY = 10000; // 10 seconds initial delay
        this.TYPE_CHANGE_DURATION = 10000;    // 10 seconds of changing
        this.TYPE_CHANGE_PAUSE = 5000;        // 5 seconds pause
        this.isChangingTypes = false;         // Track if we're in changing phase
        this.lastPhaseChange = 0;            // Track when we last changed phases

        // Setup timers
        this.setupSpeedIncreaseTimer();
        this.setupSpawnTimer();

    }

    setupSpeedIncreaseTimer() {
        this.scene.time.addEvent({
            delay: this.SPEED_INTERVAL,
            callback: () => {
                if (!this.gameStateManager.isGamePaused()) {
                    // Increase fall speed

                    if (this.FALL_SPEED >= 420) {
                        this.FALL_SPEED -= 200;
                        this.SPAWN_DELAY = 1000;
                    } else {
                        this.FALL_SPEED += this.SPEED_INCREMENT;
                    }

                    // Decrease spawn delay
                    this.SPAWN_DELAY = Math.max(
                        this.MIN_SPAWN_DELAY,
                        this.SPAWN_DELAY - this.SPAWN_DELAY_DECREASE
                    );
                    // Update spawn timer with new delay
                    this.updateSpawnTimer();
                }
            },
            callbackScope: this,
            loop: true
        });
    }


    updateSpawnTimer() {
        // Destroy existing timer and create new one with updated delay
        if (this.spawnTimer) {
            this.spawnTimer.destroy();
        }
        this.setupSpawnTimer();
    }

    setupSpawnTimer() {
        this.spawnTimer = this.scene.time.addEvent({
            delay: this.SPAWN_DELAY,
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

        // Bird animations
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

        // Gold box animation
        this.scene.anims.create({
            key: 'gold_box',
            frames: [{ key: 'extras', frame: 'frame_6' }],
            frameRate: 1,
            repeat: 0
        });

        // Five coin animation
        this.scene.anims.create({
            key: 'five_coin',
            frames: [{ key: 'extras', frame: 'frame_77' }],
            frameRate: 1,
            repeat: 0
        });

        // Onion animation
        this.scene.anims.create({
            key: 'onion',
            frames: [{ key: 'extras', frame: 'frame_80' }],
            frameRate: 1,
            repeat: 0
        });

        // Fruit animation
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
    }

    spawnExtra() {
        const { chad, barry } = this.scene.characterManager.getCharacters();
        const x = Phaser.Math.RND.pick([chad.x, barry.x]);
        const randomType = Phaser.Math.RND.pick(EXTRA_TYPES);

        // Create the extra sprite
        const extra = this.scene.physics.add.sprite(x, -50, 'extras', 'frame_0');

        extra.setData('type', randomType);
        extra.setData('originalType', randomType);
        extra.setData('typeChangeTimer', 0);
        extra.setData('typeChangeInterval', Phaser.Math.Between(EXTRA_TYPE_CHANGE_INTERVAL_TIME[0], EXTRA_TYPE_CHANGE_INTERVAL_TIME[1]));
        extra.setData('spawnTime', Date.now()); // Store spawn time
        extra.setScale(EXTRA_SCALE);

        // Physics settings for smooth movement
        extra.body.setSize(extra.width * EXTRA_SCALE, extra.height * EXTRA_SCALE);
        extra.body.setAllowGravity(false);
        extra.body.setVelocityY(this.FALL_SPEED);
        extra.body.setDragY(0); // No drag
        extra.body.setBounce(0); // No bounce
        extra.body.setAngularVelocity(0); // No rotation

        // Play the appropriate animation based on type
        extra.play(randomType);

        // Add to group and setup collisions
        this.extras.add(extra);
        this.scene.collisionManager.setupCollisions(extra, this.scene.characterManager.getCharacters());

        return extra;
    }

    switchExtraType(extra) {
        const currentType = extra.getData('type');
        const originalType = extra.getData('originalType');

        const randomType = Phaser.Math.RND.pick(EXTRA_TYPES);

        const nextType = currentType === 'onion' && originalType === 'onion' ? randomType : 'onion';
        // Switch between original type and onion
        const newType = currentType === 'onion' ? originalType : nextType;

        // console.log("Switching extra type from", currentType, "to", newType);

        extra.setData('type', newType);
        extra.play(newType);
    }

    update(time, delta) {
        const currentTime = Date.now();
        const gameElapsedTime = currentTime - this.gameStartTime;

        // Only start type changing mechanics after initial delay
        if (gameElapsedTime >= this.TYPE_CHANGE_START_DELAY) {
            const timeSinceLastPhase = currentTime - this.lastPhaseChange;

            // Check if we need to switch phases
            if (this.isChangingTypes && timeSinceLastPhase >= this.TYPE_CHANGE_DURATION) {
                // Switch to pause phase
                this.isChangingTypes = false;
                this.lastPhaseChange = currentTime;
                // console.log('Switching to pause phase');
            } else if (!this.isChangingTypes && timeSinceLastPhase >= this.TYPE_CHANGE_PAUSE) {
                // Switch to changing phase
                this.isChangingTypes = true;
                this.lastPhaseChange = currentTime;
                // console.log('Switching to changing phase');
            }

            // If this is our first time past the initial delay, start in changing phase
            if (this.lastPhaseChange === 0) {
                this.isChangingTypes = true;
                this.lastPhaseChange = currentTime;
                // console.log('Starting first changing phase');
            }
        }


        this.extras.getChildren().forEach(extra => {
            // Update velocity to current FALL_SPEED
            extra.body.setVelocityY(this.FALL_SPEED);

            // Only process type changes if we're past initial delay and in changing phase
            if (gameElapsedTime >= this.TYPE_CHANGE_START_DELAY && this.isChangingTypes) {
                const typeTimer = extra.getData('typeChangeTimer');
                const typeInterval = extra.getData('typeChangeInterval');

                extra.setData('typeChangeTimer', typeTimer + delta);

                if (typeTimer + delta >= typeInterval) {
                    this.switchExtraType(extra);
                    extra.setData('typeChangeTimer', 0);
                }
            }

            // Remove if off screen
            if (extra.y > this.scene.game.config.height + 50) {
                this.destroyExtra(extra);
            }
        });
    }

    resetGame() {
        // Reset all game parameters
        this.FALL_SPEED = 200;
        this.SPAWN_DELAY = 1000;
        this.gameStartTime = Date.now();
        this.lastPhaseChange = 0;
        this.isChangingTypes = false;

        // Update spawn timer with reset delay
        this.updateSpawnTimer();

        // Destroy all existing extras
        this.extras.clear(true, true);
    }


    destroyExtra(extra) {
        if (extra) {
            this.scene.tweens.killTweensOf(extra);
            extra.destroy();
        }
    }

    getExtrasGroup() {
        return this.extras;
    }
}
