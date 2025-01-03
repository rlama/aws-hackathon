/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */


import Phaser from 'phaser';
import CharacterManager from '../managers/CharacterManager';
import StandardButton from '../objects/StandardButton';
import FocusManager from '../managers/FocusManager';
import CollisionManager from '../managers/CollisionManager';
import GameStateManager from '../managers/GameStateManager';
import ExtraManager from '../managers/ExtraManager';
import ScoreManager from '../managers/ScoreManager';
import MapManager from '../managers/MapManager';
import MemoryMonitor from '../managers/MemoryMonitor';
import { BackgroundManager } from '../managers/BackgroundManager';
import { MAX_MOBILE_WIDTH } from '../config/gameConfig';
import SettingsButton from '../objects/SettingsButton';
import { isIphone } from '../utils/helpers';


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

        this.input.setDefaultCursor('crosshair');


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
        // addBackground(this, this.gameWidth, this.gameHeight, false, 'gamescene')

        // Create background manager
        this.backgroundManager = new BackgroundManager(this);

        // Add background with options
        this.backgroundManager.addBackground({
            isGameScene: false,
            addOverlay: false,
            type: 'default'
        });


        //create map
        this.cameras.main.setViewport(0, 0, this.gameWidth, this.gameHeight);
        this.cameras.main.setBackgroundColor('#ffffff');

        // Initialize managers
        // this.gameStateManager = new GameStateManager(this);
        this.mapManager = new MapManager(this);
        this.characterManager = new CharacterManager(this);
        this.scoreManager = new ScoreManager(this);
        this.extraManager = new ExtraManager(this, this.mapManager);
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

        this.characterManager.setCharacterControlsKeyInputs();

        this.gameStateManager.initializeFlyingText(this)

        // Start game systems
        this.gameStateManager.startGame();

        this.focusManager.initialize();

        // Add settings button
        let ypos = width < MAX_MOBILE_WIDTH ?  55 : 23;
        ypos = isIphone() ? ypos + 50 : ypos;

        this.settingsButton = new SettingsButton(this, width/2, ypos, true)
        
        this.eventListeners()
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
        this.gameStateManager.isGamePaused = false;
        this.scene.resume();
        // this.gameStateManager.resumeSound('background');
    }

    update(time, delta) {
        if (!this.gameStateManager.isGamePaused) {
            this.gameStateManager.update(time, delta);
            this.extraManager.update(time, delta);
            this.characterManager.updateAutoPlaying();
        }
    }

    eventListeners() {
        this.game.events.on('widthchange', this.hadleResize, this);

        // Listen for viewport updates
        this.game.events.on('viewportupdate', this.handleViewportUpdate, this);
        this.hadleResize();

    }

    hadleResize(newWidth) {
        const width = newWidth || this.cameras.main.width;
        const height = this.cameras.main.height;
        if (width < MAX_MOBILE_WIDTH) {
            // this.selectCandidate.setY(height * 0.22)
            // this.selectCandidate.setStyle({fontSize:'22px'})

            // this.chadTxt.setX(width * 0.25)
            // this.barryTxt.setX(width * 0.75)

            // this.chadTxt.setY(height * 0.55)
            // this.barryTxt.setY(height * 0.55)

        }
    }

    handleViewportUpdate = ({ width, height, safeArea }) => {
        // Adjust your UI elements to account for safe areas
        const { top, bottom } = safeArea;

        console.log(top, bottom)

    }

    shutdown() {
        this.game.events.removeListener('viewportupdate', this.handleViewportUpdate);
    }


}

