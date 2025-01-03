/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */

export default class FlyingText {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.texts = new Map();
        this.counter = 0;
    }

    
    create(x, y, text, config = {}) {
        const defaultConfig = {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            fillColor: '',
            backgroundColor: '',
            strokeThickness: 2,
            duration: Phaser.Math.Between(700, 1200),
            distance: Phaser.Math.Between(10, 70),
            fadeInDuration: 300,
            holdDuration: Phaser.Math.Between(200, 500),
            fadeOutDuration: 300,
            padding: { x: 10, y: 5 },
            ...config
        };

        const finalConfig = { ...defaultConfig, ...config };
        const id = this.counter++;

        // Create text object
        const textObject = this.scene.add.text(x, y, text, {
            fontSize: finalConfig.fontSize,
            color: finalConfig.color,
            stroke: finalConfig.stroke,
            strokeThickness: finalConfig.strokeThickness,
            fillColor: finalConfig.fillColor,
            backgroundColor: finalConfig.backgroundColor,
            padding: finalConfig.padding
        }).setOrigin(0.5);

        // Initial setup
        textObject.setAlpha(0);

        // Create fade in tween
        this.scene.tweens.add({
            targets: textObject,
            alpha: 1,
            y: y - (finalConfig.distance / 2),
            duration: finalConfig.fadeInDuration,
            ease: 'Quad.easeOut',
            onComplete: () => {
                // Create hold and float tween
                this.scene.tweens.add({
                    targets: textObject,
                    y: y - (finalConfig.distance * 0.75),
                    duration: finalConfig.holdDuration,
                    ease: 'Sine.easeInOut',
                    onComplete: () => {
                        // Create fade out tween
                        this.scene.tweens.add({
                            targets: textObject,
                            alpha: 0,
                            y: y - finalConfig.distance,
                            duration: finalConfig.fadeOutDuration,
                            ease: 'Quad.easeIn',
                            onComplete: () => {
                                textObject.destroy();
                                this.texts.delete(id);
                            }
                        });
                    }
                });
            }
        });

        // Store reference
        this.texts.set(id, {
            text: textObject
        });

        return id;
    }

    // Stop and destroy specific text animation
    stop(id) {
        if (this.texts.has(id)) {
            const { text } = this.texts.get(id);
            text.destroy();
            this.texts.delete(id);
        }
    }

    // Stop and destroy all text animations
    stopAll() {
        this.texts.forEach(({ text }) => {
            text.destroy();
        });
        this.texts.clear();
    }
}
