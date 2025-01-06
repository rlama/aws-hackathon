/*
 * Purpose:         Manages all the states and and its values
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */
import { EXTRA_TYPES, DEFAULT_INITIAL_SCORE, MUSIC_ON, SOUND_ON, EMOJI_TYPES } from "../config/gameConfig";
import { capitalizeWords } from "../utils/helpers";
import StorageManager from "./StorageManager";
import AudioManager from "./AudioManager";
import FlyingText from "./FlyingText";

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
        this._difficultyLevel = StorageManager.getProperty('level') || "beginner";
        this._scores = DEFAULT_INITIAL_SCORE
        this._winner = "";
        this._wonStates = [];
        this.setupInitialState();
        this._audioManager = null;
        this._flyingText = null;
        this._uid = null;
        this._didWon = false;

        this._soundInitialized = false;

        this._musicOn = MUSIC_ON;
        this._soundOn = SOUND_ON;

        this._rankDataFetching = false;
        this._rankData = undefined;

        this.loadAudioLsSettings();

        this._analytics = {
            chad: {
                "Burger": 0,
                "Pizza": 0,
                "Hot Dog": 0,
                "Fries": 0,
                "Cookie": 0,
                "Onion": 0
            },
            barry: {
                "Burger": 0,
                "Pizza": 0,
                "Hot Dog": 0,
                "Fries": 0,
                "Cookie": 0,
                "Onion": 0
            }
        }

        // Store the instance
        GameStateManager.instance = this;

    }

    // Static method to get instance
    static getInstance() {
        if (!GameStateManager.instance) {
            GameStateManager.instance = new GameStateManager();
        }
        return GameStateManager.instance;
    }


    loadAudioLsSettings() {
        const musicOn = StorageManager.getProperty('musicon', true);
        const soundOn = StorageManager.getProperty('soundon', true);
        this._musicOn = musicOn;
        this._soundOn = soundOn;
    }


    initializeFlyingText(scene) {
        // Initialize AudioManager if not already initialized
        if (!this.flyingText) {
            this.flyingText = new FlyingText(scene);
        }
        return this.flyingText;
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
        const selectedCharacter = this._selectedCharacter;
        const opponent = selectedCharacter === "chad" ? "barry" : "chad";
        const wonStates = this._wonStates.filter(item => item.character === selectedCharacter).length;

        const finalScores = {
            score: this._scores[selectedCharacter],
            opponent: this._scores[opponent],
            statesWon: wonStates,
            playerName: capitalizeWords(this._playerName),
            selectedCharacter: selectedCharacter,
            level: this._difficultyLevel,
            uid: this._uid
        };
        return finalScores;
    }


    // Getters and setters
    get scores() { return this._scores; }
    // Increment score
    incrementScore(character, amount = 1) {
        if (character in this._scores) {
            this._scores[character] += amount;
            if (this._scores[character] > 270) this._scores[character] = 270; return this._scores[character];
        }
        return false;
    }
    // Get individual score
    getScore(character) {
        if (character in this._scores) {
            return this._scores[character];
        }
        return 0;
    }


    get wonStates() { return this._wonStates; }
    setWonStates(value) {
        this._wonStates.push(value);
    }

    // This is to reverse sound radio buttons on start 
    set soundInitialized(value) { this._soundInitialized = value; }
    get soundInitialized() { return this._soundInitialized; }

    set audioManager(value) { this._audioManager = value; }
    get audioManager() { return this._audioManager; }

    set isGamePaused(value) { this._isGamePaused = value; }
    get isGamePaused() { return this._isGamePaused; }

    set winner(value) { this._winner = value; }
    get winner() { return this._winner; }

    set didWon(value) { this._didWon = value; }
    get didWon() { return this._didWon; }

    set rankDataFetching(value) { this._rankDataFetching = value; }
    get rankDataFetching() { return this._rankDataFetching; }

    set rankData(value) { this._rankData = value; }
    get rankData() { return this._rankData; }

    set musicOn(value) { this._musicOn = value; }
    get musicOn() { return this._musicOn; }

    set soundOn(value) { this._soundOn = value; }
    get soundOn() { return this._soundOn; }

    set uid(value) { this._uid = value; }
    get uid() { return this._uid; }

    set playerName(value) { this._playerName = value; }
    get playerName() { return this._playerName; }

    set selectedCharacter(value) { this._selectedCharacter = value; }
    get selectedCharacter() { return this._selectedCharacter; }

    set difficultyLevel(value) { this._difficultyLevel = value; }
    get difficultyLevel() { return this._difficultyLevel; }

    get analytics() { return this._analytics; }

    set scene(value) {
        this._scene = value;
    }

    // Add this method to get the current game time
    get gameTime() { return this._gameTime; }


    setAnalytics(key, character) {
        // Valid keys for analytics
        const validKeys = EMOJI_TYPES.map(item => item.type);

        try {
            // Check if key is valid
            if (!validKeys.includes(key)) {
                throw new Error(`Invalid analytics key: ${key}. Valid keys are: ${validKeys.join(', ')}`);
            }
            // Set the value
            this._analytics[character][key] = this._analytics[character][key] + 1;

            return true;

        } catch (error) {
            console.error('Error setting analytics:', error.message);
            return false;
        }
    }


    getAnalytics(key, character) {
        // Valid keys for analytics
        const validKeys = EMOJI_TYPES.map(item => item.type);

        try {
            // Check if key is valid
            if (!validKeys.includes(key)) {
                throw new Error(`Invalid analytics key: ${key}. Valid keys are: ${validKeys.join(', ')}`);
            }

            // Return the value (if key doesn't exist, return 0)
            return this._analytics[character][key] || 0;

        } catch (error) {
            console.error('Error getting analytics:', error.message);
            return 0;
        }
    }



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
        }
    }

    applyVelocityToExtra(extra) {
        extra.body.setVelocityY(this._extraVelocity);
    }


    pauseGame() {
        this._isGamePaused = true;
        this._scene.game.pause();
        this._scene.physics.pause();
        this._scene.anims.pauseAll();
        if (this._spawnTimer) {
            this._spawnTimer.paused = true;
        }
    }

    resumeGame() {
        this._isGamePaused = false;
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


    ///  Flying text

    createFlyingText(x, y, text, style) {
        if (this.flyingText) {
            this.flyingText.create(x, y, text, style);
        } else {
            console.warn('FlyingText not initialized');
        }
    }


    /// Sound and Music

    playSound(key, config = {}) {
        if (this.audioManager) {
            if (!this._isGamePaused) {
                if (key === 'background' && this._musicOn) {
                    console.log(key, "  ", this._musicOn)
                    this.audioManager.play(key, config);
                } else {
                    if (key !== 'background' && this._soundOn) {
                        this.audioManager.play(key, config);
                    }
                }
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
            if (key === 'background' && this._musicOn) {
                // Check if background music is playing
                if (!this.audioManager.isPlaying(key)) {
                    this.audioManager.play(key, {
                        volume: 0.1,
                        loop: true,
                    })
                } else {
                    this.audioManager.resume(key);
                }
            } else if (key !== 'background' && this._soundOn) {
                this.audioManager.resume(key);
            } else {
                this.audioManager.pause(key);
            }
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
