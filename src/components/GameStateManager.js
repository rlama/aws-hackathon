import { EXTRA_TYPES } from "../config/gameConfig";


export default class GameStateManager {
    constructor(scene) {
        this.scene = scene;
        this.isPaused = false;
        this.gameTime = 0;
        this.scores = {
            chad: 0,
            barry: 0
        };
        this.scoreText = {};

        // Velocity-related properties
        this.baseVelocity = 100;
        this.extraVelocity = this.baseVelocity;
        this.maxVelocity = 500;
        this.velocityIncrement = 20;

        this.setupInitialState();
    }

    // Add this method to get the current game time
    getGameTime() {
        return this.gameTime;
    }

    // Update method to track game time
    update(time, delta) {
        if (!this.isPaused) {
            this.gameTime += delta; // Increment game time by delta
        }
    }

    setupInitialState() {
        // Initial spawn settings
        this.spawnDelay = 2000;      // Start with 2000ms (2 seconds)
        this.minDelay = 500;         // Minimum delay (half second)
        this.delayDecrement = 100;   // Decrease by 100ms each time
        this.spawnTimer = null;      // Store timer reference
    }

    startGame() {
        this.startSpawning();
        this.setupVelocityIncrement();
    }

    setupVelocityIncrement() {
        // Create a timer to increase velocity
        this.scene.time.addEvent({
            delay: 10000,  // Increase velocity every 10 seconds
            callback: this.increaseVelocity,
            callbackScope: this,
            loop: true
        });
    }

    increaseVelocity() {
        if (this.extraVelocity < this.maxVelocity) {
            this.extraVelocity += this.velocityIncrement;
            // console.log('New velocity:', this.extraVelocity);
        }
    }

    applyVelocityToExtra(extra) {
        extra.body.setVelocityY(this.extraVelocity);
    }


    // Define handleResize method before using it
    handleResize = (gameSize) => {
        const { width, height } = gameSize;
        const bottomPadding = 20;
        
        if (this.scoreBackground && this.scoreText) {
            // Update backgrounds
            this.scoreBackground.barry.setPosition(width, height);

            // Update score texts
            this.scoreText.chad.setPosition(20, height - bottomPadding);
            this.scoreText.barry.setPosition(width - 20, height - bottomPadding);

            // Debug log
            console.log('Resize handled:', { width, height });
        }
    }


    pauseGame() {
        this.isPaused = true;
        // this.game.isPaused = true;
        this.scene.game.pause();
        this.scene.physics.pause();
        this.scene.anims.pauseAll();
        if (this.spawnTimer) {
            this.spawnTimer.paused = true;
        }
    }

    resumeGame() {
        this.isPaused = false;
        // this.game.isPaused = false;
        this.scene.game.resume();
        this.scene.physics.resume();
        this.scene.anims.resumeAll();
        if (this.spawnTimer) {
            this.spawnTimer.paused = false;
        }
    }

    decreaseDelay() {
        if (this.spawnDelay > this.minDelay) {
            this.spawnDelay = Math.max(this.spawnDelay - this.delayDecrement, this.minDelay);

            // Destroy existing timer
            if (this.spawnTimer) {
                this.spawnTimer.destroy();
            }

            // Create new timer with updated delay
            this.spawnTimer = this.scene.time.addEvent({
                delay: this.spawnDelay,
                callback: this.scene.spawnExtra,
                callbackScope: this.scene,
                loop: true
            });

            // console.log('New spawn delay:', this.spawnDelay);
        }
    }

    startSpawning() {
        // Initial spawn timer
        this.spawnTimer = this.scene.time.addEvent({
            delay: this.spawnDelay,
            callback: this.scene.spawnExtra,
            callbackScope: this.scene,
            loop: true
        });

        // Create a timer to decrease delay
        this.scene.time.addEvent({
            delay: 5000,           // Adjust delay every 5 seconds
            callback: this.decreaseDelay,
            callbackScope: this,
            loop: true
        });
    }


    resetGame() {
        // Reset velocity
        this.extraVelocity = this.baseVelocity;
        
        // Reset spawn delay
        this.spawnDelay = 2000;
    }


    getScores() {
        return this.scores;
    }

    isGamePaused() {
        return this.isPaused;
    }

    getCurrentVelocity() {
        return this.extraVelocity;
    }
}
