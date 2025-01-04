/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */

import { addBackground, cssColor } from "../utils/helpers";
import MapManager from "../managers/MapManager";
import { MAP_CONFIG, FONT_FAMILY, GAMEOVER_TEXT_WON, GAMEOVER_TEXT_LOST } from "../config/gameConfig";
import StandardButton from "../objects/StandardButton";
import GameStateManager from "../managers/GameStateManager";
import { BackgroundManager } from "../managers/BackgroundManager";



export default class FinishScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FinishScene' });
        this.gameStateManager = GameStateManager.getInstance();

    }

    init(data) {
        this.gameEnd = data.gameEnd;
        this.checkRankData();
    }

    // In FinishScene.js
    checkRankData() {
        if (this.gameStateManager.rankDataFetching) {
            // Check every 100ms until rankDataFetching is false
            setTimeout(() => {
                this.checkRankData();
            }, 100);
        } else {
            // rankData is ready, update UI or perform necessary actions
            const rankData = this.gameStateManager.rankData;

            let rankDataEle = this.element.querySelector('#f-rank');
            const msg = `You are ranked ${rankData.rank} out of ${rankData.totalPlayers} players`;
            console.log(msg)
            if (rankDataEle) {
                rankDataEle.innerHTML = msg;
            }
        }
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Add background with options
        this.backgroundManager = new BackgroundManager(this);
        this.backgroundManager.addBackground({
            isGameScene: false,
            addOverlay: false,
            type: 'default'
        });

        const idleColors = {
            idle: {
                ...MAP_CONFIG.idle,
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

        // Get the loaded content
        this.htmlContent = this.cache.text.get('finishHTML');

        this.element = document.createElement('div');

        this.element.innerHTML = this.htmlContent;
        this.element.style.width = '100%';
        this.element.style.height = '100%';


        const gameOverWonTxt = GAMEOVER_TEXT_WON[Phaser.Math.Between(0, GAMEOVER_TEXT_WON.length - 1)];
        const gameOverLostTxt = GAMEOVER_TEXT_LOST[Phaser.Math.Between(0, GAMEOVER_TEXT_LOST.length - 1)];

        const didWon = this.gameStateManager.winner === this.gameStateManager.selectedCharacter;

        const gameOverTxt = didWon ? gameOverWonTxt : gameOverLostTxt
        this.element.querySelector('.header-title').innerHTML = gameOverTxt;

        const player = 'Hey ' + this.gameStateManager.playerName + "!";
        const winLostText = didWon ? player + ' You Won !!!' : player + ' You Lost !';

        let title = this.element.querySelector('#f-title');
        if (title) {
            title.innerHTML = winLostText
        }

        let chadScore = this.element.querySelector('#chad-score');
        if (chadScore) {
            chadScore.innerHTML = `Chad: ${this.gameStateManager.getScore("chad")}`;
        }

        const chadStateCount = this.gameStateManager.wonStates.filter(item => item.character === 'chad').length;
        let chadState = this.element.querySelector('#chad-states');
        if (chadState) {
            chadState.innerHTML = `States: ${chadStateCount}`;
            // chadState.innerHTML = `States: 13`;
        }

        let barryScore = this.element.querySelector('#barry-score');
        if (barryScore) {
            barryScore.innerHTML = `Barry: ${this.gameStateManager.getScore("barry")}`;
        }

        const barryStateCount = this.gameStateManager.wonStates.filter(item => item.character === 'barry').length;
        let barryState = this.element.querySelector('#barry-states');
        if (barryState) {
            barryState.innerHTML = `States: ${barryStateCount}`;
            // barryState.innerHTML = `States: 25`;
        }

        const leaderboardButton = this.element.querySelector('#leaderboard');
        if (leaderboardButton) {
            leaderboardButton.addEventListener('click', (e) => {
                this.scene.start('LeaderboardScene', {
                    parentScene: this.scene.key
                });
            })
        }

        const replayButton = this.element.querySelector('#replay');
        if (replayButton) {
            replayButton.addEventListener('click', (e) => {
                this.restartGame();
            })
        }

        // Add to scene
        this.add.dom(width / 2, height / 2, this.element)
            .setOrigin(0.5);

    }

    restartGame() {
        this.gameStateManager.reset();
        this.scene.stop('ScoreScene');
        this.scene.start('GameScene');
    }
}
