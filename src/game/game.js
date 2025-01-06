/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */

import { gameConfig, MAX_MOBILE_WIDTH } from '../config/gameConfig';
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
        
    }


    destroy() {
        try {
            this.scene.scenes.forEach(scene => {
                try {
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
