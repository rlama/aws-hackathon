/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */


import { addBackground, createCloseButton } from "../utils/helpers";

export default class DebugAtlasScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DebugAtlasScene' });
        this.spacing = {
            frameWidth: 150,
            frameHeight: 150,
            padding: 20
        };
    }

    init(data) {
        this.atlasKeys = data.atlasKeys || ['characters', 'extras'];
        this.parentScene = data.parentScene;
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;
        addBackground(this, width, height);

        createCloseButton(this);

        this.createContent();
        // this.setupKeyboardControls();
    }


    createContent() {
        this.contentContainer = this.add.container(0, 0);
        let totalY = 10;

        // Title
        const title = this.add.text(10, totalY, 'Atlas Debugger', {
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#333333',
            padding: { x: 10, y: 5 }
        });
        this.contentContainer.add(title);
        totalY += 50;

        // Display each atlas
        this.atlasKeys.forEach(atlasKey => {
            totalY = this.displayAtlas(atlasKey, totalY);
        });

        // Add controls info
        this.addControlsInfo(totalY);

        // Add scroll functionality
        this.setupScrolling(totalY);
    }

    displayAtlas(atlasKey, totalY) {
        // Atlas title
        const titleText = this.add.text(10, totalY, `Atlas: ${atlasKey}`, {
            fontSize: '16px',
            backgroundColor: '#000',
            padding: { x: 5, y: 5 }
        });
        this.contentContainer.add(titleText);
        totalY += 40;

        // Get and display frames
        const frames = this.textures.get(atlasKey).getFrameNames();
        let x = this.spacing.padding;
        let y = totalY;

        frames.forEach((frameName) => {
            const frameContainer = this.createFrameDisplay(atlasKey, frameName, x, y);
            this.contentContainer.add(frameContainer);

            x += this.spacing.frameWidth;
            if (x > this.cameras.main.width - this.spacing.frameWidth) {
                x = this.spacing.padding;
                y += this.spacing.frameHeight;
            }
        });

        return y + this.spacing.frameHeight;
    }

    createFrameDisplay(atlasKey, frameName, x, y) {
        const container = this.add.container(x, y);
        
        const sprite = this.add.sprite(0, 0, atlasKey, frameName);
        const frame = this.textures.get(atlasKey).frames[frameName];
        
        const scaleX = (this.spacing.frameWidth - this.spacing.padding * 2) / frame.width;
        const scaleY = (this.spacing.frameHeight - this.spacing.padding * 2 - 60) / frame.height;
        const scale = Math.min(scaleX, scaleY, 1);
        
        sprite.setScale(scale);
        container.add(sprite);

        const info = [
            `Name: ${frameName}`,
            `Size: ${frame.width}x${frame.height}`,
            `Scale: ${scale.toFixed(2)}`,
            `Position: ${frame.x},${frame.y}`
        ];

        const text = this.add.text(0, sprite.height * scale + 10, info, {
            fontSize: '12px',
            backgroundColor: '#000',
            padding: { x: 2, y: 2 },
            align: 'center'
        }).setOrigin(0.5, 0);
        
        container.add(text);
        return container;
    }

    addControlsInfo(totalY) {
        const controls = [
            'Debug Controls:',
            'ESC: Close debugger',
            'Mouse wheel: Scroll content',
            'D: Toggle debug view'
        ];

        const controlsText = this.add.text(10, totalY, controls, {
            fontSize: '14px',
            backgroundColor: '#000',
            padding: { x: 5, y: 5 }
        });
        this.contentContainer.add(controlsText);
    }

    setupScrolling(contentHeight) {
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            const newY = this.contentContainer.y - deltaY;
            const maxScroll = -(contentHeight - this.cameras.main.height + 100);
            
            this.contentContainer.y = Phaser.Math.Clamp(newY, maxScroll, 0);
        });
    }

}
