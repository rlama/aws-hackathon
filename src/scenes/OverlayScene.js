// Create a separate scene for handling inputs
export default class OverlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OverlayScene' });
    }
    init(data) {
        this.parentScene = data.parentScene;
        this.buttonManager = data.buttonManager;
    }

    create() {
        // Create semi-transparent background
        const overlay = this.add.rectangle(
            0,
            0,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.5
        )
        .setOrigin(0)
        .setDepth(9);
        

        // Create resume button
        const resumeButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Resume',
            {
                fontSize: '32px',
                fill: '#ffffff',
                backgroundColor: '#444444',
                padding: { x: 20, y: 10 }
            }
        )
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setDepth(9);

        // Button interactions
        resumeButton
            .on('pointerover', () => {
                resumeButton.setStyle({ fill: '#ff0' });
            })
            .on('pointerout', () => {
                resumeButton.setStyle({ fill: '#ffffff' });
            })
            .on('pointerdown', () => {
                this.buttonManager.togglePlayPauseState();
            })

        // Optional: Add more pause menu options here
        const menuButton = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 60,
            'Game info & rules',
            {
                fontSize: '32px',
                fill: '#ffffff',
                backgroundColor: '#444444',
                padding: { x: 20, y: 10 }
            }
        )
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .setDepth(10)

        menuButton
            .on('pointerover', () => {
                menuButton.setStyle({ fill: '#ff0' });
            })
            .on('pointerout', () => {
                menuButton.setStyle({ fill: '#ffffff' });
            })
            .on('pointerdown', () => {
                const sc = this.scene.launch('GameInfoScene', {
                    previousScene: this.scene.key,
                    sceneStack: [this.scene.key]
                });
                this.scene.stop();
            });

    }

}