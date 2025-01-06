// LongPressHandler.js
export default class LongPressHandler {
    constructor(scene) {
        this.scene = scene;
        this.longPressDelay = 500;
        this.pressStartTime = 0;
        this.isPressed = false;
        this.hasTriggeredLongPress = false;
        this.longPressTimer = null;
        this.enabled = true;

        this.initialize();
    }

    initialize() {
        // Add pointer listeners
        this.scene.input.on('pointerdown', this.onPointerDown, this);
        this.scene.input.on('pointerup', this.onPointerUp, this);
        this.scene.input.on('pointerout', this.onPointerUp, this);
        this.scene.input.on('pointermove', this.onPointerMove, this);

        // Create visual feedback circle
        this.pressIndicator = this.scene.add.circle(0, 0, 30, 0xffffff, 0);
        this.pressIndicator.setVisible(false);
        this.pressIndicator.setDepth(1000); // Ensure it's above other game elements
    }

    onPointerDown = (pointer) => {
        if (!this.enabled) return;

        this.isPressed = true;
        this.hasTriggeredLongPress = false;
        this.pressStartTime = pointer.downTime;

        // Show and position the indicator
        this.pressIndicator.setPosition(pointer.x, pointer.y);
        this.pressIndicator.setVisible(true);
        this.pressIndicator.setAlpha(0);

        // Animate the indicator
        this.scene.tweens.add({
            targets: this.pressIndicator,
            alpha: 0.3,
            scale: 1.5,
            duration: this.longPressDelay,
            onComplete: () => {
                this.pressIndicator.setVisible(false);
            }
        });

        // Create a timer for long press
        this.longPressTimer = this.scene.time.delayedCall(
            this.longPressDelay,
            () => {
                if (this.isPressed && !this.hasTriggeredLongPress) {
                    this.hasTriggeredLongPress = true;
                    this.handleLongPress(pointer);
                }
            },
            [],
            this
        );
    }

    onPointerUp = () => {
        if (!this.enabled) return;

        // Clear the timer if it exists
        if (this.longPressTimer) {
            this.longPressTimer.remove();
        }

        // If it wasn't a long press, handle as normal tap
        if (this.isPressed && !this.hasTriggeredLongPress) {
            this.handleTap();
        }

        // Hide the indicator
        this.pressIndicator.setVisible(false);
        this.scene.tweens.killTweensOf(this.pressIndicator);

        // Reset press state
        this.isPressed = false;
        this.pressStartTime = 0;
    }

    onPointerMove = (pointer) => {
        if (!this.enabled) return;

        // Cancel long press if pointer moves too far
        if (this.isPressed && pointer.getDistance() > 10) {
            if (this.longPressTimer) {
                this.longPressTimer.remove();
            }
            this.pressIndicator.setVisible(false);
            this.scene.tweens.killTweensOf(this.pressIndicator);
            this.isPressed = false;
        }
    }

    handleLongPress(pointer) {
        // Pause the game
            this.scene.pauseGame();
            this.scene.scene.launch('PauseScene', {
                parentScene: this.scene,
                isGameScene: true
            });
    }

    handleTap() {
        // Quick tap handling if needed
        // console.log('Quick tap detected');
    }

    enable() {
        this.enabled = true;
    }

    disable() {
        this.enabled = false;
    }

    destroy() {
        // Clean up
        this.scene.input.off('pointerdown', this.onPointerDown);
        this.scene.input.off('pointerup', this.onPointerUp);
        this.scene.input.off('pointerout', this.onPointerUp);
        this.scene.input.off('pointermove', this.onPointerMove);

        if (this.longPressTimer) {
            this.longPressTimer.remove();
        }

        if (this.pressIndicator) {
            this.pressIndicator.destroy();
        }
    }
}
