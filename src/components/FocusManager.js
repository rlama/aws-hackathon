// src/components/FocusManager.js
export default class FocusManager {
    constructor(scene) {
        this.scene = scene;
    }

    initialize() {
        // Focus canvas on game start
        this.scene.game.canvas.focus();

        // Add focus handlers
        this.scene.game.events.on('hidden', () => {
            console.log('Game lost focus');
        });

        this.scene.game.events.on('visible', () => {
            console.log('Game regained focus');
            this.scene.game.canvas.focus();
        });
    }
}
