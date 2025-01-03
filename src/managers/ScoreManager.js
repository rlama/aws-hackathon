/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */


import { EMOJI_TYPES, STATES_DETAIL, FONT_FAMILY, MAP_CONFIG, AWS_API_GATEWAY_ENDPOINT, MAX_MOBILE_WIDTH } from "../config/gameConfig";
import GameStateManager from "./GameStateManager";
import { cssColor, isIphone, checkIfMobile } from "../utils/helpers";
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
    
        this.updateCount = 0;

        this.boxHeight = 60;

        this.gameWidth = this.scene.cameras.main.width;
        this.height = this.scene.cameras.main.width;

        this.initialize()
    }

    initialize() {     
        this.createScoreDisplay();
        // Add resize listener
        this.scene.game.events.on('widthchange', this.handleResize, this);
        this.handleResize()
    }

    handleResize(obj){
        this.gameWidth = obj ? obj.width : this.scene.cameras.main.width;
        // this.gameHeight = obj ? obj.width : this.scene.cameras.main.width;

        if(this.gameWidth < MAX_MOBILE_WIDTH){

            const ypos = isIphone() ?  this.boxHeight / 0.55 :   this.boxHeight / 1.1;

            this.scoreText.chad.setY(ypos)
            this.scoreText.barry.setY(ypos)


            this.scoreText.chadStateCount.setY(ypos+25)
            this.scoreText.barryStateCount.setY(ypos+25)

            this.scoreText.chadState.setY(ypos+50)
            this.scoreText.barryState.setY(ypos+50)


            this.scoreText.playingStateA.setY(ypos+40)
            this.scoreText.playingStateB.setY(ypos+60)

            this.scoreText.playingStateB.setStyle({fontSize:'15px'})
        }
    }


    createScoreDisplay() {
        this.gameWidth = this.scene.cameras.main.width;

        // Style for score text
        const textStyle = {
            fontSize: '22px',
            // fontWeight: 'bold',
            fill: '#ffffff',
            fontFamily: SCORE_FONT,
            stroke: '#ffffff',
            strokeThickness: 2
        };

        const textStyleState = {
            fontSize: '15px',
            fill: '#ffffff',
            fontFamily: SCORE_FONT,
            stroke: '#000000',
            strokeThickness: 2
        };
        const textStyleStateWon = {
            fontSize: '15px',
            fill: '#ffffff',
            fontFamily: SCORE_FONT,
            stroke: '#ffffff',
            strokeThickness: 1
        };

        const textStyleStateAA = {
            fontSize: '12px',
            fill: '#7f7f7f',
            fontFamily: SCORE_FONT,
            // stroke: '#000000',
            // strokeThickness: 2
        };


        const textStyleStateBB = {
            fontSize: '18px',
            fill: '#74b40a',
            fontFamily: SCORE_FONT,
            stroke: '#ffffff',
            strokeThickness: 2
        };

        // Create score texts
        const boxHalf = this.boxHeight / 2.1;
        const toWinText =  this.gameWidth < MAX_MOBILE_WIDTH ? '' : `/  ${this.toWin}` ;

        const chadStrokeColor =  checkIfMobile() ?  MAP_CONFIG.CHAD_COLOR : MAP_CONFIG.CHAD_STROKE_COLOR;
        const barryStrokeColor =  checkIfMobile() ?  MAP_CONFIG.BARRY_COLOR : MAP_CONFIG.BARRY_STROKE_COLOR;

        this.scoreText = {
            chad: this.scene.add.text(
                20,                 // Left padding
                boxHalf,      // Vertical center of box
                'Chad: '+this.gameStateManager.getScore("chad") + toWinText,
                {
                    ...textStyle,
                    fill: cssColor(MAP_CONFIG.CHAD_COLOR),
                    stroke: cssColor(chadStrokeColor)
                }
            ),
            barry: this.scene.add.text(
                this.gameWidth - 20,     // Right padding
                boxHalf,      // Vertical center of box
                'Barry: '+this.gameStateManager.getScore("barry")+ toWinText,
                {
                    ...textStyle,
                    fill: cssColor(MAP_CONFIG.BARRY_COLOR),
                    stroke: cssColor(barryStrokeColor)
                }
            ),

            playingStateA: this.scene.add.text(
                this.gameWidth/2,                 // Left padding
                boxHalf + 28,      // Vertical center of box
                'playing for ',
                textStyleStateAA
            ),


            playingStateB: this.scene.add.text(
                this.gameWidth/2,                 // Left padding
                boxHalf + 50,      // Vertical center of box
                'Alabama: 1',
                textStyleStateBB
            ),

            chadStateCount: this.scene.add.text(
                20,                 // Left padding
                boxHalf + 25,      // Vertical center of box
                'STATES: 0',
                {
                    ...textStyleStateWon,
                    fill: cssColor(MAP_CONFIG.CHAD_COLOR),
                }
            ),
            barryStateCount: this.scene.add.text(
                this.gameWidth - 20,     // Right padding
                boxHalf + 25,      // Vertical center of box
                'STATES: 0',
                {
                    ...textStyleStateWon,
                    fill: cssColor(MAP_CONFIG.BARRY_COLOR),
                }
            ),

            chadState: this.scene.add.text(
                20,                 // Left padding
                boxHalf + 45,      // Vertical center of box
                '',
                textStyleState
            ),

            barryState: this.scene.add.text(
                this.gameWidth - 20,     // Right padding
                boxHalf + 45,      // Vertical center of box
                '',
                textStyleState
            )
        };

        // Center both texts together
        // Set text properties
        this.scoreText.playingStateA.setOrigin(0.5);  
        this.scoreText.playingStateA.setDepth(11);  
        this.scoreText.playingStateA.setLetterSpacing(2);

        this.scoreText.playingStateB.setOrigin(0.5);  
        this.scoreText.playingStateB.setDepth(11);  
        this.scoreText.playingStateB.setLetterSpacing(2);


        this.scoreText.chadStateCount.setOrigin(0, 0.5);  
        this.scoreText.chadStateCount.setDepth(11);  
        this.scoreText.chadStateCount.setLetterSpacing(2);

        this.scoreText.barryStateCount.setOrigin(1, 0.5);  
        this.scoreText.barryStateCount.setDepth(11);  
        this.scoreText.barryStateCount.setLetterSpacing(2);


        this.scoreText.chad.setOrigin(0, 0.5);  
        this.scoreText.chad.setDepth(11);      
        this.scoreText.chad.setLetterSpacing(2);

        this.scoreText.barry.setOrigin(1, 0.5);   
        this.scoreText.barry.setDepth(11);        
        this.scoreText.barry.setLetterSpacing(2);

        this.scoreText.chadState.setOrigin(0, 0.5);  
        this.scoreText.chadState.setDepth(11);         
        this.scoreText.chadState.setLetterSpacing(2);
        
        this.scoreText.barryState.setOrigin(1, 0.5);   
        this.scoreText.barryState.setDepth(11);        
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

        const toWinText =  this.gameWidth < MAX_MOBILE_WIDTH ? '' : `/  ${this.toWin}` ;

        this.scoreText[characterKey].setText(
            `${characterKey.charAt(0).toUpperCase() + characterKey.slice(1)}: ${playerScore}  ${toWinText}`
        );

        const ct = this.scene.extraManager.getTotalStateExtras()

        this.scoreText['playingStateB'].setText(`${currentState.name}: ${currentState.seats}`);
    
        const chadWonStates = this.gameStateManager.wonStates.filter(d => d.character === 'chad').length;
        const barryWonStates = this.gameStateManager.wonStates.filter(d => d.character === 'barry').length;

        this.scoreText['chadStateCount'].setText(
            `STATES: ${chadWonStates}`
        );

        this.scoreText['barryStateCount'].setText(
            `STATES: ${barryWonStates}`
        );

        this.scoreText['chadState'].setText(
            `${currentState.abbr} : ${ct[characterKey]} / ${currentState.seats}`
        );

        this.scoreText['barryState'].setText(
            `${currentState.abbr} : ${ct[characterKey]} / ${currentState.seats}`
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
            const dTxt = ['oooops...', 'damn onions...!', 'not again...', 'ooh nooooo!'];
            const flyingWord = Phaser.Math.RND.pick(dTxt);

            const isOnion = extraType === 'Onion';
            const pointTxt = isOnion ? flyingWord : `+${points}`;
            const fontSize = isOnion ? '22px' : '32px';

            const isEven = this.updateCount % 2 === 0;

            this.gameStateManager.createFlyingText(character.x, 450, pointTxt, {
                color: isOnion ? '#d08e0d' : '#00ff00',
                fontSize: fontSize,
                duration: 1500,
                distance: isEven ? 50 : 100,
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
        this.updateCount ++;
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
