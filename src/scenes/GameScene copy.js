import Phaser from 'phaser';
import { AtlasDebugger } from '../utils/DebugUtils';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.characters = {};
        this.gameSpeed = 3;
        this.extraTypes = ['onion', 'dragon_fly', 'onion', 'bird_fly', 'onion', 'gold_box', 'five_coin', 'onion', 'fruit', 'onion',]; // Animation keys from PreloadScene
        // Add scale properties
        this.characterScale = 0.6; // Adjust this value as needed (0.5 = 50% of original size)
        this.extraScale = 0.4;     // Adjust this value as needed (0.3 = 30% of original size)

        this.chadGotStuck = false
        this.barryGotStuck = false
        this.isGamePaused = false;

    }

    create() {

        // Initial setup
        this.spawnDelay = 2000;      // Start with 2000ms (2 seconds)
        this.minDelay = 500;         // Minimum delay (half second)
        this.delayDecrement = 100;   // Decrease by 100ms each time
        this.spawnTimer = null;      // Store timer reference
        this.chadGotStuck = false
        this.barryGotStuck = false

        // Create the debug utility
        const debugConfig = {
            atlasKeys: ['characters', 'extras', 'background'],
            frameWidth: 150,
            frameHeight: 150,
            padding: 10
        };

        this.atlasDebugger = new AtlasDebugger(this, debugConfig);
        this.atlasDebugger.create();

        this.createCharacters();
        this.setupInputs();
        this.startSpawning();
        this.setUpVelocityIncrement();
        this.addPlayPauseBtn()
        this.handleFocus()

        // Create a timer to decrease delay
        this.time.addEvent({
            delay: 5000,           // Adjust delay every 5 seconds
            callback: this.decreaseDelay,
            callbackScope: this,
            loop: true
        });

    }

    addPlayPauseBtn() {

        // Calculate actual pixel positions
        const gameWidth = this.scale.width;  // Gets actual width in pixels
        const gameHeight = this.scale.height; // Gets actual height in pixels

        // Add pause button
        const pauseButton = this.add.image(
            gameWidth - 40, // Position from right
            40, // Position from top
            'pause-button' // Your pause button sprite key
        );

         // Add pause button
         const playButton = this.add.image(
            gameWidth - 70, // Position from right
            40, // Position from top
            'play-button' // Your pause button sprite key
        );

        
        pauseButton.setInteractive()
        pauseButton.setScale(0.1);
        
        playButton.setInteractive()
        playButton.setScale(0.1);
        
  
        let isPlaying = true;

        const togglePlayPause = () => {
            if (isPlaying) {
                this.pauseGame(); // Pause game logic
            } else {
                this.resumeGame(); // Resume game logic
            }

            // Toggle play state
            isPlaying = !isPlaying;
        };
    
        playButton.on('pointerdown', () => { this.resumeGame()} );
        pauseButton.on('pointerdown', () =>{ this.pauseGame()});

    }


    pauseGame() {
        this.game.isPaused = true;
        this.isGamePaused = true;
        // Pause physics
        this.physics.pause();
        // Stop all current animations
        this.anims.pauseAll();
    }

    resumeGame() {
        this.game.isPaused = false;
        this.isGamePaused = false;
        // Resume physics
        this.physics.resume();

        // Resume all animations
        this.anims.resumeAll();
    }


    handleFocus() {

        // Focus canvas on game start
        this.game.canvas.focus();

        // Add focus handlers
        this.game.events.on('hidden', () => {
            // Game lost focus/visibility
            console.log('Game lost focus');
        });

        this.game.events.on('visible', () => {
            // Game regained focus/visibility
            console.log('Game regained focus');
            this.game.canvas.focus();
        });

        // Focus canvas when clicking anywhere in the game
    }


    decreaseDelay() {
        // Only decrease if above minimum delay
        if (this.spawnDelay > this.minDelay) {
            this.spawnDelay = Math.max(this.spawnDelay - this.delayDecrement, this.minDelay);

            // Destroy existing timer
            if (this.spawnTimer) {
                this.spawnTimer.destroy();
            }

            // Create new timer with updated delay
            this.spawnTimer = this.time.addEvent({
                delay: this.spawnDelay,
                callback: this.spawnExtra,
                callbackScope: this,
                loop: true
            });

            console.log('New spawn delay:', this.spawnDelay);
        }
    }


    setUpVelocityIncrement() {
        // Initial velocity
        this.extraVelocity = 100;

        // Amount to increase velocity by
        this.velocityIncrement = 10;

        // How often to increase velocity (in milliseconds)
        this.velocityIncreaseInterval = 5000; // every 5 seconds

        // Maximum velocity (optional)
        this.maxVelocity = 500;

        // Create a timer event to increase velocity
        this.time.addEvent({
            delay: this.velocityIncreaseInterval,
            callback: this.increaseVelocity,
            callbackScope: this,
            loop: true
        });
    }


    getCharacterPositions() {
        const width = this.scale.width;
        const height = this.scale.height;
        const isMobile = width <= 768;

        return {
            chad: {
                x: width * (isMobile ? 0.25 : 0.40),
                y: height * 0.8
            },
            barry: {
                x: width * (isMobile ? 0.75 : 0.60),
                y: height * 0.8
            }
        };
    }

    updateCharacterPositions() {
        if (this.chad && this.barry) {
            const positions = this.getCharacterPositions();
            this.chad.setPosition(positions.chad.x, positions.chad.y);
            this.barry.setPosition(positions.barry.x, positions.barry.y);
        }
    }

    debugAtlasFrames() {
        const debugContainer = this.add.container(0, 0);
        debugContainer.setVisible(false);

        const atlasKeys = ['characters', 'extras'];
        let totalY = 10;

        // Increased spacing for larger images
        const spacing = {
            frameWidth: 300,    // Increased from 120
            frameHeight: 400,   // Increased from 120
            padding: 20
        };

        atlasKeys.forEach(atlasKey => {
            // Add atlas title
            const titleText = this.add.text(10, totalY, `Atlas: ${atlasKey}`, {
                fontSize: '16px',
                backgroundColor: '#000',
                padding: { x: 5, y: 5 }
            });
            debugContainer.add(titleText);
            totalY += 40;

            // Get frames
            const frames = this.textures.get(atlasKey).getFrameNames();
            let x = spacing.padding;
            let y = totalY;

            frames.forEach((frameName, index) => {
                // Frame container
                const frameContainer = this.add.container(x, y);
                debugContainer.add(frameContainer);

                // Sprite
                const sprite = this.add.sprite(0, 0, atlasKey, frameName);

                // Calculate scale to fit within frame space
                const frame = this.textures.get(atlasKey).frames[frameName];
                const scaleX = (spacing.frameWidth - spacing.padding * 2) / frame.width;
                const scaleY = (spacing.frameHeight - spacing.padding * 2 - 60) / frame.height;
                const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down

                sprite.setScale(scale);
                frameContainer.add(sprite);

                // Frame info
                const info = [
                    `Name: ${frameName}`,
                    `Size: ${frame.width}x${frame.height}`,
                    `Scale: ${scale.toFixed(2)}`,
                    `Position: ${frame.x},${frame.y}`
                ];

                // Add info text
                const text = this.add.text(0, sprite.height * scale + 10, info, {
                    fontSize: '12px',
                    backgroundColor: '#000',
                    padding: { x: 2, y: 2 },
                    align: 'center'
                }).setOrigin(0.5, 0);
                frameContainer.add(text);

                // Grid layout with increased spacing
                x += spacing.frameWidth;
                if (x > this.game.config.width - spacing.frameWidth) {
                    x = spacing.padding;
                    y += spacing.frameHeight;
                }
            });

            totalY = y + spacing.frameHeight;
        });

        // Add controls info
        const controls = [
            'Debug Controls:',
            'D: Toggle debug view',
            'Left/Right: Navigate frames',
            'Space: Play animation'
        ];

        const controlsText = this.add.text(10, totalY, controls, {
            fontSize: '14px',
            backgroundColor: '#000',
            padding: { x: 5, y: 5 }
        });
        debugContainer.add(controlsText);

        // Add scrolling support for tall content
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            if (debugContainer.visible) {
                debugContainer.y -= deltaY;
                // Add bounds to prevent scrolling too far
                debugContainer.y = Phaser.Math.Clamp(
                    debugContainer.y,
                    -(totalY - this.game.config.height + 100),
                    0
                );
            }
        });

        // Toggle with D key
        this.input.keyboard.on('keydown-D', () => {
            debugContainer.setVisible(!debugContainer.visible);
            // Reset position when toggling
            debugContainer.y = 0;
        });

        // Add background for better visibility
        const background = this.add.rectangle(
            0, 0,
            this.game.config.width,
            this.game.config.height,
            0x000000,
            0.8
        );
        background.setOrigin(0);
        debugContainer.add(background);
        background.setDepth(-1);
    }


    createCharacters() {

        const positions = this.getCharacterPositions();

        this.chad = this.add.sprite(positions.chad.x, positions.chad.y, 'characters', 'frame_0');
        this.barry = this.add.sprite(positions.barry.x, positions.barry.y, 'characters', 'frame_70');


        // Scale down characters
        this.chad.setScale(this.characterScale);
        this.barry.setScale(this.characterScale);


        // Play idle animations
        this.chad.play('chad_idle');
        this.barry.play('barry_idle');

        // Make interactive if needed
        this.chad.setInteractive();
        this.barry.setInteractive();

        // Add physics to characters
        this.physics.add.existing(this.chad);
        this.physics.add.existing(this.barry);

        // Scale physics bodies to match sprite scale
        this.chad.body.setSize(
            this.chad.width * this.characterScale,
            this.chad.height * this.characterScale
        );
        this.barry.body.setSize(
            this.barry.width * this.characterScale,
            this.barry.height * this.characterScale
        );
    }

    setupInputs() {

        // Chad controls
        this.input.keyboard.on('keydown-O', () => {
            // console.log("this.chadGotStuck: ",this.chadGotStuck)
            if (!this.chadGotStuck) {
                this.chad.play('chad_mouth_open');
                if (this.barry.anims.currentAnim.key !== "barry_not_happy") {
                    this.barry.play('barry_idle');
                }
            }
        });

        // Barry controls
        this.input.keyboard.on('keydown-P', () => {
            console.log(this.barry)
            // console.log("this.barryGotStuck: ",this.barryGotStuck)
            if (!this.barryGotStuck) {
                this.barry.play('barry_mouth_open');
                if (this.chad.anims.currentAnim.key !== "chad_not_happy") {
                    this.chad.play('chad_idle');
                }
            }
        });
    }


    startSpawning() {
        // Initial spawn timer
        this.spawnTimer = this.time.addEvent({
            delay: this.spawnDelay,
            callback: this.spawnExtra,
            callbackScope: this,
            loop: true
        });
    }


    increaseVelocity() {
        // Only increase if below max velocity
        if (this.extraVelocity < this.maxVelocity) {
            this.extraVelocity += this.velocityIncrement;
        }
    }


    spawnExtra() {
        // Random position at top of screen
        const x = Phaser.Math.RND.pick([this.chad.x, this.barry.x]);

        // Random extra type
        const randomType = Phaser.Math.RND.pick(this.extraTypes);

        // Create the extra
        const extra = this.add.sprite(x, -50, 'extras', 'frame_0');

        // Store the type data
        extra.setData('type', randomType);

        // Scale down the extra sprite
        extra.setScale(this.extraScale);  // Add this line to scale the sprite

        // Add physics
        this.physics.add.existing(extra);

        // Scale physics body to match sprite scale
        extra.body.setSize(
            extra.width * this.extraScale,
            extra.height * this.extraScale
        );

        // Play animation based on type
        extra.play(randomType);

        // Set velocity
        extra.body.setVelocityY(this.extraVelocity);

        // Check type and add rotation for specific types
        const extraType = extra.getData('type');
        if (extraType === 'gold_box' || extraType === 'five_coin' || extraType === 'onion') {
            this.tweens.add({
                targets: extra,
                angle: 360,  // Full rotation
                duration: 2000, // 2 seconds per rotation
                repeat: -1,  // Infinite repeats
                ease: 'Linear'
            });
        }

        // Add collision detection
        this.physics.add.overlap(
            extra,
            [this.chad, this.barry],
            this.handleCollision,
            (extra, character) => {
                const extraCenter = extra.y;
                const characterCenter = character.y;
                return extraCenter < characterCenter;
            },
            this
        );

        // Destroy when out of bounds
        extra.checkWorldBounds = true;
        extra.body.onWorldBounds = true;

        this.physics.world.on('worldbounds', (body) => {
            if (body.gameObject === extra) {
                extra.destroy();
            }
        });
    }

    handleCharacterOnion(character, isChad) {
        const characterObj = isChad ? this.chad : this.barry;
        const stateProperty = isChad ? 'chadGotStuck' : 'barryGotStuck';
        const notHappyAnim = isChad ? 'chad_not_happy' : 'barry_not_happy';
        const idleAnim = isChad ? 'chad_idle' : 'barry_idle';

        // Set stuck state
        this[stateProperty] = true;
        console.log(`${isChad ? 'Chad' : 'Barry'} got stuck: ${this[stateProperty]}`);

        // Remove only animation complete listeners
        characterObj.removeListener('animationcomplete');  // Changed from removeAllListeners

        // Play not happy animation
        characterObj.play(notHappyAnim);

        setTimeout(() => {
            this[stateProperty] = false;
            characterObj.play(idleAnim);
        }, 2000)

        // Add new listener for not happy animation completion
        // characterObj.once('animationcomplete', (animation) => {
        //     if (animation.key === notHappyAnim) {
        //         console.log(`${isChad ? 'Chad' : 'Barry'} not happy animation complete`);
        //         this[stateProperty] = false;
        //         console.log(`${isChad ? 'Chad' : 'Barry'} got unstuck: ${this[stateProperty]}`);
        //         characterObj.play(idleAnim);
        //     }
        // });
    }

    handleCharacterCollision(character, extraType) {
        const isChad = character === this.chad;
        const characterObj = isChad ? this.chad : this.barry;
        const eatingAnim = isChad ? 'chad_eating' : 'barry_eating';
        const idleAnim = isChad ? 'chad_idle' : 'barry_idle';

        // Remove only animation complete listeners
        characterObj.removeListener('animationcomplete');  // Changed from removeAllListeners

        // Play eating animation
        characterObj.play(eatingAnim);


        // Handle eating animation completion
        characterObj.once('animationcomplete', (animation) => {
            if (animation.key === eatingAnim) {
                if (extraType === 'onion') {
                    this.handleCharacterOnion(character, isChad);
                } else {
                    characterObj.play(idleAnim);
                }
            }
        });
    }

    handleCollision(extra, character) {
        if (character.anims.currentAnim.key.includes('mouth_open')) {
            const extraType = extra.getData('type');
            this.handleCharacterCollision(character, extraType);
            extra.destroy();
        }
    }

    handleScore(character) {
        // Initialize scores if they don't exist
        if (!this.scores) {
            this.scores = {
                chad: 0,
                barry: 0
            };

            // Add score text
            this.scoreText = {
                chad: this.add.text(50, 50, 'Chad: 0', { fontSize: '32px', fill: '#fff' }),
                barry: this.add.text(550, 50, 'Barry: 0', { fontSize: '32px', fill: '#fff' })
            };
        }

        // Update score based on character
        if (character === this.chad) {
            this.scores.chad++;
            this.scoreText.chad.setText(`Chad: ${this.scores.chad}`);
        } else if (character === this.barry) {
            this.scores.barry++;
            this.scoreText.barry.setText(`Barry: ${this.scores.barry}`);
        }
    }


    update() {

        // Skip updates if game is paused
        if (this.isGamePaused) {
            return;
        }

        // Get all active extras
        const extras = this.children.list.filter(child =>
            child.type === 'Sprite' &&
            this.extraTypes.some(type => child.anims.currentAnim?.key === type)
        );


        // Update extras
        extras.forEach(extra => {
            // Remove if off screen
            if (extra.y > this.game.config.height + 50) {
                extra.destroy();
            }
        });
    }
}
