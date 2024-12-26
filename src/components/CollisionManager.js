/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */

import { RESET_TO_IDLE_TIME, DEFAULT_DIFFICULTY_SETTINGS } from "../config/gameConfig";
import GameStateManager from "./GameStateManager";

export default class CollisionManager {
    constructor(scene, scoreManager, audioManager) {
        this.gameStateManager = GameStateManager.getInstance();
        this.scene = scene;
        this.characterManager = scene.characterManager;
        this.scoreManager = scoreManager;
    }


    setupCollisions(extra, characters) {
        this.scene.physics.add.overlap(
            extra,
            [characters.chad, characters.barry],
            this.handleCollision.bind(this),
            this.checkCollisionCondition.bind(this),
            this
        );

        // Destroy when out of bounds
        extra.checkWorldBounds = true;
        extra.body.onWorldBounds = true;

        this.scene.physics.world.on('worldbounds', (body) => {
            if (body.gameObject === extra) {
                extra.destroy();
            }
        });
    }

    handleCollision(extra, character) {
        if (character.anims.currentAnim.key.includes('mouth_open')) {

            const currentStateTotal = this.scene.extraManager.getTotalStateExtras()
            const currentState = this.scene.extraManager.getCurrentState();
            const statesCurrentData = { currentStateTotal, currentState }

            const points = this.scoreManager.calculatePoints(extra.type);
            const extraType = extra.getData('type');


            const { chad, barry } = this.characterManager.getCharacters();
            const characterType = character === chad ? 'chad' : 'barry';

            if (characterType !== this.gameStateManager.selectedCharacter) {
                this.gameStateManager.playSound('eatingopp', { volume: 0.5 });
            }

            if (extraType !== 'Onion' && characterType === this.gameStateManager.selectedCharacter) {
                this.gameStateManager.playSound('eating', { volume: 0.3 });
                // this.gameStateManager.playSound('pluspoints');
            }

            this.handleCharacterAnimationOnCollision(character, extraType);

            // Handle collision for state
            this.scene.extraManager.handleCollisionForState(character, extra,);

            this.scoreManager.updateScore(character, extraType, currentState);

            extra.destroy();
        }
    }

    checkCollisionCondition(extra, character) {
        const extraCenter = extra.y;
        const characterCenter = character.y;
        return extraCenter < characterCenter;
    }

    handleCharacterAnimationOnCollision(character, extraType) {
        const { chad, barry } = this.characterManager.getCharacters();
        const isChad = character === chad;

        const characterObj = isChad ? chad : barry;
        const eatingAnim = isChad ? 'chad_eating' : 'barry_eating';
        const idleAnim = isChad ? 'chad_idle' : 'barry_idle';

        // Remove only animation complete listeners
        characterObj.removeListener('animationcomplete');

        // Play eating animation
        characterObj.play(eatingAnim);

        // Handle eating animation completion
        characterObj.once('animationcomplete', (animation) => {
            if (animation.key === eatingAnim) {
                if (extraType === 'Onion') {
                    this.handleCharacterOnion(character, isChad);
                } else {
                    characterObj.play(idleAnim);
                }
            }
        });
    }


    handleCharacterOnion(character, isChad) {
        const { chad, barry } = this.characterManager.getCharacters();
        const characterObj = isChad ? chad : barry;
        const notHappyAnim = isChad ? 'chad_not_happy' : 'barry_not_happy';
        const idleAnim = isChad ? 'chad_idle' : 'barry_idle';

        // Set stuck state using CharacterManager
        this.characterManager.setStuckState(isChad ? 'chad' : 'barry', true);

        // Remove only animation complete listeners
        characterObj.removeListener('animationcomplete');

        // Play not happy animation
        characterObj.play(notHappyAnim);

        const characterType = character === chad ? 'chad' : 'barry';

        if (characterType !== this.gameStateManager.selectedCharacter) {
            this.gameStateManager.playSound('onionopp', { volume: 1 });
        } else {
            this.gameStateManager.playSound('onion')
        }




        // Reset after delay

        const reseTimeForOpponent = DEFAULT_DIFFICULTY_SETTINGS[this.gameStateManager.difficultyLevel].resetToIdleTimeForOpponent;

        const resetTime = this.gameStateManager.selectedCharacter === characterType ? RESET_TO_IDLE_TIME : reseTimeForOpponent;

        this.scene.time.delayedCall(resetTime, () => {
            this.characterManager.setStuckState(isChad ? 'chad' : 'barry', false);
            if (characterObj) characterObj.play(idleAnim);
        }, null, this);

    }
}
