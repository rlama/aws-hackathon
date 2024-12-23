/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */


import { FONT_FAMILY } from "../config/gameConfig";
import StandardButton from "../objects/StandardButton";
// Create a separate scene for handling inputs
export default class OverlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OverlayScene' });
    }
    init(data) {
        this.parentScene = data.parentScene;
        this.playPauseButton = data.playPauseButton;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

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

        let ypos = this.cameras.main.centerY - 50
        const xpos = this.cameras.main.centerX
        const resumeButton = new StandardButton(this, xpos, ypos, 'Resume', {
            backgroundColor: 0x444444,
            onClick: () => {
                this.playPauseButton.togglePlayPauseState();
            },
            zIndex: 10
        });

        ypos += 50
        const gameInfoButton = new StandardButton(this, xpos, ypos, 'Game info & rules', {
            backgroundColor: 0x444444,
            onClick: () => {
                const sc = this.scene.start('GameInfoScene', {
                    parentScene: this.scene.key,
                    previousScene: this.scene.key,
                    sceneStack: [this.scene.key]
                });
                this.scene.stop();
            },
            zIndex: 10
            
        });

    }

}