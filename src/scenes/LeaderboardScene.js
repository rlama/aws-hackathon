/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */


import { addBackground, createCloseButton, capitalizeWords } from "../utils/helpers";
import { FONT_FAMILY } from "../config/gameConfig";
import { fetchLeaderboard } from "../api/api";
import GameStateManager from "../components/GameStateManager";

export default class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LeaderboardScene' });
        this.gameStateManager = GameStateManager.getInstance();
        this.loadingText=null;
    }

    init(data) {
        this.parentScene = data.parentScene;
    }

    async create() {
        const width = this.scale.width;
        const height = this.scale.height;

        addBackground(this, width, height);

        // Add title
        const titleTxt = `Top Ten "${this.gameStateManager.difficultyLevel}" Winner`;
        this.add.text(width / 2, 50, titleTxt, {
            fontSize: '32px',
            color: '#ffffff',
            fontFamily: FONT_FAMILY,
            fontWeight: 'bold'
        }).setOrigin(0.5)
            .setDepth(1)


        // Loading Text
        const loadingTxt = `Loading ...`;
        this.loadingText = this.add.text(width / 2, 300, loadingTxt, {
            fontSize: '32px',
            color: '#ffffff',
            fontFamily: FONT_FAMILY,
            fontWeight: 'bold'
        }).setOrigin(0.5)
            .setDepth(0)
            .setVisible(true)


        // Define table structure with percentages
        this.tableConfig = {
            x: width * 0.05, // 5% margin from left
            y: 100,
            width: width * 0.9, // 90% of game width
            columns: [
                { key: 'rank', title: 'Rank', width: 0.10 }, // 15%
                { key: 'playerName', title: 'Player', width: 0.18 }, // 20% of table width
                { key: 'selectedCharacter', title: 'Character', width: 0.15 }, // 15%
                { key: 'statesWon', title: 'States won', width: 0.15 }, // 15%
                { key: 'yourScore', title: 'Opponent score', width: 0.15 }, // 15%
                { key: 'date', title: 'Date', width: 0.20 } // 20%
            ],
            rowHeight: 40,
            headerHeight: 50
        };

        // Create table
        this.createTable();

        try {
            const scores = await fetchLeaderboard(this.gameStateManager.difficultyLevel);

            console.log(scores)

            // Display scores
            scores.forEach((score, index) => {
                this.createScoreRow(score, index);
            });

            createCloseButton(this, this.parentScene);

        } catch (error) {

            this.add.text(width / 2, 200, error, {
                fontSize: '15px',
                color: '#ff8735'
            }).setOrigin(0.5, 0.5);

            this.loadingText.setVisible(false)
            createCloseButton(this, this.parentScene);

        }

    }

    createTable() {
        const { x, y, width, columns, headerHeight } = this.tableConfig;

        // Create header background
        this.add.rectangle(x, y, width, headerHeight, 0x2c3e50)
            .setOrigin(0, 0);

        // Add header texts
        let currentX = x;
        columns.forEach(column => {
            const columnWidth = width * column.width;
            this.add.text(currentX + 10, y + headerHeight / 2, column.title, {
                fontSize: '15px',
                color: 'gold',
                fontFamily: 'Arial'
            }).setOrigin(0, 0.5);
            currentX += columnWidth;
        });
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
