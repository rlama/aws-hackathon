/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */

import GameStateManager from "./GameStateManager";
import { DEFAULT_DIFFICULTY_SETTINGS } from "../config/gameConfig";

export default class CharacterManager {
    constructor(scene, selectedCharacter) {
        this.gameStateManager = GameStateManager.getInstance();
        this.scene = scene;
        this.characters = {};
        this.characterScale = 0.7;
        this.chadGotStuck = false;
        this.barryGotStuck = false;
        this.selectedCharacter = this.gameStateManager.selectedCharacter || "";
        this.isStartScene = this.scene.scene.key === 'StartScene';
        this.lastUpdateTime = 0;

        this.startSceneScale = 0.8
    }


    createCharacters() {

        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;

        const isMobile = width <= 768;

        // Create all animations
        this.createCharacterAnimations();

        const characterConfigs = {
            startScene: {
                chad: {
                    x: width * (isMobile ? 0.25 : 0.3),
                    y: height * (isMobile ? 0.77 : 0.5),
                    scale: this.startSceneScale
                },
                barry: {
                    x: width * (isMobile ? 0.75 : 0.7),
                    y: height * (isMobile ? 0.77 : 0.5),
                    scale: this.startSceneScale
                }
            },
            gameScene: {
                chad: {
                    x: width * (isMobile ? 0.25 : 0.40),
                    y: height * (isMobile ? 0.77 : 0.83),
                    scale: 0.7
                },
                barry: {
                    x: width * (isMobile ? 0.75 : 0.60),
                    y: height * (isMobile ? 0.77 : 0.83),
                    scale: 0.7
                }
            }
        };

        const sceneConfig = this.isStartScene ?
            characterConfigs.startScene :
            characterConfigs.gameScene;

        // Create characters
        ['chad', 'barry'].forEach(charKey => {
            const charConfig = sceneConfig[charKey];
            const frame = this.scene.textures.getFrame('characters', `${charKey}_idle`);

            this.characters[charKey] = this.scene.add.sprite(
                charConfig.x,
                charConfig.y,
                'characters'
            );

            this.characters[charKey]
                .setFrame(`${charKey}_idle`)
                .setScale(charConfig.scale);

            if (frame) {
                this.characters[charKey].setDisplaySize(
                    frame.width * charConfig.scale,
                    frame.height * charConfig.scale
                );
            }

            // Set depth to ensure visibility
            this.characters[charKey].setDepth(3);
            this.characters[charKey].setVisible(true);

            // Start idle animation
            this.characters[charKey].play(`${charKey}_idle`);
        });

        // Add character labels for game scene
        if (!this.isStartScene) {
            this.addCharacterLabels(isMobile);
        }

        // Add interactive elements for start scene
        if (this.isStartScene) {
            this.addStartSceneInteractivity(sceneConfig);
        }

        return this.characters;
    }


    addCharacterLabels(isMobile) {
        const width = this.scene.scale.width;
        const height = this.scene.scale.height;

        ['chad', 'barry'].forEach(charKey => {
            const xPos = charKey === 'chad' ?
                width * (isMobile ? 0.25 : 0.40) :
                width * (isMobile ? 0.75 : 0.60);

            this.scene.add.text(
                xPos,
                height * (isMobile ? 0.88 : 0.95),
                this.selectedCharacter === charKey ? "You" : "Robot",
                {
                    fontSize: '16px',
                    fill: "#aedbe9",
                    fontFamily: 'Courier'
                }
            ).setOrigin(0.5);
        });
    }

    addStartSceneInteractivity(sceneConfig) {
        const circleRadius = 110;

        ['chad', 'barry'].forEach(charKey => {
            const circle = this.scene.add.circle(
                sceneConfig[charKey].x,
                sceneConfig[charKey].y,
                circleRadius,
                0x333333,
                0.3
            );

            circle.setInteractive({
                useHandCursor: true,
                hitArea: new Phaser.Geom.Circle(circleRadius, circleRadius, circleRadius),
                hitAreaCallback: Phaser.Geom.Circle.Contains
            });

            this.setupCircleInteractivity(circle, charKey);
        });
    }

    setupCircleInteractivity(circle, charKey) {
        circle
            .on('pointerover', () => {
                this.scene.tweens.add({
                    targets: [this.characters[charKey]],
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 200,
                    ease: 'Power2'
                });
            })
            .on('pointerout', () => {
                this.scene.tweens.add({
                    targets: [this.characters[charKey]],
                    scaleX: this.startSceneScale,
                    scaleY: this.startSceneScale,
                    duration: 200,
                    ease: 'Power2'
                });
            })
            .on('pointerdown', () => {
                this.handleCharacterSelect(charKey, [circle, this.characters[charKey]]);
            });

        circle.setDepth(-1);
    }


    handleCharacterSelect(character, elements) {
        if (this.selectedCharacter) return; // Prevent multiple selections
        this.selectedCharacter = character;//=== "chad" ? "barry" : "chad";
        // this.autoPlayingCharacter = character === "chad" ? "barry" : "chad";

        // Play selection animation
        this.scene.tweens.add({
            targets: elements,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 200,
            yoyo: true,
            ease: 'Power2',
            onComplete: () => {
                // Flash effect
                this.scene.cameras.main.flash(500, 255, 255, 255);
                this.gameStateManager.selectedCharacter = character;
                // Transition to game scene
                this.scene.time.delayedCall(500, () => {
                    this.scene.scene.start('GameScene');
                });
            }
        });

        // // Disable other character's interactivity
        const otherCharacter = character === 'chad' ? 'barry' : 'chad';
        // this[`${otherCharacter}Circle`].disableInteractive();

        // Fade out other character
        this.scene.tweens.add({
            targets: this[`${otherCharacter}Container`],
            alpha: 0.5,
            duration: 200
        });
    }


    addTint() {
        const characterWithTint = this.selectedCharacter === "chad" ? "barry" : "chad";
        const activeCharacter = this.characters[characterWithTint];
        const color = "#6aaa08";
        const opacity = 0.95;

        // Convert hex color string to number if using string format
        const colorNum = color.startsWith('#') ? parseInt(color.slice(1), 16) : color;
        activeCharacter.setTint(colorNum);
        activeCharacter.setAlpha(opacity);

    }

    setCharacterControlsKeyInputs() {
        const otherCharacterName = this.selectedCharacter === "chad" ? "barry" : "chad";
        const activeCharacter = this.characters[this.selectedCharacter];
        const otherCharacter = this.characters[otherCharacterName];

        // Keyboard controls
        this.scene.input.keyboard.on('keydown-M', () => {
            if (!this.gameStateManager.isGamePaused) {
                this.handleCharacterAction(activeCharacter, otherCharacter, otherCharacterName);
            }
        });

        // Add tap/touch control
        this.scene.input.on('pointerdown', (pointer) => {
            if (!this.gameStateManager.isGamePaused) {
                this.handleCharacterAction(activeCharacter, otherCharacter, otherCharacterName);
            }
        });
    }

    getSelectedCharacter() {
        return this.selectedCharacter;
    }

    // Separate the action logic into its own method to avoid code duplication
    handleCharacterAction(activeCharacter, otherCharacter, otherCharacterName) {

        const charGotStuck = this.selectedCharacter === "chad" ? this.chadGotStuck : this.barryGotStuck;

        if (!charGotStuck) {
            activeCharacter.play(this.selectedCharacter + '_mouth_open');
            if (otherCharacter.anims.currentAnim.key !== otherCharacterName + "_not_happy") {
                otherCharacter.play(otherCharacterName + '_idle');
            }
            //  activeCharacter.play(this.selectedCharacter + '_mouth_open');
        }
    }

    // Optional: Add method to remove input listeners when needed
    removeInputListeners() {
        this.scene.input.keyboard.off('keydown-M');
        this.scene.input.off('pointerdown');
    }


    createCharacterAnimations() {
        // Chad animations

        // Five coin animation
        this.scene.anims.create({
            key: 'chad_still',
            frames: [{ key: 'characters', frame: 'frame_0' }],
            frameRate: 1,
            repeat: 0
        });


        this.scene.anims.create({
            key: 'chad_idle',
            frames: this.scene.anims.generateFrameNames('characters', {
                prefix: 'frame_',
                start: 0,
                end: 15
            }),
            frameRate: 30,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'chad_dead',
            frames: this.scene.anims.generateFrameNames('characters', {
                prefix: 'frame_',
                start: 29,
                end: 34
            }),
            frameRate: 30,
            repeat: 12
        });


        this.scene.anims.create({
            key: 'chad_mouth_open',
            frames: this.scene.anims.generateFrameNames('characters', {
                prefix: 'frame_',
                start: 35,
                end: 51
            }),
            frameRate: 30,
            repeat: -1
        });


        this.scene.anims.create({
            key: 'chad_eating',
            frames: this.scene.anims.generateFrameNames('characters', {
                prefix: 'frame_',
                start: 16,
                end: 28
            }),
            frameRate: 30,
            repeat: 1
        });



        this.scene.anims.create({
            key: 'chad_not_happy',
            frames: this.scene.anims.generateFrameNames('characters', {
                prefix: 'frame_',
                start: 29,
                end: 34
            }),
            frameRate: 30,
            repeat: 12
        });



        // Barry animations

        this.scene.anims.create({
            key: 'barry_still',
            frames: [{ key: 'characters', frame: 'frame_75' }],
            frameRate: 1,
            repeat: 0
        });


        this.scene.anims.create({
            key: 'barry_idle',
            frames: this.scene.anims.generateFrameNames('characters', {
                prefix: 'frame_',
                start: 75,
                end: 86
            }),
            frameRate: 20,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'barry_dead',
            frames: this.scene.anims.generateFrameNames('characters', {
                prefix: 'frame_',
                start: 68,
                end: 74
            }),
            frameRate: 30,
            repeat: 6
        });

        this.scene.anims.create({
            key: 'barry_mouth_open',
            frames: this.scene.anims.generateFrameNames('characters', {
                prefix: 'frame_',
                start: 87,
                end: 93
            }),
            frameRate: 30,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'barry_eating',
            frames: this.scene.anims.generateFrameNames('characters', {
                prefix: 'frame_',
                start: 56,
                end: 67
            }),
            frameRate: 30,
            repeat: 1
        });


        this.scene.anims.create({
            key: 'barry_not_happy',
            frames: this.scene.anims.generateFrameNames('characters', {
                prefix: 'frame_',
                start: 68,
                end: 74
            }),
            frameRate: 30,
            repeat: 12
        });

        // this.characters.chad.play("chad_idle")
        // this.characters.barry.play("barry_idle")

    }


    setStuckState(character, isStuck) {
        if (character === 'chad') {
            this.chadGotStuck = isStuck;
        } else if (character === 'barry') {
            this.barryGotStuck = isStuck;
        }
    }

    isCharacterStuck(character) {
        return character === 'chad' ? this.chadGotStuck : this.barryGotStuck;
    }


    // Auto playing logic for Robot
    updateAutoPlaying() {
        // Get all extras from the extras group
        const extras = this.scene.extraManager.extras.getChildren();

        // Get the active character
        const autoPlayingCharacterName = this.selectedCharacter === "chad" ? "barry" : "chad";
        const activeCharacter = this.characters[autoPlayingCharacterName];

        if (!activeCharacter) return;

        const currentTime = this.scene.time.now;
        const difficulty = DEFAULT_DIFFICULTY_SETTINGS[this.gameStateManager.difficultyLevel];

        // Check if enough time has passed since last update
        if (currentTime - this.lastUpdateTime < difficulty.reactionDelay) return;
        this.lastUpdateTime = currentTime;

        // Find the closest extra to the active character
        let closestExtra = null;
        let closestDistance = Infinity;

        extras.forEach(extra => {
            const distance = Phaser.Math.Distance.Between(
                activeCharacter.x,
                activeCharacter.y,
                extra.x,
                extra.y
            );

            if (distance < closestDistance) {
                closestDistance = distance;
                closestExtra = extra;
            }
        });

        // Determine if the robot should intentionally miss based on difficulty
        const shouldMiss = Math.random() < difficulty.missRate;

        if (shouldMiss) {
            // Sometimes move away from the extra or do nothing
            if (closestExtra && closestDistance <= 130) {

                if (!this.isCharacterStuck(autoPlayingCharacterName)) {
                    if (Math.random() < 0.5) {
                        // Move in opposite direction
                        if (closestExtra.y > activeCharacter.y) {
                            activeCharacter.play(`${autoPlayingCharacterName}_idle`);
                        } else {

                            activeCharacter.play(`${autoPlayingCharacterName}_mouth_open`);
                        }
                    } else {
                        // Do nothing
                        // activeCharacter.play(`${autoPlayingCharacterName}_idle`);
                    }
                }

            }
        } else {
            // Original logic for optimal play
            if (closestExtra && closestDistance <= 130) {
                const extraType = closestExtra.getData('type');
                // const condition = Phaser.Math.RND.pick(this.smartIndexArray);

                if (extraType !== 'Onion') {
                    this.openMouth(activeCharacter, autoPlayingCharacterName);
                }
            }
        }
    }



    openMouth(activeCharacter, autoPlayingCharacterName) {
        activeCharacter.play(`${autoPlayingCharacterName}_mouth_open`);
        activeCharacter.mouthOpen = true;
    }

    closeMouth(activeCharacter, autoPlayingCharacterName) {
        activeCharacter.play(`${autoPlayingCharacterName}_idle`);
        activeCharacter.mouthOpen = false;
    }


    // Add this method to check mouth state
    isMouthOpen() {
        return this.characters.chad.mouthOpen;
    }


    getCharacters() {
        return this.characters;
    }

    // Add any other character-related methods here
    setupCharacterPhysics() {
        Object.values(this.characters).forEach(character => {
            this.scene.physics.add.existing(character);
            character.body.setCollideWorldBounds(true);
        });
    }

    stopCharacterAnimations() {
        Object.values(this.characters).forEach(character => {
            character.anims.stop();
        });
    }

    resumeCharacterAnimations() {
        if (!this.chadGotStuck) {
            this.characters.chad.play('chad_idle', true);
        }
        if (!this.barryGotStuck) {
            this.characters.barry.play('barry_idle', true);
        }
    }

    resetCharacters() {
        this.scene = scene;
        this.characters = {};
        this.characterScale = 0.7;
        this.chadGotStuck = false;
        this.barryGotStuck = false;
        this.gameStateManager.selectedCharacter = ""; // Store selected character
        this.isStartScene = this.scene.scene.key === 'StartScene';
        this.lastUpdateTime = 0;
    }

    // Clean up when scene changes
    destroy() {

    }
}
