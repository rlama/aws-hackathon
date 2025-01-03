/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */

import GameStateManager from "./GameStateManager";
import { EXTRA_TYPE_CHANGE_INTERVAL_TIME, STATES_DETAIL, MAP_CONFIG, EMOJI_TYPES } from "../config/gameConfig";
import { cssColor } from "../utils/helpers";
import FlyingText from "./FlyingText";
import { saveToLeaderboard } from "../api/api";


export default class ExtraManager {
    constructor(scene, mapManager) {
        this.scene = scene;
        this.gameStateManager = GameStateManager.getInstance();
        this.mapManager = mapManager;
        this.extras = this.scene.add.group();
        this.activeExtras = [];
        this.pool = [];
        this.totalStateExtras = {
            chad: 0,
            barry: 0
        }

        // Text configuration for emojis
        this.EMOJI_CONFIG = {
            fontSize: '42px',
            fontFamily: 'Arial, "Segoe UI Emoji", sans-serif',
            resolution: 2
        };

        this.stateIndex = 0;

        // Keep your existing speed and spawn settings
        this.FALL_SPEED = 200;
        this.SPEED_INCREMENT = 20;
        this.SPEED_INTERVAL = 5000;
        this.SPAWN_DELAY = 1000;
        this.MIN_SPAWN_DELAY = 280;
        this.SPAWN_DELAY_DECREASE = 80;
        this.spawnTimer = null;
        this.gameStartTime = Date.now();
        this.EXTRA_SWITCH_DELAY = 15000;
        this.EXTRA_SWITCH_DURATION = 5000;
        this.TYPE_CHANGE_PAUSE = 5000;
        this.isChangingTypes = false;
        this.lastPhaseChange = 0;

        // Setup timers
        this.setupSpeedIncreaseTimer();
        this.setupSpawnTimer();
    }

    spawnExtra() {
        if (this.stateDetailIndex >= STATES_DETAIL.length) {
            this.endGame();
            return;
        }

        const { chad, barry } = this.scene.characterManager.getCharacters();
        const randomType = this.getWeightedRandomEmoji(); // Use weighted random instead
        const ypos = -50;

        // Create text objects for emojis
        const chadExtra = this.createEmojiExtra(chad.x, ypos, randomType);
        const barryExtra = this.createEmojiExtra(barry.x, ypos, randomType);

        this.setupExtra(chadExtra, randomType.type, 'chad');
        this.setupExtra(barryExtra, randomType.type, 'barry');

        return { chadExtra, barryExtra };
    }

    // Add this method to get weighted random emoji
    getWeightedRandomEmoji() {
        const totalWeight = EMOJI_TYPES.reduce((sum, item) => sum + item.weight, 0);
        let random = Phaser.Math.RND.between(1, totalWeight);

        for (const item of EMOJI_TYPES) {
            random -= item.weight;
            if (random <= 0) {
                return item;
            }
        }
        return EMOJI_TYPES[0]; // fallback
    };


    createEmojiExtra(x, y, emojiData) {
        const extra = this.scene.add.text(x, y, emojiData.emoji, this.EMOJI_CONFIG)
            .setOrigin(0.5)
            .setDepth(6);

        // Enable physics
        this.scene.physics.world.enable(extra);

        // Store emoji data
        extra.setData('emojiData', emojiData);

        return extra;
    }

    setupExtra(extra, type, characterSide) {
        extra.setData('type', type);
        extra.setData('originalType', type);
        extra.setData('typeChangeTimer', 0);
        extra.setData('typeChangeInterval', Phaser.Math.Between(
            EXTRA_TYPE_CHANGE_INTERVAL_TIME[0],
            EXTRA_TYPE_CHANGE_INTERVAL_TIME[1]
        ));
        extra.setData('spawnTime', Date.now());

        // Setup physics
        const body = extra.body;
        body.setSize(32, 32);
        body.setAllowGravity(false);
        body.setVelocityY(this.FALL_SPEED);
        body.setDragY(0);
        body.setBounce(0);
        body.setAngularVelocity(0);

        // Add to group and setup collisions
        this.extras.add(extra);
        this.activeExtras.push(extra);
        this.scene.collisionManager.setupCollisions(extra, this.scene.characterManager.getCharacters());

        return extra;
    }

    cleanupExtra(extra) {
        const index = this.activeExtras.indexOf(extra);
        if (index > -1) {
            this.activeExtras.splice(index, 1);
        }

        this.extras.remove(extra);

        if (extra.body) {
            extra.body.enable = false;
        }

        extra.destroy();
    }



    update(time, delta) {

        const currentTime = Date.now();
        const gameElapsedTime = currentTime - this.gameStartTime;

        // Only start extra type switching mechanics after initial delay
        if (gameElapsedTime >= this.EXTRA_SWITCH_DELAY) {
            const timeSinceLastPhase = currentTime - this.lastPhaseChange;

            // Check if we need to switch phases
            if (this.isChangingTypes && timeSinceLastPhase >= this.EXTRA_SWITCH_DURATION) {
                // Switch to pause phase
                this.isChangingTypes = false;
                this.lastPhaseChange = currentTime;
                // console.log('Switching to pause phase');
            } else if (!this.isChangingTypes && timeSinceLastPhase >= this.TYPE_CHANGE_PAUSE) {
                // Switch to changing phase
                this.isChangingTypes = true;
                this.lastPhaseChange = currentTime;
                // console.log('Switching to changing phase');
            }

            // If this is our first time past the initial delay, start in changing phase
            if (this.lastPhaseChange === 0) {
                this.isChangingTypes = true;
                this.lastPhaseChange = currentTime;
                // console.log('Starting first changing phase');
            }
        }

        // Clean up extras that are off screen
        this.activeExtras = this.activeExtras.filter(extra => {
            if (extra.y > this.scene.game.config.height + 100) {
                this.cleanupExtra(extra);
                return false;
            }
            return true;
        });

        // Handle type changes if needed
        if (this.isChangingTypes) {

            if (Math.random() < 0.5) {
                this.switchExtrasRandom()
            } else {
                this.switchExtrasToOnion()
            }
        }
    }


    switchExtrasRandom() {
        this.activeExtras.forEach(extra => {
            const currentTime = Date.now();
            const typeChangeTimer = extra.getData('typeChangeTimer');
            const SWITCH_DELAY = 1300; // 500ms delay between switches

            if (currentTime - typeChangeTimer >= SWITCH_DELAY) {
                // Get random type excluding current type
                const currentType = extra.getData('emojiData').type;
                const availableTypes = EMOJI_TYPES.filter(type => type.type !== currentType);
                const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];

                // Switch to new random type
                extra.setText(randomType.emoji);
                extra.setData('emojiData', randomType);
                extra.setData('type', randomType.type);

                // Update the timer
                extra.setData('typeChangeTimer', currentTime);
            }
        });
    }



    switchExtrasToOnion() {
        this.activeExtras.forEach(extra => {
            const currentTime = Date.now();
            const typeChangeTimer = extra.getData('typeChangeTimer');
            const SWITCH_DELAY = 1000; // 500ms delay between switches
            const emojiData = extra.getData('emojiData');

            if (currentTime - typeChangeTimer >= SWITCH_DELAY) {
                // Find onion type from EMOJI_TYPES
                const onionType = EMOJI_TYPES.find(type => type.type === 'Onion');

                // If current type is onion, switch back to original type
                if (emojiData.type === 'Onion') {
                    const originalType = extra.getData('originalType');
                    const originalEmoji = EMOJI_TYPES.find(type => type.type === originalType);

                    extra.setText(originalEmoji.emoji);
                    extra.setData('emojiData', originalEmoji);
                    extra.setData('type', originalEmoji.type);
                } else {
                    // Switch to onion
                    extra.setText(onionType.emoji);
                    extra.setData('emojiData', onionType);
                    extra.setData('type', onionType.type);
                }

                extra.setData('typeChangeTimer', currentTime);
            }
        });
    }



    setupSpeedIncreaseTimer() {
        const gsm = this.gameStateManager;
        this.spawnTimer = this.scene.time.addEvent({
            delay: this.SPEED_INTERVAL,
            callback: () => {
                if (!gsm.isGamePaused) {
                    // Increase fall speed

                    if (this.FALL_SPEED >= 280) {
                        this.FALL_SPEED = 200;
                        this.SPAWN_DELAY = 1000;
                    } else {
                        this.FALL_SPEED += this.SPEED_INCREMENT;
                    }

                    // Decrease spawn delay
                    this.SPAWN_DELAY = Math.max(
                        this.MIN_SPAWN_DELAY,
                        this.SPAWN_DELAY - this.SPAWN_DELAY_DECREASE
                    );
                    // Update spawn timer with new delay
                    this.updateSpawnTimer();
                }
            },
            callbackScope: this,
            loop: true
        });
    }


    updateSpawnTimer() {
        // Destroy existing timer and create new one with updated delay
        if (this.spawnTimer) {
            this.spawnTimer.destroy();
        }
        this.setupSpawnTimer();
    }

    setupSpawnTimer() {
        this.spawnTimer = this.scene.time.addEvent({
            delay: this.SPAWN_DELAY,  // This should be 1000 for 1 second
            callback: () => {
                if (!this.gameStateManager.isGamePaused) {
                    this.spawnExtra();
                }
            },
            callbackScope: this,
            loop: true
        });
    }



    handleCollisionForState(character, extra) {
        const emojiData = extra.getData('emojiData');
        if (emojiData.type !== 'Onion') {
            const { chad, barry } = this.scene.characterManager.getCharacters();
            const characterType = character === chad ? 'chad' : 'barry';

            // Update state-specific points
            this.totalStateExtras[characterType] += emojiData.points;

            // Check if current state is won after collision
            this.checkStateWin(character);
        }
    }



    /// add wonStates to gameState

    checkStateWin(character) {
        const currentState = STATES_DETAIL[this.stateIndex];
        const requiredSeats = currentState === "DC" ? 3 : currentState.seats;

        // Check Chad's points
        if (this.totalStateExtras.chad >= requiredSeats) {
            // Push win data

            this.gameStateManager.setWonStates({
                character: 'chad',
                state: currentState.name,
                seats: requiredSeats
            })
            const isPlayer = this.gameStateManager.selectedCharacter === 'chad';


            if (isPlayer) {
                this.gameStateManager.playSound('statewin')
            } else {
                this.gameStateManager.playSound('statewinopp', { volume: 0.2 })
            }


            const warr = ["conquered", "secured", "captured", "claimed", "won", "acquired"]
            const flyingWords = Phaser.Math.RND.pick(warr);


            const randomX = Phaser.Math.Between(character.x - 130, character.x - 180);
            const randomY = Phaser.Math.Between(300, 500);
            const randomH = Phaser.Math.Between(1800, 2500);
            const randomD = Phaser.Math.Between(50, 80);

            const playerText = currentState === 'DC' ? `Awesome its DC, You got extra points. ` : `You ${flyingWords} ${currentState.abbr}`;

            const customTxt = isPlayer ? playerText : `${currentState.abbr} ${flyingWords}`;

            this.gameStateManager.createFlyingText(randomX, randomY, customTxt, {
                color: cssColor(MAP_CONFIG.CHAD_COLOR),
                fontSize: '20px',
                duration: 1500,
                holdDuration: randomH,
                distance: randomD,
                strokeThickness: 1,
                fillColor: '#efa4a5',
                backgroundColor: '#efa4a5'
            });

            // DC is not the state but it does participate in presidential elections and has its own voting.
            if (STATES_DETAIL[this.stateIndex].name !== "DC") {
                this.mapManager.highlightState(STATES_DETAIL[this.stateIndex].name, STATES_DETAIL[this.stateIndex].abbr, MAP_CONFIG.CHAD_COLOR);
            }
            this.moveToNextState();
        }
        // Check Barry's points
        else if (this.totalStateExtras.barry >= requiredSeats) {

            // Push win data
            this.gameStateManager.setWonStates({
                character: 'barry',
                state: currentState.name,
                seats: requiredSeats
            });

            const isPlayer = this.gameStateManager.selectedCharacter === 'barry';

            if (this.gameStateManager.selectedCharacter === 'barry') {
                this.gameStateManager.playSound('statewin')
            } else {
                this.gameStateManager.playSound('statewinopp', { volume: 0.2 })
            }

            const warr = ["conquered", "secured", "captured", "claimed", "won", "acquired"]
            const flyingWords = Phaser.Math.RND.pick(warr);

            const randomX = Phaser.Math.Between(character.x + 130, character.x + 180);
            const randomY = Phaser.Math.Between(300, 500);
            const randomH = Phaser.Math.Between(1800, 2500);
            const randomD = Phaser.Math.Between(50, 80);

            const playerText = currentState === 'DC' ? `Awesome its DC, You got extra points. ` : `You ${flyingWords} ${currentState.abbr}`;

            const customTxt = isPlayer ? playerText : `${currentState.abbr} ${flyingWords}`;


            this.gameStateManager.createFlyingText(randomX, randomY, customTxt, {
                color: cssColor(MAP_CONFIG.BARRY_COLOR),
                fontSize: '20px',
                duration: 1500,
                distance: randomD,
                holdDuration: randomH,
                strokeThickness: 1,
                fillColor: '#91d4f7',
                backgroundColor: '#91d4f7'
            });

            if (STATES_DETAIL[this.stateIndex].name !== "DC") {
                this.mapManager.highlightState(STATES_DETAIL[this.stateIndex].name, STATES_DETAIL[this.stateIndex].abbr, MAP_CONFIG.BARRY_COLOR);
            }
            this.moveToNextState();
        }

    }

    moveToNextState() {
        // Reset state points before moving to next state
        this.totalStateExtras = {
            chad: 0,
            barry: 0
        };

        this.stateIndex++;

        // Check if we've gone through all states
        if (this.stateIndex >= STATES_DETAIL.length) {
            this.endGame();
        } else {
            this.updateStateDisplay();
        }
    }

    updateStateDisplay() {
        const currentState = STATES_DETAIL[this.stateIndex];

        // Emit event for state change
        this.scene.events.emit('stateChanged', {
            stateName: currentState.name,
            seatsRequired: currentState.seats,
            stateIndex: this.stateIndex,
            chadPoints: this.totalStateExtras.chad,
            barryPoints: this.totalStateExtras.barry
        });
    }



    stopSpawnTimer() {
        if (this.spawnTimer) {
            this.spawnTimer.destroy();
            this.spawnTimer = null;
        }
    }

    getTotalStateExtras() {
        return this.totalStateExtras;
    }
    getCurrentState() {
        return STATES_DETAIL[this.stateIndex];
    }


    endGame() {
        this.stopSpawnTimer();
        this.extras.clear(true, true);

        const finalScores = this.gameStateManager.getFinalScore();

        finalScores = {...finalScores, uid: this.gameStateManager.uid}

        // Stop the current scene and launch score scene
        this.scene.scene.pause();

        //Save score to leaderboard, only if player score is 270 or if player wins.
        if (finalScores.score >= 270) {
            saveToLeaderboard(finalScores)
        }

        // Play sound
        const didWon = this.gameStateManager.winner === this.gameStateManager.selectedCharacter;
        if (didWon) {
            this.gameStateManager.playSound("win");
        } else {
            this.gameStateManager.playSound("loose");
        }

        this.scene.scene.start('FinishScene', {
            gameEnd: true
        });

        console.log("Game end");
    }
}

