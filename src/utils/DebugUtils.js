// DebugUtils.js
export class AtlasDebugger {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.atlasKeys = config.atlasKeys || ['characters', 'extras'];
        this.spacing = {
            frameWidth: config.frameWidth || 300,
            frameHeight: config.frameHeight || 400,
            padding: config.padding || 20
        };
    }

    create() {
        this.debugContainer = this.scene.add.container(0, 0);
        this.debugContainer.setVisible(false);

        const atlasKeys = ['characters', 'extras'];
        let totalY = 10;

        atlasKeys.forEach(atlasKey => {
            totalY = this.displayAtlas(atlasKey, totalY);
        });

        this.setupControls(totalY);
        this.setupBackground();
    }

    displayAtlas(atlasKey, totalY) {
        // Add atlas title
        const titleText = this.scene.add.text(10, totalY, `Atlas: ${atlasKey}`, {
            fontSize: '16px',
            backgroundColor: '#000',
            padding: { x: 5, y: 5 }
        });
        this.debugContainer.add(titleText);
        totalY += 40;

        // Get frames
        const frames = this.scene.textures.get(atlasKey).getFrameNames();
        let x = this.spacing.padding;
        let y = totalY;

        frames.forEach((frameName) => {
            const frameContainer = this.createFrameDisplay(atlasKey, frameName, x, y);
            this.debugContainer.add(frameContainer);

            x += this.spacing.frameWidth;
            if (x > this.scene.game.config.width - this.spacing.frameWidth) {
                x = this.spacing.padding;
                y += this.spacing.frameHeight;
            }
        });

        return y + this.spacing.frameHeight;
    }

    createFrameDisplay(atlasKey, frameName, x, y) {
        const frameContainer = this.scene.add.container(x, y);
        
        const sprite = this.scene.add.sprite(0, 0, atlasKey, frameName);
        const frame = this.scene.textures.get(atlasKey).frames[frameName];
        
        const scaleX = (this.spacing.frameWidth - this.spacing.padding * 2) / frame.width;
        const scaleY = (this.spacing.frameHeight - this.spacing.padding * 2 - 60) / frame.height;
        const scale = Math.min(scaleX, scaleY, 1);
        
        sprite.setScale(scale);
        frameContainer.add(sprite);

        const info = [
            `Name: ${frameName}`,
            `Size: ${frame.width}x${frame.height}`,
            `Scale: ${scale.toFixed(2)}`,
            `Position: ${frame.x},${frame.y}`
        ];

        const text = this.scene.add.text(0, sprite.height * scale + 10, info, {
            fontSize: '12px',
            backgroundColor: '#000',
            padding: { x: 2, y: 2 },
            align: 'center'
        }).setOrigin(0.5, 0);
        
        frameContainer.add(text);
        return frameContainer;
    }

    setupControls(totalY) {
        const controls = [
            'Debug Controls:',
            'D: Toggle debug view',
            'Left/Right: Navigate frames',
            'Space: Play animation'
        ];

        const controlsText = this.scene.add.text(10, totalY, controls, {
            fontSize: '14px',
            backgroundColor: '#000',
            padding: { x: 5, y: 5 }
        });
        this.debugContainer.add(controlsText);

        // Add scrolling support
        this.scene.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
            if (this.debugContainer.visible) {
                this.debugContainer.y -= deltaY;
                this.debugContainer.y = Phaser.Math.Clamp(
                    this.debugContainer.y,
                    -(totalY - this.scene.game.config.height + 100),
                    0
                );
            }
        });

        // Toggle visibility
        this.scene.input.keyboard.on('keydown-D', () => {
            this.debugContainer.setVisible(!this.debugContainer.visible);
            this.debugContainer.y = 0;
        });
    }

    setupBackground() {
        const background = this.scene.add.rectangle(
            0, 0,
            this.scene.game.config.width,
            this.scene.game.config.height,
            0x000000,
            0.8
        );
        background.setOrigin(0);
        this.debugContainer.add(background);
        background.setDepth(-1);
    }

    show() {
        this.debugContainer.setVisible(true);
    }

    hide() {
        this.debugContainer.setVisible(false);
    }

    toggle() {
        this.debugContainer.setVisible(!this.debugContainer.visible);
    }

    destroy() {
        this.debugContainer.destroy();
    }
}