/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */


import { createCloseButton, capitalizeWords } from "../utils/helpers";
import { FONT_FAMILY } from "../config/gameConfig";
import { fetchLeaderboard } from "../api/api";
import GameStateManager from "../managers/GameStateManager";
import {BackgroundManager} from "../managers/BackgroundManager";

export default class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LeaderboardScene' });
        this.gameStateManager = GameStateManager.getInstance();
        this.loadingText = null;
    }

    init(data) {
        this.parentScene = data.parentScene;
    }

    async create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Add background with options
        this.backgroundManager = new BackgroundManager(this);
        this.backgroundManager.addBackground({
            isGameScene: false,
            addOverlay: true,
            type: 'default'
        });

        // Get the loaded content
        this.htmlContent = this.cache.text.get('leaderboardHTML');

        this.element = document.createElement('div');

        this.element.innerHTML = this.htmlContent;
        this.element.style.width = '100%';
        this.element.style.height = '100%';

        // Add click handler for close button
        const closeButton = this.element.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.closeScene(this, this.parentScene)
            });
        }

        // Add to scene
        this.add.dom(width / 2, height / 2,this.element)
            .setOrigin(0.5);

        // Clean up when scene is shut down
        this.events.on('shutdown', () => {

        });


        try {
            const scores = await fetchLeaderboard(this.gameStateManager.difficultyLevel);

            let tr = "";

            scores.forEach((score, index) => {
                const date = new Date(score.timestamp);
                const formattedDate = date.toLocaleDateString() + ' ' +
                    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                tr = tr + `<tr>
                        <td data-label="Rank">${index + 1}</td>
                        <td data-label="Player">${score.playerName}</td>
                        <td data-label="Character">${score.selectedCharacter}</td>
                        <td data-label="States">${score.statesWon}</td>
                        <td data-label="Opponent">${score.opponent}</td>
                        <td data-label="Date">${formattedDate}</td>
                    </tr>`
            });
            const tBody = `<tbody>
                            ${tr}
                            </tbody>`;

            this.element.querySelector('#tbody').innerHTML = tBody;

            this.element.querySelector('.header-title').innerHTML = `Leaderboard "${ this.gameStateManager.difficultyLevel}"`
            this.element.querySelector('.loading').style.padding = "20% 0";
            this.element.querySelector('.loading').innerHTML = "";


        } catch (error) {
            this.element.querySelector('.loading').innerHTML = error
        }
    }


    closeScene(scene, parentScene) {
        if (parentScene) {
            scene.scene.start(parentScene);
        }
        scene.scene.sleep();
    }



    createScoreRow(scoreData, index) {
        const { x, y, width, columns, rowHeight, headerHeight } = this.tableConfig;
        const rowY = y + headerHeight + (index * rowHeight);

        // Create row background with alternating colors
        const bgColor = index % 2 === 0 ? 0x34495e : 0x2c3e50;
        this.add.rectangle(x, rowY, width, rowHeight, bgColor, 0.7)
            .setOrigin(0, 0);

        // Format date
        const date = new Date(scoreData.timestamp);
        const formattedDate = date.toLocaleDateString() + ' ' +
            date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Map score data to columns
        const rowData = {
            playerName: scoreData.playerName,
            selectedCharacter: capitalizeWords(scoreData.selectedCharacter),
            yourScore: scoreData.opponent,
            // yourScore: scoreData.score[scoreData.selectedCharacter],
            statesWon: scoreData.statesWon,
            date: formattedDate,
            rank: index + 1 //scoreData.gameId.slice(-6)
        };

        // Add cell texts
        let currentX = x;
        columns.forEach(column => {
            const columnWidth = width * column.width;
            this.add.text(currentX + 10, rowY + rowHeight / 2,
                rowData[column.key], {
                fontSize: '18px',
                color: '#ffffff',
                fontFamily: 'Arial'
            })
                .setOrigin(0, 0.5);
            currentX += columnWidth;
        });

        this.loadingText.setVisible(false)
    }
}
