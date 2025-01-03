/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */



export class ViewportManager {
    constructor(game) {
        this.game = game;
        this.safeAreaInsets = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0
        };
        
        this.initialize();
    }

    initialize() {
        // Get safe area insets
        this.updateSafeArea();

        // Listen for resize
        window.addEventListener('resize', this.handleResize.bind(this));

        // Initial adjustment
        this.adjustViewport();
    }

    updateSafeArea() {
        // Get CSS environment variables for safe area
        const computedStyle = window.getComputedStyle(document.documentElement);
        
        this.safeAreaInsets = {
            top: parseInt(computedStyle.getPropertyValue('--sat') || '0', 10),
            bottom: parseInt(computedStyle.getPropertyValue('--sab') || '0', 10),
            left: parseInt(computedStyle.getPropertyValue('--sal') || '0', 10),
            right: parseInt(computedStyle.getPropertyValue('--sar') || '0', 10)
        };
    }

    adjustViewport() {
        const canvas = this.game.canvas;
        const isAndroid = /Android/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isAndroid) {
            // Add padding to bottom for Android nav bar
            canvas.style.paddingBottom = '50px';
        } else if (isIOS) {
            // Handle iOS notch and home indicator
            document.documentElement.style.setProperty('--sat', 'env(safe-area-inset-top)');
            document.documentElement.style.setProperty('--sab', 'env(safe-area-inset-bottom)');
        }

        // Update game size
        const newHeight = window.innerHeight - (this.safeAreaInsets.top + this.safeAreaInsets.bottom);
        this.game.scale.resize(window.innerWidth, newHeight);

        // Emit event for scenes to adjust
        this.game.events.emit('viewportupdate', {
            width: window.innerWidth,
            height: newHeight,
            safeArea: this.safeAreaInsets
        });
    }

    handleResize() {
        this.updateSafeArea();
        this.adjustViewport();
    }

    getSafeArea() {
        return this.safeAreaInsets;
    }

    cleanup() {
        window.removeEventListener('resize', this.handleResize);
    }
}
