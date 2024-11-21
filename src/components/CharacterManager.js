// src/components/CharacterManager.js
export default class CharacterManager {
    constructor(scene, selectedCharacter, gameStateManager) {
        this.scene = scene;
        this.characters = {};
        this.characterScale = 0.6;
        this.chadGotStuck = false;
        this.barryGotStuck = false;
        this.selectedCharacter = selectedCharacter; // Store selected character
        this.gameStateManager = gameStateManager;

    }

    createCharacters() {
        const width = this.scene.scale.width;
        const height = this.scene.scale.height;
        const isMobile = width <= 768;

        // Fix for Chrome Android texture issue
        const chadFrame = this.scene.textures.getFrame('characters', 'chad_idle');
        const barryFrame = this.scene.textures.getFrame('characters', 'barry_idle');

        // Create chad with explicit frame dimensions
        this.characters.chad = this.scene.add.sprite(
            width * (isMobile ? 0.25 : 0.40),
            height * (isMobile ? 0.77 : 0.83),
            'characters'
        );
        this.characters.chad.setFrame('chad_idle');
        this.characters.chad.setScale(this.characterScale);
        
        // Set explicit frame dimensions
        if (chadFrame) {
            this.characters.chad.setDisplaySize(
                chadFrame.width * this.characterScale,
                chadFrame.height * this.characterScale
            );
        }

        // Create barry with explicit frame dimensions
        this.characters.barry = this.scene.add.sprite(
            width * (isMobile ? 0.75 : 0.60),
            height * (isMobile ? 0.77 : 0.83),
            'characters'
        );
        this.characters.barry.setFrame('barry_idle');
        this.characters.barry.setScale(this.characterScale);

        // Set explicit frame dimensions
        if (barryFrame) {
            this.characters.barry.setDisplaySize(
                barryFrame.width * this.characterScale,
                barryFrame.height * this.characterScale
            );
        }


        // Add character names

        this.scene.add.text(
            width * (isMobile ? 0.25 : 0.40),
            height * (isMobile ? 0.88 : 0.95),
            this.selectedCharacter === "chad" ? "You" : "Robot",
            {
            fontSize: '16px',
            fill: "#aedbe9",
            fontFamily: 'Impact'
        }).setOrigin(0.5);

        this.scene.add.text(
            width * (isMobile ? 0.75 : 0.60),
            height *  (isMobile ? 0.88 : 0.95),
            this.selectedCharacter === "barry" ? "You" : "Robot",
            {
            fontSize: '16px',
            fill:  "#aedbe9",
            fontFamily: 'Impact'
        }).setOrigin(0.5);

    
        // Create animations after creating characters
        this.createCharacterAnimations();
        return this.characters;
    }

      // Add this method to get the currently active character
      getActiveCharacter() {
        return this.characters[this.selectedCharacter];
    }


    addTint(){
        const characterWithTint =  this.selectedCharacter === "chad" ? "barry" : "chad";
        const activeCharacter = this.characters[characterWithTint];
        const color = "#6aaa08";
        const opacity = 0.9;

        // Convert hex color string to number if using string format
         const colorNum = color.startsWith('#') ? parseInt(color.slice(1), 16) : color;
        activeCharacter.setTint(colorNum);
        activeCharacter.setAlpha(opacity);
    
    }

    setupInputs() {
        const otherCharacterName = this.selectedCharacter === "chad" ? "barry" : "chad";
        const activeCharacter = this.characters[this.selectedCharacter];
        const otherCharacter = this.characters[otherCharacterName];
        const charGotStuck = this.selectedCharacter === "chad" ? this.chadGotStuck : this.barryGotStuck;

        // Keyboard controls
        this.scene.input.keyboard.on('keydown-M', () => {
            if (!this.gameStateManager.isGamePaused()) {
                this.handleCharacterAction(activeCharacter, otherCharacter, otherCharacterName, charGotStuck);
            }
        });

        // Add tap/touch control
        this.scene.input.on('pointerdown', (pointer) => {

            if (!this.gameStateManager.isGamePaused()) {
                console.log("ddddddd")
                this.handleCharacterAction(activeCharacter, otherCharacter, otherCharacterName, charGotStuck);
            }
        });

    }

    // Separate the action logic into its own method to avoid code duplication
    handleCharacterAction(activeCharacter, otherCharacter, otherCharacterName, charGotStuck) {
        if (!charGotStuck) {
            activeCharacter.play(this.selectedCharacter + '_mouth_open');
            if (otherCharacter.anims.currentAnim.key !== otherCharacterName + "_not_happy") {
                otherCharacter.play(otherCharacterName + '_idle');
            }
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
                end: 14
            }),
            frameRate: 30,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'chad_dead',
            frames: this.scene.anims.generateFrameNames('characters', {
                prefix: 'frame_',
                start: 21,
                end: 28
            }),
            frameRate: 30,
            repeat: -1
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
                start: 14,
                end: 19
            }),
            frameRate: 30,
            repeat: 1
        });



        this.scene.anims.create({
            key: 'chad_not_happy',
            frames: this.scene.anims.generateFrameNames('characters', {
                prefix: 'frame_',
                start: 26,
                end: 34
            }),
            frameRate: 30,
            repeat: 4
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
                start: 63,
                end: 69
            }),
            frameRate: 30,
            repeat: -1
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
                end: 62
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
            repeat: 4
        });

        this.characters.chad.play("chad_idle")
        this.characters.barry.play("barry_idle")

    }


    // initializeCharacterPose(pose){
    //     this.characters.chad.play("chad_"+pose)
    //     this.characters.barry.play("barry_"+pose)
    // }


    updateCharacterPositions() {
        const width = this.scene.scale.width;
        const height = this.scene.scale.height;
        const isMobile = width <= 768;

        // Update chad position
        if (this.characters.chad) {
            this.characters.chad.setPosition(
                width * (isMobile ? 0.25 : 0.40),
                height * 0.8
            );
        }

        // Update barry position
        if (this.characters.barry) {
            this.characters.barry.setPosition(
                width * (isMobile ? 0.75 : 0.60),
                height * 0.8
            );
        }
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



    // Update method to handle eating effects
    update() {
        // Get all extras from the extras group
        const extras = this.scene.extraManager.extras.getChildren();
        
        // Get the active character
        const autoPlayingCharacterName =  this.selectedCharacter === "chad" ? "barry" : "chad";
        const activeCharacter = this.characters[autoPlayingCharacterName];
        
        if (!activeCharacter) return;

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

        // Update eat based on closest extra
        if (closestExtra && closestDistance <= 130) {
            const extraType = closestExtra.getData('type');
  
            // Open/close mouth logic
            if (extraType !== 'onion' && !activeCharacter.mouthOpen) {
                this.openMouth(activeCharacter, autoPlayingCharacterName);
            } else if (extraType === 'onion' && activeCharacter.mouthOpen) {
                this.closeMouth(activeCharacter, autoPlayingCharacterName);
            }
        } else {

            if (activeCharacter.mouthOpen) {
                this.closeMouth(activeCharacter, autoPlayingCharacterName);
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

    handleResize() {
        this.updateCharacterPositions();
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

        // Clean up when scene changes
        destroy() {

        }
}
