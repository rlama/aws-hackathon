import { EXTRA_POINTS, STATES_DETAIL } from "../config/gameConfig";
import FlyingText from "./FlyingText";

export default class ScoreManager {
    constructor(scene) {
        this.scene = scene;
        this.scores = {
            chad: { score: 0, winner: "" },
            barry: { score: 0, winner: "" },
            chadState: { score: 0, winner: "" },
            barryState: { score: 0, winner: "" }
        };
        this.leftOverPointsDetail = { chat: 0, barry: 0, maxAllowedPoints: 0 }
        this.maxAllowedPoints = 20;

        this.toWin = STATES_DETAIL.reduce((sum, state) => sum + state.seats, 0); //total from state seats
        this.toWin += 100// (Senate) this includes DC (+3) from the STATES_DETAIL array

        this.toWin = this.toWin / 2 + 1 ; // Majority to win

        this.createScoreDisplay();
    }


    createScoreDisplay() {
        const gameWidth = this.scene.cameras.main.width;
        const boxHeight = 60;

        // Create the main score box
        this.scoreBox = this.scene.add.rectangle(
            0,           // x position (left aligned)
            0,           // y position (top aligned)
            gameWidth,   // width matches game width
            boxHeight,   // height of 60px
            0x000000,   // black color
            1         // 70% opacity
        );
        this.scoreBox.setOrigin(0, 0); // Align to top-left
        this.scoreBox.setDepth(10);     // Ensure it's above game elements

        // Style for score text
        const textStyle = {
            fontSize: '25px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        };

         // Style for score text
         const textStyleState = {
            fontSize: '15px',
            fill: '#ff0000',
            fontFamily: 'Arial'
        };

        // Create score texts
        const boxHalf =  boxHeight / 2.5;
        this.scoreText = {
            chad: this.scene.add.text(
                20,                 // Left padding
                boxHalf,      // Vertical center of box
                'Chad: 0 / '+this.toWin+ ' to win',
                textStyle
            ),
            barry: this.scene.add.text(
                gameWidth - 20,     // Right padding
                boxHalf,      // Vertical center of box
                'Barry: 0 / '+this.toWin+ ' to win',
                textStyle
            ),
            chadState: this.scene.add.text(
                20,                 // Left padding
                boxHalf + 20,      // Vertical center of box
                'CA 2 / 4',
                textStyleState
            ),
            barryState: this.scene.add.text(
                gameWidth - 20,     // Right padding
                boxHalf + 20,      // Vertical center of box
                'CA 2 / 4',
                textStyleState
            )
        };

        // Set text properties
        this.scoreText.chad.setOrigin(0, 0.5);    // Align left, vertically centered
        this.scoreText.barry.setOrigin(1, 0.5);   // Align right, vertically centered
        this.scoreText.chad.setDepth(11);         // Above the score box
        this.scoreText.barry.setDepth(11);        // Above the score box

        this.scoreText.chadState.setOrigin(0, 0.5);    // Align left, vertically centered
        this.scoreText.barryState.setOrigin(1, 0.5);   // Align right, vertically centered
        this.scoreText.chadState.setDepth(11);         // Above the score box
        this.scoreText.barryState.setDepth(11);        // Above the score box


    }

    calculatePoints(extraType) {
        // Point values for different extra types
        return EXTRA_POINTS[extraType] || 0;
        // switch(extraType) {
        //     case 'onion':
        //         return -2;
        //     case 'fruit':
        //         return 1;
        //     case 'bird_fly':
        //         return 2;
        //     case 'dragon_fly':
        //         return 3;
        //     case 'five_coin':
        //         return 3;
        //     case 'gold_box':
        //         return 5;
        //     default:
        //         console.warn('Unknown extra type:', extraType);
        //         return 0;
        // }
    }


    writeToScoreBoard(characterKey, currentState) {
        // Check for game end
        this.scoreText[characterKey].setText(
            `${characterKey.charAt(0).toUpperCase() + characterKey.slice(1)}: ${this.scores[characterKey].score}  /  ${this.toWin} to win`
        );

        const ct = this.scene.extraManager.getTotalStateExtras()

        this.scoreText['chadState'].setText(
            `For ${currentState.name} : ${ct[characterKey]} / ${currentState.seats}`
        );

        this.scoreText['barryState'].setText(
            `For ${currentState.name} : ${ct[characterKey]} / ${currentState.seats}`
        );
    }   

    // Need to update the state score properly


    _updateScore(characterKey, points) {

        this.scores[characterKey].score += points;
         // Animate score change
         this.scene.tweens.add({
            targets: this.scoreText[characterKey],
            scale: { from: 1.2, to: 1 },
            duration: 200,
            ease: 'Power2'
        });
        this.writeToScoreBoard(characterKey);

        /// addd and detect game end  //this.toWin

        if (this.scores[characterKey].score >= this.toWin) {

            this.scores[characterKey].score = this.toWin;
            this.scores[characterKey].winner =  characterKey;

            this.scene.extraManager.endGame();
        }

    }



    updateScore(character, extraType, currentState) {

        const characterKey = character === this.scene.characterManager.getCharacters().chad ? 'chad' : 'barry';

        if (extraType) {
                const points = this.calculatePoints(extraType);

                this.scores[characterKey].score += points;

                // Animate score change
                this.scene.tweens.add({
                    targets: this.scoreText[characterKey],
                    scale: { from: 1.2, to: 1 },
                    duration: 200,
                    ease: 'Power2'
                });


                const pointTxt = extraType === 'onion' ? `${points} Disabled` : `+${points}`;

                this.flyingText = new FlyingText(this.scene);
                this.flyingText.create(character.x, 450, pointTxt, {
                    color: extraType === 'onion' ? '#ff0000'  : '#00ff00',
                    fontSize: '32px',
                    duration: 1500,
                    distance: 50,
                    holdDuration: extraType === 'onion' ? 2000 : 400
                });
        
                this.writeToScoreBoard(characterKey, currentState);
        
        }

        /// addd and detect game end  //this.toWin

        if (this.scores[characterKey].score >= this.toWin) {

            this.scores[characterKey].score = this.toWin;
            this.scores[characterKey].winner =  characterKey;

            this.scene.extraManager.endGame();
        }

    }


    // handleResize(gameSize) {
    //     const { width, height } = gameSize;
    //     const boxHeight = 60;

    //     // Resize and reposition score box
    //     this.scoreBox.width = width;

    //     // Reposition score texts
    //     this.scoreText.chad.setPosition(20, boxHeight / 2);
    //     this.scoreText.barry.setPosition(width - 20, boxHeight / 2);
    // }

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
