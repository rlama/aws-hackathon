/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */


import { GAME_FRAME_RATE } from "../config/gameConfig";
import { checkIfMobile } from "../utils/helpers";

export class OrientationManager {
    static instance = null;

    constructor(game) {
        if (OrientationManager.instance) {
            return OrientationManager.instance;
        }

        this.game = game;
        this.overlay = null;
        this.isMobile = checkIfMobile();
        OrientationManager.instance = this;

        // Bind methods to maintain context
        this.checkOrientation = this.checkOrientation.bind(this);
        this.handleOrientationChange = this.handleOrientationChange.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    static getInstance(game = null) {
        if (!OrientationManager.instance && game) {
            OrientationManager.instance = new OrientationManager(game);
        }
        return OrientationManager.instance;
    }



    initialize() {
        // Store initial width
        this.lastWidth = window.innerWidth;

        // Create overlay immediately
        this.createOrientationOverlay();

        // Initial check
        this.checkOrientation();

        // Add event listeners
        window.addEventListener('orientationchange', this.checkOrientation);
        window.addEventListener('resize', this.handleResize);
    }

    checkOrientation() {
        // Get screen orientation
        const isLandscape = window.innerWidth > window.innerHeight;

        // Show overlay only if mobile AND landscape
        if (this.isMobile && isLandscape) {
            this.showOrientationOverlay();
        } else {
            this.hideOrientationOverlay();
            // Emit event for other parts of the game
        }
        this.game.events.emit('orientationupdate', isLandscape);
    }

    handleOrientationChange(orientation) {
        this.checkOrientation();
    }

    handleResize() {
        // Clear any existing timeout
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        // Debounce the resize
        this.resizeTimeout = setTimeout(() => {
            const currentWidth = window.innerWidth;

            // Only trigger if width changed
            if (this.lastWidth !== currentWidth) {
                this.lastWidth = currentWidth;
                this.game.events.emit('widthchange', { width: currentWidth, height: window.innerHeight });
            }
        }, 250);

        // Check orientation after resize
        this.checkOrientation();
    }

    createOrientationOverlay() {
        if (!this.overlay) {
            this.overlay = document.createElement('div');
            this.overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                transition: opacity 0.3s ease-in-out;
            `;

            const messageContainer = document.createElement('div');
            messageContainer.style.cssText = `
                text-align: center;
                color: white;
                padding: 20px;
            `;

            // Add rotate phone icon
            const rotateIcon = document.createElement('div');
            rotateIcon.innerHTML = '📱';
            rotateIcon.style.cssText = `
                font-size: 64px;
                margin-bottom: 20px;
                transform: rotate(0deg);
                animation: rotate 1.5s ease-in-out infinite;
            `;

            // Add rotation animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes rotate {
                    0% { transform: rotate(0deg); }
                    50% { transform: rotate(-90deg); }
                    100% { transform: rotate(0deg); }
                }
            `;
            document.head.appendChild(style);

            // Add message text
            const message = document.createElement('div');
            message.style.cssText = `
                font-size: 24px;
                font-family: Arial, sans-serif;
                margin-top: 20px;
            `;
            message.textContent = 'Please rotate your device to portrait mode';

            messageContainer.appendChild(rotateIcon);
            messageContainer.appendChild(message);
            this.overlay.appendChild(messageContainer);
            document.body.appendChild(this.overlay);
        }
    }

    showOrientationOverlay() {
        if (this.overlay && this.overlay.style.display !== 'flex') {
            this.overlay.style.display = 'flex';
            // Force a reflow
            void this.overlay.offsetWidth;
            this.overlay.style.opacity = '1';

            // Pause the game if it's running
            if (this.game.scene.scenes.length > 0) {
                this.game.scene.scenes.forEach(scene => {
                    if (scene.scene.isActive()) {
                        scene.scene.pause();
                    }
                });
            }
        }
    }

    hideOrientationOverlay() {
        if (this.overlay && this.overlay.style.display !== 'none') {
            this.overlay.style.opacity = '0';
            setTimeout(() => {
                this.overlay.style.display = 'none';
            }, 300);

            // Resume the game
            if (this.game.scene.scenes.length > 0) {
                this.game.scene.scenes.forEach(scene => {
                    if (scene.scene.isPaused()) {
                        scene.scene.resume();
                    }
                });
            }
        }
    }

    cleanup() {
        // Remove event listeners
        window.removeEventListener('orientationchange', this.checkOrientation);
        window.removeEventListener('resize', this.checkOrientation);

        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
    }
}