import { PRIMARY_TEXT_COLOR } from "../config/gameConfig";

export default class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CharacterSelectScene' });
        this.selectedCharacter = null;
        this.autoPlayingCharacter = null;
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.gameWidth = this.cameras.main.width;
        this.gameHeight = this.cameras.main.height;
        // Check device width
        const backgroundImage = this.gameWidth <= 700 ? 'backgroundMobile' : 'backgroundDesktop';

        // Add background first before any other game objects
        if (this.textures.exists(backgroundImage)) {
            const background = this.add.image(0, 0, backgroundImage);
            background.setOrigin(0, 0);
            background.setDepth(-1);  // Ensure it's behind everything

            // Scale background to fit the game width and height
            background.displayWidth = this.gameWidth;
            background.displayHeight = this.gameHeight;
        }

        // Add semi-transparent overlay
        this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);

        // Add title text
        this.add.text(width / 2, height * 0.2, 'Select Your Character', {
            fontSize: '48px',
            fill: PRIMARY_TEXT_COLOR,
            fontFamily: 'Impact'
        }).setOrigin(0.5);

        // Debug: Log available frames in the texture atlas
        // console.log('Available frames:', this.textures.get('characters').getFrameNames());


        // Create character containers with correct frames
        this.createCharacterOption('chad', width * 0.3, height * 0.5, 'frame_0');
        this.createCharacterOption('barry', width * 0.7, height * 0.5, 'frame_75');

        // Add character names
        this.add.text(width * 0.3, height * 0.7, 'CHAD', {
            fontSize: '32px',
            fill: PRIMARY_TEXT_COLOR,
            fontFamily: 'Impact'
        }).setOrigin(0.5);

        this.add.text(width * 0.7, height * 0.7, 'BARRY', {
            fontSize: '32px',
            fill: PRIMARY_TEXT_COLOR,
            fontFamily: 'Impact'
        }).setOrigin(0.5);

        // Listen for resize events
        this.scale.on('resize', this.handleResize, this);
    }




    createCharacterOption(character, x, y, frame) {
        const circleRadius = 100;

        // Create circular background
        const circle = this.add.circle(x, y, circleRadius, 0x333333);

        // Create character sprite with correct frame
        const sprite = this.add.sprite(x, y, 'characters', frame).setScale(0.8);

        // Create container for better organization
        const container = this.add.container(0, 0, [circle, sprite]);

        // Make interactive
        circle.setInteractive({
            useHandCursor: true,
            hitArea: new Phaser.Geom.Circle(100, 100, circleRadius),
            hitAreaCallback: Phaser.Geom.Circle.Contains
        });

        // Hover effects
        circle.on('pointerover', () => {
            this.tweens.add({
                targets: [circle, sprite],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200,
                ease: 'Power2'
            });
        });

        circle.on('pointerout', () => {
            this.tweens.add({
                targets: circle,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
                ease: 'Power2'
            });

            this.tweens.add({
                targets: sprite,
                scaleX: 0.8,
                scaleY: 0.8,
                duration: 200,
                ease: 'Power2'
            });
        });

        // Click handler
        circle.on('pointerdown', () => {
            this.handleCharacterSelect(character, [circle, sprite]);
        });

        // Store references
        this[`${character}Container`] = container;
        this[`${character}Circle`] = circle;
        this[`${character}Sprite`] = sprite;
    }

    handleCharacterSelect(character, elements) {
        if (this.selectedCharacter) return; // Prevent multiple selections
        this.selectedCharacter = character ;//=== "chad" ? "barry" : "chad";
        // this.autoPlayingCharacter = character === "chad" ? "barry" : "chad";

        // Play selection animation
        this.tweens.add({
            targets: elements,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 200,
            yoyo: true,
            ease: 'Power2',
            onComplete: () => {
                // Flash effect
                this.cameras.main.flash(500, 255, 255, 255);

                // Transition to game scene
                this.time.delayedCall(500, () => {
                    this.scene.start('GameScene', { selectedCharacter: character, autoPlayingCharacter: this.autoPlayingCharacter });
                });
            }
        });

        // Disable other character's interactivity
        const otherCharacter = character === 'chad' ? 'barry' : 'chad';
        this[`${otherCharacter}Circle`].disableInteractive();

        // Fade out other character
        this.tweens.add({
            targets: this[`${otherCharacter}Container`],
            alpha: 0.5,
            duration: 200
        });
    }

    handleResize(gameSize) {
        const width = gameSize.width;
        const height = gameSize.height;

        // Update positions
        if (this.chadContainer) {
            this.chadContainer.setPosition(width * 0.3, height * 0.5);
        }
        if (this.barryContainer) {
            this.barryContainer.setPosition(width * 0.7, height * 0.5);
        }
    }
}
