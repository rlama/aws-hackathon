/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */
import GameStateManager from "../components/GameStateManager";

export default class PlayPauseButton {
    constructor(scene) {
        this.gameStateManager = GameStateManager.getInstance();
        this.scene = scene;
        this.buttons = {};
        // this.buttonScale = 0.15;
        this.isPlaying = true;

        this.ypos = 40;
    }



    createButtons() {
        const gameWidth = this.scene.cameras.main.width;

        // Create button with explicit texture reference
        this.activeButton = this.scene.add.sprite(
            gameWidth / 2,
            this.ypos,
            'pause-button'
        );

        // Store actual texture objects
        this.textureKeys = {
            play: this.scene.textures.get('play-button'),
            pause: this.scene.textures.get('pause-button')
        };

        this.activeButton.setScale(40 / 256);
        this.activeButton.setDepth(27);

        const overlay = this.addBtnOverlay();

        return { active: this.activeButton };
    }



    addBtnOverlay() {
        const gameWidth = this.scene.cameras.main.width;
        const circleRadius = 30;

        // Create circular background
        const circle = this.scene.add.circle(
            gameWidth / 2,
            this.ypos,
            circleRadius,
            0xffffff,
            0.3
        );

        // Make interactive
        circle.setInteractive({
            useHandCursor: true,
            hitArea: new Phaser.Geom.Circle(circleRadius, circleRadius, circleRadius),
            hitAreaCallback: Phaser.Geom.Circle.Contains
        });

        // Click handler for toggling play/pause
        circle.on('pointerdown', (pointer, localX, localY, event) => {
            event.stopPropagation();
            this.togglePlayPauseState();
        });

        circle.setDepth(25);
        return circle;
    }


    addOverlayScene() {
        // Create a new scene for the overlay that stays active
        if (!this.scene.scene.get('OverlayScene')) {
            this.scene.scene.add('OverlayScene', OverlayScene, true);
        }

        this.scene.scene.launch('OverlayScene', {
            parentScene: this.scene,
            playPauseButton: this
        });
    }


    togglePlayPauseState() {
        this.isPaused = !this.isPaused;
        const textureKey = !this.isPaused ? 'pause-button' : 'play-button';
        this.activeButton.setTexture(textureKey);

        if (this.isPaused) {
            this.scene.pauseGame();
            this.addOverlayScene();

        } else {
            this.gameStateManager.resumeAllSounds()
            this.scene.resumeGame();
            this.scene.scene.stop('OverlayScene');
        }
    }

    isGamePlaying() {
        return this.isPlaying;
    }


    getButtons() {
        return this.buttons;
    }
}
