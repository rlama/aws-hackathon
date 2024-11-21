import Phaser from 'phaser';
import { AtlasDebugger } from '../utils/DebugUtils';
import CharacterManager from '../components/CharacterManager';
import ButtonManager from '../components/ButtonManager';
import FocusManager from '../components/FocusManager';
import CollisionManager from '../components/CollisionManager';
import GameStateManager from '../components/GameStateManager';
import ExtraManager from '../components/ExtraManager';
import ScoreManager from '../components/ScoreManager';
import { EXTRA_SCALE, EXTRA_TYPES } from '../config/gameConfig';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.selectedCharacter =  data.selectedCharacter; // Get the selected character from scene data
        this.autoPlayingCharacter = data.autoPlayingCharacter;
    }

    create() {

        this.gameWidth = this.cameras.main.width;
        this.gameHeight = this.cameras.main.height;
        // Check device width
        const backgroundImage = this.gameWidth <= 700 ? 'backgroundMobile' : 'backgroundDesktop';


        // Add background first before any other game objects
        if (this.textures.exists(backgroundImage)) {
            const background = this.add.image(0, 0, backgroundImage);
            background.setOrigin(0, 0);
            background.setDepth(-1);  // Ensure it's behind everything

            // Scale background to fit the game width and height
            background.displayWidth = this.gameWidth;
            background.displayHeight = this.gameHeight;

        } else {
            console.error('Background texture not found in GameScene!');
        }


        // Create the debug utility
        const debugConfig = {
            atlasKeys: ['characters', 'extras', backgroundImage],
            frameWidth: 150,
            frameHeight: 150,
            padding: 10
        };

        this.atlasDebugger = new AtlasDebugger(this, debugConfig);
        this.atlasDebugger.create();

        // Initialize managers
        this.gameStateManager = new GameStateManager(this);
        this.scoreManager = new ScoreManager(this);
        this.characterManager = new CharacterManager(this, this.selectedCharacter, this.gameStateManager);
        this.extraManager = new ExtraManager(this, this.gameStateManager);
        this.buttonManager = new ButtonManager(this);
        this.collisionManager = new CollisionManager(this, this.gameStateManager, this.scoreManager);
        this.focusManager = new FocusManager(this);


        // Create game elements
        this.characterManager.createCharacters();
        this.characterManager.setupCharacterPhysics();

        // Tint when collecting items
        // this.characterManager.addGlowEffect();
        this.characterManager.addTint();


        this.buttonManager.createButtons();
        this.characterManager.setupInputs();

        // Start game systems
        this.gameStateManager.startGame();

        this.focusManager.initialize();


        // Handle window resize
        this.scale.on('resize', () => {
            this.characterManager.handleResize();
            this.buttonManager.updateButtonPositions();
            this.scoreManager.handleResize({ width: this.gameWidth, height: this.gameHeight });
        });

    }

    pauseGame() {
        this.gameStateManager.pauseGame();
        this.buttonManager.isPlaying = false;
    }

    resumeGame() {
        this.gameStateManager.resumeGame();
        this.buttonManager.isPlaying = true;
    }

    update(time, delta) {
        if (!this.gameStateManager.isGamePaused()) {
            this.gameStateManager.update(time, delta);
            this.extraManager.update(time, delta);
            this.characterManager.update();

        }
    }

}
