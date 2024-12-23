/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */


import Phaser from 'phaser';
import CharacterManager from '../components/CharacterManager';
import PlayPauseButton from '../objects/PlayPauseButton';
import FocusManager from '../components/FocusManager';
import CollisionManager from '../components/CollisionManager';
import GameStateManager from '../components/GameStateManager';
import ExtraManager from '../components/ExtraManager';
import ScoreManager from '../components/ScoreManager';
import MapManager from '../components/MapManager';
import MemoryMonitor from '../components/MemoryMonitor';


// import CursorManager from '../components/CursorManager';
import { EXTRA_SCALE, EXTRA_TYPES, GAME_FRAME_RATE } from '../config/gameConfig';
import { addBackground } from "../utils/helpers";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });

        this.gameStateManager = GameStateManager.getInstance();
        this.gameStateManager.scene = this;

        this.states = []; // Store state graphics
        this.stateData = null; // JSON data for the map
        this.playerPoints = "";
        this.memoryMonitor = null; // Will initialize in create()
        this.cleanupCallbacks = []; // Array to store cleanup functions

    }


    create() {

        // Initialize memory monitor
        // this.memoryMonitor = new MemoryMonitor(this.game);
        // this.memoryMonitor.start(5000); // Check every 5 seconds

        // // Add cleanup callback for memory monitor
        // this.addCleanupCallback(() => {
        //     if (this.memoryMonitor) {
        //         this.memoryMonitor.stop();
        //     }
        // });

        // Set consistent frame rate
        this.physics.world.setFPS(GAME_FRAME_RATE);
        // Enable V-Sync if available
        this.game.loop.targetFps = GAME_FRAME_RATE;


        this.gameWidth = this.cameras.main.width;
        this.gameHeight = this.cameras.main.height;

        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        addBackground(this, this.gameWidth, this.gameHeight, false, 'gamescene')


        //create map
        this.cameras.main.setViewport(0, 0, this.gameWidth, this.gameHeight);
        this.cameras.main.setBackgroundColor('#ffffff');

        // Initialize managers
        // this.gameStateManager = new GameStateManager(this);
        this.mapManager = new MapManager(this);
        this.characterManager = new CharacterManager(this);
        this.scoreManager = new ScoreManager(this);
        this.extraManager = new ExtraManager(this, this.mapManager);
        this.playPauseButton = new PlayPauseButton(this);
        this.collisionManager = new CollisionManager(this, this.scoreManager);
        this.focusManager = new FocusManager(this);

       
        // Create the map
        this.mapManager.createStateMap();

        // Create game elements
        this.characterManager.createCharacters();
        this.characterManager.setupCharacterPhysics();

        // Tint when collecting items
        // this.characterManager.addGlowEffect();
        this.characterManager.addTint();

        this.playPauseButton.createButtons();
        this.characterManager.setCharacterControlsKeyInputs();

        this.gameStateManager.initializeFlyingText(this)

        // Start game systems
        this.gameStateManager.startGame();

        this.focusManager.initialize();

    }


    // Add cleanup management
    addCleanupCallback(callback) {
        this.cleanupCallbacks.push(callback);
    }

    pauseGame() {
        this.gameStateManager.pauseSound('background');
        this.scene.pause();
    }

    resumeGame() {
        this.scene.resume();
    }

    update(time, delta) {
        if (!this.gameStateManager.isGamePaused) {
            this.gameStateManager.update(time, delta);
            this.extraManager.update(time, delta);
            this.characterManager.updateAutoPlaying();
        }
    }

}

