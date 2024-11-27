import MapManager from "../components/MapManager";
import { MAP_CONFIG } from "../config/gameConfig";

export default class FinishScene extends Phaser.Scene {
    constructor() {
        super({ key: 'FinishScene' });
    }

    init(data) {
        this.finalScores = data;
        this.wonStates = this.finalScores.wonStates
    }

    create() {
        // Add background
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8)
            .setOrigin(0);


        const idleColors = {
                idle: {
                    lineColor: 0x5c3a3a,
                    lineStyle: 1,
                    fillStyle: 0x4d4d4d,
                    fillAlpha: 1
                }
            }
        this.mapManager = new MapManager(this, 1.4, 145, idleColors);
        // Create the map
        this.mapManager.createStateMap();

        this.wonStates.forEach((item)=>{
            const color = item.character === 'chad' ? MAP_CONFIG.CHAD_COLOR : MAP_CONFIG.BARRY_COLOR;
            this.mapManager.highlightState(item.state, "", color);
        })


        // Game Over text
        this.add.text(this.scale.width / 2, 80, 'GAME OVER', {
            fontSize: '50px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Final Scores
        this.add.text(this.scale.width / 2, 135, `Chad: ${this.finalScores.chad}`, {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        this.add.text(this.scale.width / 2, 165, `Barry: ${this.finalScores.barry}`, {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Determine winner
        let winnerText = '';
        if (this.finalScores.chadScore > this.finalScores.barryScore) {
            winnerText = 'Chad Wins!';
        } else if (this.finalScores.barryScore > this.finalScores.chadScore) {
            winnerText = 'Barry Wins!';
        } 
        
        this.add.text(this.scale.width / 2, 200, winnerText, {
            fontSize: '48px',
            fill: '#gold',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Play Again button
        const playAgainButton = this.add.text(this.scale.width / 2, 230, 'Play Again', {
            fontSize: '32px',
            fill: '#ffffff',
            backgroundColor: '#444444',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => playAgainButton.setStyle({ fill: '#ff0' }))
        .on('pointerout', () => playAgainButton.setStyle({ fill: '#ffffff' }))
        .on('pointerdown', () => this.restartGame());

         // Add a title for the table
        //  this.add.text(400, 200, 'States Won', {
        //     fontSize: '32px',
        //     fill: '#ffffff'
        // }).setOrigin(0.5);

        // Create the table
        // this.createScrollableWonStatesTable();
    }


    createScrollableWonStatesTable() {
        const startX = 200;
        const startY = 250;
        const tableWidth = 450;
        const tableHeight = 300; // Visible height of the table
        const rowHeight = 40;
        const colWidths = [150, 200, 100];

        // Create a container for the table content
        this.tableContainer = this.add.container(startX, startY);

        // Create a mask for the scrollable area
        const mask = this.make.graphics();
        mask.fillStyle(0xffffff);
        mask.fillRect(startX, startY, tableWidth, tableHeight);
        this.tableContainer.setMask(new Phaser.Display.Masks.GeometryMask(this, mask));

        // Table headers (outside the scrollable area)
        this.createTableCell(0, -rowHeight, 'Character', colWidths[0]);
        this.createTableCell(colWidths[0], -rowHeight, 'State', colWidths[1]);
        this.createTableCell(colWidths[0] + colWidths[1], -rowHeight, 'Seats', colWidths[2]);

        // Table rows
        this.wonStates.forEach((state, index) => {
            const y = index * rowHeight;
            this.createTableCell(0, y, state.character, colWidths[0]);
            this.createTableCell(colWidths[0], y, state.state, colWidths[1]);
            this.createTableCell(colWidths[0] + colWidths[1], y, state.seats.toString(), colWidths[2]);
        });

        // Add scrolling functionality
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            const newY = Phaser.Math.Clamp(
                this.tableContainer.y - deltaY,
                tableHeight - this.tableContainer.height,
                startY
            );
            this.tableContainer.y = newY;
        });

        // Add drag functionality for touch devices
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            const newY = Phaser.Math.Clamp(
                dragY,
                tableHeight - this.tableContainer.height + startY,
                startY
            );
            this.tableContainer.y = newY;
        });

        // Make the table container interactive for drag
        this.tableContainer.setInteractive(new Phaser.Geom.Rectangle(0, 0, tableWidth, this.tableContainer.height), Phaser.Geom.Rectangle.Contains);
        this.input.setDraggable(this.tableContainer);
    }

    createTableCell(x, y, content, width) {
        const cellPadding = 10;
        const cellHeight = 40;

        // Cell background
        const cellBg = this.add.rectangle(x, y, width, cellHeight, 0x333333).setOrigin(0);

        // Cell text
        const cellText = this.add.text(x + cellPadding, y + cellPadding, content, {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0);

        this.tableContainer.add([cellBg, cellText]);
    }

    restartGame() {
        this.scene.stop('ScoreScene');
        this.scene.start('GameScene');
    }
}
