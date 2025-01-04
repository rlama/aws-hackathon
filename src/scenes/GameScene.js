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
        // Use singleton pattern more efficiently
        this.gameStateManager = GameStateManager.getInstance();
        this.gameStateManager.scene = this;
        this.states = [];
        this.stateData = null;
        this.playerPoints = '';
        this.cleanupCallbacks = [];
    }

    // Implement initialization method to separate concerns
    init() {
        this.gameWidth = this.cameras.main.width;
        this.gameHeight = this.cameras.main.height;
        this.setupPhysics();
    }

    // Separate physics setup
    setupPhysics() {
        this.physics.world.setFPS(GAME_FRAME_RATE);
        this.game.loop.targetFps = GAME_FRAME_RATE;
    }

    create() {
        // Set cursor once
        this.input.setDefaultCursor('crosshair');

        // Initialize managers using a dedicated method
        this.initializeManagers();

        // Setup game elements
        this.setupGameElements();

        // Initialize UI elements
        this.setupUI();

        // Set up event listeners
        this.setupEventListeners();
    }

    // Separate manager initialization
    initializeManagers() {
        this.backgroundManager = new BackgroundManager(this);
        this.backgroundManager.addBackground({
            isGameScene: false,
            addOverlay: false,
            type: 'default'
        });

        this.mapManager = new MapManager(this);
        this.characterManager = new CharacterManager(this);
        this.scoreManager = new ScoreManager(this);
        this.extraManager = new ExtraManager(this, this.mapManager);
        this.collisionManager = new CollisionManager(this, this.scoreManager);
        this.focusManager = new FocusManager(this);
    }

    // Separate game elements setup
    setupGameElements() {
        this.cameras.main.setViewport(0, 0, this.gameWidth, this.gameHeight);
        this.cameras.main.setBackgroundColor('#ffffff');

        this.mapManager.createStateMap();
        this.characterManager.createCharacters();
        this.characterManager.setupCharacterPhysics();
        this.characterManager.addTint();
        this.characterManager.setCharacterControlsKeyInputs();
        this.gameStateManager.initializeFlyingText(this);
        this.gameStateManager.startGame();
        this.focusManager.initialize();
    }

    // Separate UI setup
    setupUI() {
        const width = this.cameras.main.width;
        let ypos = width < MAX_MOBILE_WIDTH ? 55 : 23;
        ypos = isIphone() ? ypos + 50 : ypos;
        this.settingsButton = new SettingsButton(this, width/2, ypos, true);
    }

    // Optimize update method using RAF
    update(time, delta) {
        if (this.gameStateManager.isGamePaused) return;

        requestAnimationFrame(() => {
            this.gameStateManager.update(time, delta);
            this.extraManager.update(time, delta);
            this.characterManager.updateAutoPlaying();
        });
    }

    // Implement proper event handling
    setupEventListeners() {
        const events = this.game.events;
        events.once('shutdown', this.cleanup, this);
        events.on('widthchange', this.handleResize, this);
        events.on('viewportupdate', this.handleViewportUpdate, this);
        this.handleResize();
    }

    // Optimize resize handler
    handleResize = (newWidth) => {
        const width = newWidth || this.cameras.main.width;
        if (width < MAX_MOBILE_WIDTH) {
            // Use RAF for layout updates
            requestAnimationFrame(() => {
                this.updateMobileLayout();
            });
        }
    }

    // Separate mobile layout updates
    updateMobileLayout() {
        // Add your mobile-specific layout updates here
    }

    handleViewportUpdate = ({ width, height, safeArea }) => {
        const { top, bottom } = safeArea;
        // Handle viewport updates if needed
    }

    // Implement proper cleanup
    cleanup() {
        // Clean up event listeners
        this.game.events.off('widthchange', this.handleResize);
        this.game.events.off('viewportupdate', this.handleViewportUpdate);

        // Execute cleanup callbacks
        this.cleanupCallbacks.forEach(callback => callback());
        this.cleanupCallbacks = [];

        // Clear managers
        this.backgroundManager = null;
        this.mapManager = null;
        this.characterManager = null;
        this.scoreManager = null;
        this.extraManager = null;
        this.collisionManager = null;
        this.focusManager = null;
    }

    // Game state methods
    pauseGame() {
        this.gameStateManager.pauseSound('background');
        this.scene.pause();
    }

    resumeGame() {
        this.gameStateManager.isGamePaused = false;
        this.scene.resume();
    }
}
