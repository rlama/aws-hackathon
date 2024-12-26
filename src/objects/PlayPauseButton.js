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

        this.ypos = 20;
    }

    createButtons(){
        const gameWidth = this.scene.cameras.main.width;

        const config = {
            fontSize: '50px',
            fontFamily: 'Arial, "Segoe UI Emoji", sans-serif',
            resolution: 2,
            fill: '#2693d6',
            stroke: '#000000',
            strokeThickness: 2
        };
        this.activeButton = this.scene.add.text(gameWidth / 2, this.ypos, '⚙', config)
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5)
        .setDepth(20);

         // Click handler for toggling play/pause
        this.activeButton.on('pointerdown', (pointer, localX, localY, event) => {
            event.stopPropagation();
            this.togglePlayPauseState();
        });

        this.activeButton.on('pointerover', () => {
            this.activeButton.setScale(1.1);
        });
        this.activeButton.on('pointerout', () => {
            this.activeButton.setScale(1);
        });
     

        // action for spacebar
        this.spaceBar = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.spaceBar.on('down', () => {
            this.togglePlayPauseState();
        });

        

        return { active: this.activeButton };
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
        const textureKey = !this.isPaused ? '⚙' : '⚙';
        this.activeButton.setText(textureKey);
        // this.activeButton.setTexture(textureKey);

        if (this.isPaused) {
            this.scene.pauseGame();
            this.addOverlayScene();

        } else {
            // this.gameStateManager.resumeSound("background")
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
