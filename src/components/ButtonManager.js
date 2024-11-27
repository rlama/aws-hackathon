// src/components/ButtonManager.js
export default class ButtonManager {
    constructor(scene) {
        this.scene = scene;
        this.buttons = {};
        // this.buttonScale = 0.15;
        this.isPlaying = true;
    }


    createButtons() {
        const gameWidth = this.scene.cameras.main.width;

        // Create button with explicit texture reference
        this.activeButton = this.scene.add.sprite(
            gameWidth / 2,
            30,
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
            30,
            circleRadius,
            0x333333
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
            buttonManager: this
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
