// src/components/ButtonManager.js
export default class ButtonManager {
    constructor(scene) {
        this.scene = scene;
        this.buttons = {};
        // this.buttonScale = 0.15;
        this.isPlaying = true;
    }

    createButtons() {
        const gameWidth = this.scene.scale.width;
        
        // Create pause button
        this.buttons.pause = this.scene.add.image(
            Math.round(gameWidth/2+30),
            30,
            'pause-button'
        );

        // Create play button
        this.buttons.play = this.scene.add.image(
            Math.round(gameWidth/2 - 15),
            30,
            'play-button'
        );

        // Configure buttons
        Object.values(this.buttons).forEach(button => {
            button.setInteractive(
                { 
                    useHandCursor: true,
                    pixelPerfect: true 
                }
            );

            const scaleX = 40 / 256;
            const scaleY = 40 / 256;
            
            button.setScale(scaleX, scaleY);

            // button.setScale(this.buttonScale);
            button.setDepth(20); 
        });

        this.setupButtonListeners();
    }

    setupButtonListeners() {
        this.buttons.play.on('pointerdown', () => {
            this.scene.resumeGame();
        });

        this.buttons.pause.on('pointerdown', () => {
            this.scene.pauseGame();
        });
    }

    updateButtonPositions() {
        const gameWidth = this.scene.scale.width;

        if (this.buttons.pause) {
            this.buttons.pause.setPosition(gameWidth - 40, 40);
        }
        if (this.buttons.play) {
            this.buttons.play.setPosition(gameWidth - 70, 40);
        }
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.scene.pauseGame();
        } else {
            this.scene.resumeGame();
        }
        this.isPlaying = !this.isPlaying;
    }

    getButtons() {
        return this.buttons;
    }
}
