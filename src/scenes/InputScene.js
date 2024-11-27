// Create a separate scene for handling inputs
export default class InputScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InputScene' });
    }
    create(data) {
        this.parentScene = data.parentScene;
        
        // Add space bar listener that will always work
        this.input.keyboard.on('keydown-SPACE', () => {
            console.log('Space bar pressed');
            if (this.parentScene.buttonManager) {
                this.parentScene.buttonManager.togglePlayPauseState();
            }
        });
    }
}