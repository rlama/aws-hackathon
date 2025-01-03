/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */

export default class CursorManager {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.config = {
            atlas: 'game-atlas',  
            onionFrame: 'onion', 
            scale: 0.4, 
            depth: 1000, 
            defaultCursor: 'pointer',
            ...config
        };

        this.sprite = null;
        this.isOnionMode = false;

        this.init();
    }

    init() {
        // Set default hand cursor
        this.setDefaultCursor();

        // Create (but hide) the onion sprite cursor
        this.sprite = this.scene.add.sprite(0, 0, this.config.atlas, this.config.onionFrame)
            .setDepth(this.config.depth)
            .setScale(this.config.scale)
            .setVisible(false);

        // Update sprite position when pointer moves
        this.scene.input.on('pointermove', (pointer) => {
            if (this.sprite) {
                this.sprite.setPosition(pointer.x, pointer.y);
            }
        });

        // Handle window focus/blur
        this.onBlur = () => {
            if (this.sprite) this.sprite.setVisible(false);
        };
        this.onFocus = () => {
            if (this.sprite && this.isOnionMode) this.sprite.setVisible(true);
        };

        window.addEventListener('blur', this.onBlur);
        window.addEventListener('focus', this.onFocus);
    }

    setDefaultCursor() {
        this.isOnionMode = false;
        this.scene.input.setDefaultCursor(this.config.defaultCursor);
        if (this.sprite) {
            this.sprite.setVisible(false);
        }
    }

    setOnionCursor() {
        this.isOnionMode = true;
        this.scene.input.setDefaultCursor('none');
        if (this.sprite) {
            this.sprite.setVisible(true);
        }
    }

    destroy() {
        window.removeEventListener('blur', this.onBlur);
        window.removeEventListener('focus', this.onFocus);
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }
        this.scene.input.setDefaultCursor('default');
    }
}
