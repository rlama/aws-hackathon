/*
 * Purpose:         Manages all the states and and its values
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */
import { EXTRA_TYPES, DEFAULT_INITIAL_SCORE } from "../config/gameConfig";
import AudioManager from "./AudioManager";

export default class GameStateManager {
    constructor() {

        if (GameStateManager.instance) {
            return GameStateManager.instance;
        }
        GameStateManager.instance = this;

        this._scene = undefined;
        this._isGamePaused = false;
        this._gameTime = 0;

        // Velocity-related properties
        this._baseVelocity = 100;
        this._extraVelocity = this._baseVelocity;
        this._maxVelocity = 500;
        this._velocityIncrement = 20;
        this._selectedCharacter = '';
        this._playerName = '';
        this._difficultyLevel = 'beginner'
        this._scores = DEFAULT_INITIAL_SCORE
        this._winner = "";
        this._wonStates = [];
        this.setupInitialState();
        this._audioManager = null;
        this._mute = true;

    }

    // Static method to get instance
    static getInstance() {
        if (!GameStateManager.instance) {
            GameStateManager.instance = new GameStateManager();
        }
        return GameStateManager.instance;
    }


    initializeAudio(scene) {
        // Initialize AudioManager if not already initialized
        if (!this.audioManager) {
            this.audioManager = new AudioManager(scene);
            // Preload and create sounds
            this.audioManager.create();
        }
        return this.audioManager;
    }

    getFinalScore() {

        const chadSc = this.getScore('chad');
        const selectedCharacter = this._selectedCharacter;

        const opponent = this.getScore([selectedCharacter]) === "chad" ? "barry" : "chad";

        const wonStates = this._wonStates.filter(item => item.character === selectedCharacter).length;

        const finalScores = {
            score: {
                chad: this._scores.chad,
                barry: this._scores.barry,
            },
            opponent: this._scores[opponent],
            statesWon: this._wonStates.length,
            playerName: this._playerName,
            selectedCharacter: selectedCharacter,
            level: this._difficultyLevel
        };
        return finalScores;
    }


    // Getters and setters
    get scores() { return this._scores; }
    // Increment score
    incrementScore(character, amount = 1) {
        if (character in this._scores) {
            this._scores[character] += amount;
            if (this._scores[character] > 270) this._scores[character] = 270;
            // console.log(`Score incremented for ${character}: ${this._scores[character]}`);
            return this._scores[character];
        }
        // console.warn(`Cannot increment score: Player ${character} not found`);
        return false;
    }
    // Get individual score
    getScore(character) {
        if (character in this._scores) {
            return this._scores[character];
        }
        // console.warn(`Player ${character} not found in scores`);
        return 0;
    }


    get wonStates() { return this._wonStates; }
    // Set individual score
    setWonStates(value) {
        this._wonStates.push(value);
    }

    set audioManager(value) { this._audioManager = value; }
    get audioManager() { return this._audioManager; }

    set isGamePaused(value) { this._isGamePaused = value; }
    get isGamePaused() { return this._isGamePaused; }


    set winner(value) { this._winner = value; }
    get winner() { return this._winner; }

    set mute(value) { this._mute = value; }
    get mute() { return this._mute; }


    set playerName(value) { this._playerName = value; }
    get playerName() { return this._playerName; }

    set selectedCharacter(value) { this._selectedCharacter = value; }
    get selectedCharacter() { return this._selectedCharacter; }

    set difficultyLevel(value) { this._difficultyLevel = value; }
    get difficultyLevel() { return this._difficultyLevel; }

    set scene(value) {
        this._scene = value;
    }

    // Add this method to get the current game time
    get gameTime() { return this._gameTime; }

    // Update method to track game time
    update(time, delta) {
        if (!this._isGamePaused) {
            this._gameTime += delta; // Increment game time by delta
        }
    }

    setupInitialState() {
        // Initial spawn settings
        this._spawnDelay = 2000;      // Start with 2000ms (2 seconds)
        this._minDelay = 500;         // Minimum delay (half second)
        this._delayDecrement = 100;   // Decrease by 100ms each time
        this._spawnTimer = null;      // Store timer reference
    }

    startGame() {
        this.startSpawning();
        this.setupVelocityIncrement();
    }

    setupVelocityIncrement() {
        // Create a timer to increase velocity
        this._scene.time.addEvent({
            delay: 10000,  // Increase velocity every 10 seconds
            callback: this._increaseVelocity,
            callbackScope: this,
            loop: true
        });
    }

    increaseVelocity() {
        if (this._extraVelocity < this._maxVelocity) {
            this._extraVelocity += this._velocityIncrement;
            // console.log('New velocity:', this._extraVelocity);
        }
    }

    applyVelocityToExtra(extra) {
        extra.body.setVelocityY(this._extraVelocity);
    }


    pauseGame() {
        this._isGamePaused = true;
        // this._game.isGamePaused = true;
        this._scene.game.pause();
        this._scene.physics.pause();
        this._scene.anims.pauseAll();
        if (this._spawnTimer) {
            this._spawnTimer.paused = true;
        }
    }

    resumeGame() {
        this._isGamePaused = false;
        // this._game.isGamePaused = false;
        this._scene.game.resume();
        this._scene.physics.resume();
        this._scene.anims.resumeAll();
        if (this._spawnTimer) {
            this._spawnTimer.paused = false;
        }
    }

    decreaseDelay() {
        if (this._spawnDelay > this._minDelay) {
            this._spawnDelay = Math.max(this._spawnDelay - this._delayDecrement, this._minDelay);

            // Destroy existing timer
            if (this._spawnTimer) {
                this._spawnTimer.destroy();
            }

            // Create new timer with updated delay
            this._spawnTimer = this._scene.time.addEvent({
                delay: this._spawnDelay,
                callback: this._scene.spawnExtra,
                callbackScope: this._scene,
                loop: true
            });

            // console.log('New spawn delay:', this._spawnDelay);
        }
    }

    startSpawning() {
        // Initial spawn timer
        this._spawnTimer = this._scene.time.addEvent({
            delay: this._spawnDelay,
            callback: this._scene.spawnExtra,
            callbackScope: this._scene,
            loop: true
        });

        // Create a timer to decrease delay
        this._scene.time.addEvent({
            delay: 5000,           // Adjust delay every 5 seconds
            callback: this._decreaseDelay,
            callbackScope: this,
            loop: true
        });
    }


    reset() {
        this._scores = {
            chad: 0,
            barry: 0
        };

        this._winner = "";
        this._wonStates = [];

        // Reset velocity
        this._extraVelocity = this._baseVelocity;

        // Reset spawn delay
        this._spawnDelay = 2000;
    }


    getCurrentVelocity() {
        return this._extraVelocity;
    }



    /// Sounds

    playSound(key, config = {}) {
        if (this.audioManager) {
            if (!this._isGamePaused) {
                this.audioManager.play(key, config);
            }
        } else {
            console.warn('AudioManager not initialized');
        }
    }

    pauseAllSounds() {
        if (this.audioManager) {
            console.log("---pauseAll---")
            this.audioManager.pauseAll();
        }
    }

    resumeAllSounds() {
        if (this.audioManager) {
            this.audioManager.resumeAll();
        }
    }

    pauseSound(key) {
        if (this.audioManager) {
            this.audioManager.pause(key);
        }
    }

    resumeSound(key) {
        if (this.audioManager) {
            this.audioManager.resume(key);
        }
    }

    pauseGameWithAudio() {
        this.isGamePaused = true;
        this.audioManager?.pauseWithFade();
    }

    resumeGameWithAudio() {
        this.isGamePaused = false;
        this.audioManager?.resumeWithFade();
    }
}
