import { MAX_MOBILE_WIDTH } from "../config/gameConfig";

export class BackgroundManager {
    constructor(scene) {
        this.scene = scene;
        this.background = null;
        this.currentType = null;
        this.gameWidth = scene.cameras.main.width;
        this.gameHeight = scene.cameras.main.height;
    }


    addBackground({ isGameScene = false, addOverlay = false, type = 'default', header = false, overlayOnly = false }) {
        // Remove existing background if any
        if (this.background) {
            this.background.destroy();
        }

        if(!overlayOnly){
            // Determine background image based on screen width and type
            let backgroundKey = this.getBackgroundKey(type);

            // Create and set up background
            this.background = this.scene.add.image(0, 0, backgroundKey);
            this.background.setOrigin(0, 0);
            this.background.setDepth(-1);

            // Scale background to fit screen
            this.scaleBackground();
        }

        // Add overlay if requested
        if (addOverlay) {
            this.addDarkOverlay();
        }

        if(header) {
            this.addHeaderBar();
        }

        this.currentType = type;
    }


    // Get appropriate background key based on screen width and type
    getBackgroundKey(type) {
        const isMobile = this.gameWidth <= MAX_MOBILE_WIDTH;

        const backgroundKeys = {
            default: isMobile ? 'backgroundMobile' : 'backgroundDesktop',
            finish: isMobile ? 'backgroundFinishMobile' : 'backgroundFinishDesktop'
        };

        return backgroundKeys[type] || backgroundKeys.default;
    }

    /**
     * Scale background to fit screen
     */
    scaleBackground() {
        if (this.background) {
            this.background.displayWidth = this.gameWidth;
            this.background.displayHeight = this.gameHeight;
        }
    }

    addHeaderBar() {
            // Create the main score box
            const titleBg = this.scene.add.rectangle(
                0,           // x position (left aligned)
                0,           // y position (top aligned)
                this.gameWidth,   // width matches game width
                140,   // height of 60px
                0x28383e,   // black color
                1        // 70% opacity
            );

            titleBg.setOrigin(0, 0); // Align to top-left
            titleBg.setDepth(1); // Align to top-left
    }

    /**
     * Add dark overlay
     */
    addDarkOverlay() {
        this.overlay = this.scene.add.rectangle(
            0,
            0,
            this.gameWidth,
            this.gameHeight,
            0x000000,
            0.7
        ).setOrigin(0);
        this.overlay.setDepth(-0.5);
    }

    /**
     * Update background on resize
     * @param {number} width - New width
     * @param {number} height - New height
     */
    resize(width, height) {
        this.gameWidth = width;
        this.gameHeight = height;

        // Check if we need to switch background type
        const newBackgroundKey = this.getBackgroundKey(this.currentType);
        if (this.background.texture.key !== newBackgroundKey) {
            this.background.setTexture(newBackgroundKey);
        }

        // Rescale background
        this.scaleBackground();

        // Update overlay if it exists
        if (this.overlay) {
            this.overlay.setSize(width, height);
        }

    }

    /**
     * Clean up resources
     */
    destroy() {
        if (this.background) {
            this.background.destroy();
        }
        if (this.overlay) {
            this.overlay.destroy();
        }
    }
}
