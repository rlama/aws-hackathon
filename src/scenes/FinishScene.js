/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */

import { addBackground, cssColor } from "../utils/helpers";
import MapManager from "../components/MapManager";
import { MAP_CONFIG, FONT_FAMILY } from "../config/gameConfig";
import StandardButton from "../objects/StandardButton";
import GameStateManager from "../components/GameStateManager";


export default class FinishScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FinishScene' });
        this.gameStateManager = GameStateManager.getInstance();

    }

    init(data) {
        this.gameEnd = data.gameEnd;
    }


    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Add background
        addBackground(this, width, height, true, "gamescene", "finishScene");

        const idleColors = {
            idle: {
                ...MAP_CONFIG.idle,
                // lineColor: 0x5c3a3a,
                // lineStyle: 1,
                fillStyle: 0xcff3ff
            }
        }

        this.mapManager = new MapManager(this, 1.4, height * 0.29);
        // Create the map
        this.mapManager.createStateMap();

        this.gameStateManager.wonStates.forEach((item) => {
            const color = item.character === 'chad' ? MAP_CONFIG.CHAD_COLOR : MAP_CONFIG.BARRY_COLOR;
            this.mapManager.highlightState(item.state, "", color);
        })

        let ypos = 43;

        // Game Over text
        this.add.text(this.scale.width / 2, ypos, 'GAME OVER', {
            fontSize: '50px',
            fill: '#ffffff',
            fontFamily: FONT_FAMILY,
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5)
            .setDepth(1);


        // Game Over text
        ypos += 80

        const player = 'Hey ' + this.gameStateManager.playerName + "!";
        const didWon = this.gameStateManager.winner === this.gameStateManager.selectedCharacter;
        const winLostText = didWon ? player + ' You Won !!!' : player + ' You Lost !';


        this.add.text(this.scale.width / 2, ypos, winLostText, {
            fontSize: '28px',
            fill: '#bda006',
            fontFamily: FONT_FAMILY,
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Final Scores
        ypos += 50

        this.add.text(this.scale.width / 2 - 130, ypos, `Chad: ${this.gameStateManager.getScore("chad")}`, {
            fontSize: '32px',
            fill: cssColor(MAP_CONFIG.CHAD_COLOR),
            stroke: cssColor(MAP_CONFIG.CHAD_COLOR),
            strokeThickness: 2
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2 + 100, ypos, `Barry: ${this.gameStateManager.getScore("barry")}`, {
            fontSize: '32px',
            fill: cssColor(MAP_CONFIG.BARRY_COLOR),
            stroke: cssColor(MAP_CONFIG.BARRY_COLOR),
            strokeThickness: 2
            // fontFamily:FONT_FAMILY
        }).setOrigin(0.5);

        /// ---------------  add state won number --------------
        ypos += 40

        const chadStateCount = this.gameStateManager.wonStates.filter(item => item.character === 'chad').length;

        this.add.text(this.scale.width / 2 - 130, ypos, `States: ${chadStateCount}`, {
            fontSize: '22px',
            fill: cssColor(MAP_CONFIG.CHAD_COLOR),
            stroke: cssColor(MAP_CONFIG.CHAD_COLOR),
            strokeThickness: 2
        }).setOrigin(0.5);


        const barryStateCount = this.gameStateManager.wonStates.filter(item => item.character === 'barry').length;

        this.add.text(this.scale.width / 2 + 100, ypos, `States: ${barryStateCount}`, {
            fontSize: '22px',
            fill: cssColor(MAP_CONFIG.BARRY_COLOR),
            stroke: cssColor(MAP_CONFIG.BARRY_COLOR),
            strokeThickness: 2
            // fontFamily:FONT_FAMILY
        }).setOrigin(0.5);


        // Leaderboard button
        ypos += 60
        const leaderboardButton = new StandardButton(this, this.scale.width * 0.5, ypos, 'Leaderboard', {
            backgroundColor: 0x3498db,
            onClick: () => {
                this.scene.start('LeaderboardScene', {
                    parentScene: this.scene.key
                });
            }
        });

        // Play Again button
        ypos += 40
        const playAgainButton = new StandardButton(this, this.scale.width * 0.5, ypos, 'Play Again', {
            onClick: () => {
                this.restartGame();
            }
        });
    }

    restartGame() {
        // this.scene.scene.extraManager.resetExtras();
        // this.scene.scene.characterManager.resetCharacters();
        this.gameStateManager.reset();
        this.scene.stop('ScoreScene');
        this.scene.start('GameScene');
    }
}
