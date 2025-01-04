/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */

import { gameConfig } from '../config/gameConfig';
import { OrientationManager } from '../managers/OrientationManager';
import { ViewportManager } from '../managers/ViewportManager';


class Game extends Phaser.Game {
    constructor() {
        super(gameConfig);
        this.initialize();
    }

    initialize() {
        const orientationManager = OrientationManager.getInstance(this);
        orientationManager.initialize();

        const viewportManager = new ViewportManager(this);
        
        // Wait for the game to be ready before adding spacebar listener
        this.events.once('ready', () => {
            this.setupSpacebarListener();
        });
    }

    setupSpacebarListener() {
        // Add listener to scene creation
        this.scene.scenes.forEach(scene => {
            // Skip SettingsScene to avoid recursive opening
            if (scene.scene.key !== 'SettingsScene') {
                scene.events.once('create', () => {
                    this.addSpacebarToScene(scene);
                });
            }
        });

        // Listen for new scenes using the scene manager events
        this.events.on('sceneadd', (scene) => {
            if (scene.scene.key !== 'SettingsScene') {
                this.addSpacebarToScene(scene);
            }
        });
    }

    addSpacebarToScene(scene) {
        const keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keySpace.on('down', () => {
            // Only open settings if it's not already active
            if (!this.scene.isActive('SettingsScene')) {
                const isGameScene = scene.scene.key === 'GameScene';
                
                if (isGameScene) {
                    scene.scene.pause();
                    scene.scene.launch('SettingsScene', {
                        parentScene: scene,
                        isGameScene: true
                    });
                } else {
                    scene.scene.start('SettingsScene', {
                        parentScene: scene,
                        isGameScene: false
                    });
                }
            }
        });

        // Store the key reference for cleanup
        if (!scene.spacebarKeys) {
            scene.spacebarKeys = [];
        }
        scene.spacebarKeys.push(keySpace);

        // Add cleanup on scene shutdown
        scene.events.once('shutdown', () => {
            if (scene.spacebarKeys) {
                scene.spacebarKeys.forEach(key => {
                    key.removeAllListeners();
                });
                scene.spacebarKeys = [];
            }
        });
    }

    destroy() {
        try {
            this.scene.scenes.forEach(scene => {
                try {
                    // Clean up spacebar listeners
                    if (scene.spacebarKeys) {
                        scene.spacebarKeys.forEach(key => {
                            key.removeAllListeners();
                        });
                        scene.spacebarKeys = [];
                    }
                    
                    scene.events.removeAllListeners();
                    scene.scene.stop();
                    scene.scene.remove();
                } catch (e) {
                    console.warn('Scene cleanup error:', e);
                }
            });

            this.events.removeAllListeners();
            this.scale.removeAllListeners();
            this.input?.removeAllListeners();

            if (this.physics && this.physics.destroy) {
                this.physics.destroy();
            }

            super.destroy(true, false);

            const gameContainer = document.getElementById('game');
            if (gameContainer) {
                gameContainer.innerHTML = '';
            }

            document.querySelectorAll('canvas').forEach(canvas => {
                canvas.remove();
            });
        } catch (e) {
            console.warn('Game cleanup error:', e);
        }
    }
}

export default Game;
