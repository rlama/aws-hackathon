/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */


import { EMOJI_TYPES, STATES_DETAIL, FONT_FAMILY, MAP_CONFIG, AWS_API_GATEWAY_ENDPOINT } from "../config/gameConfig";
import GameStateManager from "./GameStateManager";
import { cssColor } from "../utils/helpers";
import FlyingText from "./FlyingText";

const SCORE_FONT = "Impact"

export default class ScoreManager {
    constructor(scene) {
         this.gameStateManager = GameStateManager.getInstance();
        this.scene = scene;

        this.leftOverPointsDetail = { chat: 0, barry: 0, maxAllowedPoints: 0 }
        this.maxAllowedPoints = 20;

        this.toWin = STATES_DETAIL.reduce((sum, state) => sum + state.seats, 0); //total from state seats
        this.toWin += 100// (Senate) this includes DC (+3) from the STATES_DETAIL array

        this.toWin = this.toWin / 2 + 1; // Majority to win
        this.createScoreDisplay();

    }


    createScoreDisplay() {
        const gameWidth = this.scene.cameras.main.width;
        const boxHeight = 60;

        // Style for score text
        const textStyle = {
            fontSize: '25px',
            fill: '#ffffff',
            fontFamily: SCORE_FONT,
            stroke: '#000000',
            strokeThickness: 1
        };

        // Style for score text
        const textStyleState = {
            fontSize: '15px',
            fill: '#ffffff',
            fontFamily: SCORE_FONT,
            stroke: '#000000',
            strokeThickness: 2
        };

        // Create score texts
        const boxHalf = boxHeight / 2.1;
        this.scoreText = {
            chad: this.scene.add.text(
                20,                 // Left padding
                boxHalf,      // Vertical center of box
                'Chad: '+this.gameStateManager.getScore("chad")+' / ' + this.toWin + ' to win',
                {
                    ...textStyle,
                    fill: cssColor(MAP_CONFIG.CHAD_COLOR),
                    stroke: cssColor(MAP_CONFIG.CHAD_COLOR)
                }
            ),
            barry: this.scene.add.text(
                gameWidth - 20,     // Right padding
                boxHalf,      // Vertical center of box
                'Barry: '+this.gameStateManager.getScore("barry")+' / ' + this.toWin + ' to win',
                {
                    ...textStyle,
                    fill: cssColor(MAP_CONFIG.BARRY_COLOR),
                    stroke: cssColor(MAP_CONFIG.BARRY_COLOR)
                }
            ),
            chadState: this.scene.add.text(
                20,                 // Left padding
                boxHalf + 30,      // Vertical center of box
                'CA 2 / 4',
                textStyleState
            ),
            barryState: this.scene.add.text(
                gameWidth - 20,     // Right padding
                boxHalf + 30,      // Vertical center of box
                'CA 2 / 4',
                textStyleState
            )
        };

        // Set text properties
        this.scoreText.chad.setOrigin(0, 0.5);    // Align left, vertically centered
        this.scoreText.barry.setOrigin(1, 0.5);   // Align right, vertically centered
        this.scoreText.chad.setDepth(11);         // Above the score box
        this.scoreText.barry.setDepth(11);        // Above the score box
        this.scoreText.chad.setLetterSpacing(2);
        this.scoreText.barry.setLetterSpacing(2);

        this.scoreText.chadState.setOrigin(0, 0.5);    // Align left, vertically centered
        this.scoreText.barryState.setOrigin(1, 0.5);   // Align right, vertically centered
        this.scoreText.chadState.setDepth(11);         // Above the score box
        this.scoreText.barryState.setDepth(11);        // Above the score box
        this.scoreText.chadState.setLetterSpacing(2);
        this.scoreText.barryState.setLetterSpacing(2);

    }

    // Point values for different extra types
    calculatePoints(extraType) {
        const pt = EMOJI_TYPES.filter(d => d.type === extraType)[0]
        return pt ? pt.points : 0;
    }


    writeToScoreBoard(characterKey, currentState) {

        const playerScore = this.gameStateManager.getScore(characterKey);
        // Check for game end
        this.scoreText[characterKey].setText(
            `${characterKey.charAt(0).toUpperCase() + characterKey.slice(1)}: ${playerScore}  /  ${this.toWin} to win`
        );

        const ct = this.scene.extraManager.getTotalStateExtras()

        this.scoreText['chadState'].setText(
            `For ${currentState.name} : ${ct[characterKey]} / ${currentState.seats}`
        );

        this.scoreText['barryState'].setText(
            `For ${currentState.name} : ${ct[characterKey]} / ${currentState.seats}`
        );
    }


    updateScore(character, extraType, currentState) {

        const characterKey = character === this.scene.characterManager.getCharacters().chad ? 'chad' : 'barry';

        if (extraType) {
            const points = +this.calculatePoints(extraType);

            this.gameStateManager.incrementScore(characterKey, points)

            // Animate score change
            this.scene.tweens.add({
                targets: this.scoreText[characterKey],
                scale: { from: 1.2, to: 1 },
                duration: 200,
                ease: 'Power2'
            });
            const dTxt = ['oops...', 'Damn onions!', 'why now...', 'Oh nooooo!'];
            const flyingWord = Phaser.Math.RND.pick(dTxt);

            const isOnion = extraType === 'Onion';
            const pointTxt = isOnion ? flyingWord : `+${points}`;
            const fontSize = isOnion ? '22px' : '32px';


            this.flyingText = new FlyingText(this.scene);
            this.flyingText.create(character.x, 450, pointTxt, {
                color: isOnion ? '#ff0000' : '#00ff00',
                fontSize: fontSize,
                duration: 1500,
                distance: 50,
                holdDuration: isOnion ? 2000 : 400,
                strokeThickness: isOnion ? 1 : 2
            });

            this.writeToScoreBoard(characterKey, currentState);
        }

        /// add and detect game end
        if (this.gameStateManager.getScore(characterKey) >= this.toWin) {

            this.gameStateManager.winner = characterKey;
            this.scene.extraManager.endGame();
        }

    }


    reset() {
        this.scores = { chad: { score: 0, spawned: 0 }, barry: { score: 0, spawned: 0 } };
        Object.keys(this.scoreText).forEach(key => {
            this.scoreText[key].setText(
                `${key.charAt(0).toUpperCase() + key.slice(1)}: 0`
            );
            this.scoreText[key].setScale(1);
        });
    }


    getScores() {
        return this.scores;
    }
}
