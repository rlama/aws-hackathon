/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */

import { addBackground, createCloseButton, capitalizeWords } from "../utils/helpers";
import StandardButton from "../objects/StandardButton";
import { FONT_FAMILY, EMOJI_TYPES, ALL_STATES } from "../config/gameConfig";

export default class GameInfoScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameInfoScene' });
        this.scrolling = false;
        this.lastY = 0;
    }

    init(data) {
        // Store the scene stack if provided
        this.sceneStack = data.sceneStack || [];
        if (data.previousScene && !this.sceneStack.includes(data.previousScene)) {
            this.sceneStack.push(data.previousScene);
            this.previousScene = data.previousScene;
        }
        this.parentScene = data.parentScene || null
    }


    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Add semi-transparent background that covers the entire scene
        // const overlay = this.add.rectangle(
        //     0, 0, width, height,
        //     0x000000, 0.8
        // ).setOrigin(0);

        addBackground(this, width, height);

        // Create a container for all content
        this.contentContainer = this.add.container(0, 0);

        // Define container width (adjust as needed)
        const containerWidth = width; // 80% of screen width
        const containerPadding = 20; // Padding from edges


        // Title (fixed position, outside container)
        const title = this.add.text(
            width / 2,
            40,
            'How to Play',
            {
                fontSize: width <= 700 ? '20px' : '48px',
                fill: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000',
                    strokeThickness: 3,
                fontFamily: FONT_FAMILY
            }
        ).setOrigin(0.5);

        title.setDepth(1);     // Ensure it's above game elements


        // Game instructions
        const instructions = [
            { type: 'h', text: "- Pick Your Candidate:" },
            { type: 'p', text: "Choose between Chad or Barry before the game begins. \n The  unselected character will auto-play as your rival." },
            { type: 'h', text: "- Catch the Votes: " },
            { type: 'p', text: "Click mouse or press 'm' key to open your character's mouth and collect falling items to score points. Press 'Spacebar' key or the 'Gear ⚙' icon to pause game and see the game settings." },
            { type: 'h', text: "- Avoid Onions 🧅:" },
            { type: 'p', text: "Onions are trouble! Eating one will disable your character for 3.5 seconds." },
            { type: 'h', text: "- Difficulty Levels" },
            { type: 'p', text: "There are 3 difficulty levels, Beginner, Intermeidate and Expert. In intermeidate and expert levels the opponent or robot gets smarter and takes less time to wake up after the onion trap." },
            { type: 'h', text: "- Win the States 🗺️" },
            { type: 'p', text: "Earn enough points to light up U.S. states on the map." },
            { type: 'p', extraRow: true, text: "The first to reach 270 points wins the game!" },

            { type: 'h', text: "- Leaderboard Rules 🏆" },
            { type: 'p', text: "Only winners make the leaderboard." },
            { type: 'p', text: "Rankings are based on the most states won." },
            { type: 'p', text: "If tied, the opponent's points decide the champion!" },

            { type: 'p', text: "Ready to race, collect, and win? Let the Chad & Barry showdown begin! 🚀" }
        ];

        // Add instructions text to container with proper alignment and word wrap
        this.yPosition = 120;
        instructions.forEach(instruction => {
            const text = this.add.text(
                containerPadding, // Left padding
                this.yPosition,
                instruction.text,
                {
                    fontSize: instruction.type === 'h' ? '30px' : '20px',
                    fill: '#ffffff',
                    align: 'left',
                    stroke: '#000000',
                    strokeThickness: 3,
                    fontStyle: instruction.type === 'h' ? 'bold' : 'normal',
                    wordWrap: {
                        width: containerWidth - (containerPadding * 2),
                        useAdvancedWrap: true
                    }
                }
            ).setOrigin(0);

            this.contentContainer.add(text);
            const extraRow = instruction.extraRow ? 50 : 0;
            this.yPosition += text.height + 10 + extraRow; // Dynamic spacing based on text height
        });

        // add points guide
        this.yPosition += 30;
        this.addPointsGuide(containerWidth, containerPadding, '- Points Guide:', EMOJI_TYPES)



        this.yPosition -= 30;
        const statesPoint = ALL_STATES.map(state => ({
            item: `${state.name}`,
            points: state.seats.toString()
        }));
        this.addPointsGuide(containerWidth, containerPadding, '- Votes required to win state:', statesPoint)


        createCloseButton(this, this.parentScene)


        // Leaderboard button
        const leaderboardButton = new StandardButton(this, 110, 40, 'Leaderboard', {
            backgroundColor: 0x3498db,
            onClick: () => {
                this.scene.start('LeaderboardScene', {
                    parentScene: this.scene.key
                });
            }
        });


        // Set up scrolling interaction
        this.input.on('pointerdown', (pointer) => {
            this.scrolling = true;
            this.lastY = pointer.y;
        });

        this.input.on('pointermove', (pointer) => {
            if (this.scrolling) {
                const deltaY = pointer.y - this.lastY;
                this.contentContainer.y += deltaY;

                // Clamp the container position
                const minY = height - this.yPosition - 100; // Bottom boundary
                const maxY = 0; // Top boundary
                this.contentContainer.y = Phaser.Math.Clamp(this.contentContainer.y, minY, maxY);

                this.lastY = pointer.y;
            }
        });

        this.input.on('pointerup', () => {
            this.scrolling = false;
        });

        // Add mouse wheel support
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            this.contentContainer.y -= deltaY;

            // Clamp the container position
            const minY = height - this.yPosition - 100; // Bottom boundary
            const maxY = 0; // Top boundary
            this.contentContainer.y = Phaser.Math.Clamp(this.contentContainer.y, minY, maxY);
        });

        // Add keyboard handler for ESC key
        this.input.keyboard.on('keydown-ESC', () => {
            this.closeInfoScene();
        });

        // Add scroll indicators if content is taller than screen
        if (this.yPosition > height) {
            const scrollIndicator = this.add.text(
                width - 20,
                height / 2,
                '⬍',
                {
                    fontSize: '32px',
                    fill: '#ffffff'
                }
            )
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setAlpha(0.6);

            // Make indicator pulse
            this.tweens.add({
                targets: scrollIndicator,
                alpha: 0.2,
                duration: 1000,
                yoyo: true,
                repeat: -1
            });
        }
    }



    addPointsGuide(containerWidth, containerPadding, title, list) {

        // Calculate column widths and positions
        const columnWidth = (containerWidth - (containerPadding * 2)) / 3;
        const columns = [[], [], []];

        // Distribute items into columns
        list.forEach((item, index) => {
            columns[index % 3].push(item);
        });

        // Add points guide header
        this.yPosition += 20;
        const pointsHeader = this.add.text(
            containerPadding,
            this.yPosition,
            title,
            {
                fontSize: '32px',
                fill: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000', // Black outline
                strokeThickness: 3, // Thickness of the outline
            }
        ).setOrigin(0);
        this.contentContainer.add(pointsHeader);

        // Add columns
       this.yPosition += 50;
        const startY = this.yPosition;

        columns.forEach((column, columnIndex) => {
            let columnY = startY;
            const columnX = containerPadding + (columnWidth * columnIndex);

            column.forEach(item => {
                const itemTxt = title.includes('Points Guide') ? `${capitalizeWords(item.type)} ${item.emoji} ${item.points}` : `${item.item} ${item.points}`;  
                const itemText = this.add.text(
                    columnX,
                    columnY,
                    itemTxt,  // Combined item and points on same line
                    {
                        fontSize: '18px',
                        fill: '#ffffff',
                        stroke: '#000000', // Black outline
                        strokeThickness: 3, // Thickness of the outline
                        align: 'left',
                        wordWrap: {
                            width: columnWidth - 20,
                            useAdvancedWrap: true
                        },
                        lineSpacing: -8
                    }
                ).setOrigin(0);

                this.contentContainer.add(itemText);
                columnY += itemText.height + 10;
            });
        });

        // Update yPosition to the bottom of the longest column
        const maxColumnHeight = Math.max(...columns.map(column =>
            column.reduce((height, item) => height + 60, 0)
        ));
        this.yPosition += maxColumnHeight;
    }


    createTextButton(x, y, message, backgroundColor = 0x000000, textColor = '#ffffff') {
        // Create container for background and text
        const container = this.add.container(x, y);

        // Add text first to get its width for the background
        const text = this.add.text(0, 0, message, {
            fontFamily: 'Arcade',
            fontSize: '24px',
            color: textColor
        }).setOrigin(0.5);

        // Create background with padding
        const padding = 16;
        const borderRadius = 16;
        const width = text.width + (padding * 2);
        const height = text.height + (padding * 2);

        // Create rounded rectangle background
        const background = this.add.graphics();
        background.fillStyle(backgroundColor, 0.7);
        background.fillRoundedRect(
            -(width / 2),
            -(height / 2),
            width,
            height,
            borderRadius
        );

        // Add both to container (order matters - background first, then text)
        container.add(background);
        container.add(text);

        // Make it interactive if needed
        container.setInteractive(
            new Phaser.Geom.Rectangle(
                -(width / 2),
                -(height / 2),
                width,
                height
            ),
            Phaser.Geom.Rectangle.Contains
        );

        return container;
    }



    handleBack() {
        if (this.sceneStack.length > 0) {
            const previousScene = this.sceneStack.pop();
            console.log("$$$$$$$$$$$$$")
            console.log(previousScene)
            this.scene.stop();
            this.scene.start(previousScene);

            // this.scene.stop('GameInfoScene');
            // this.scene.resume(previousScene);
            // this.scene.bringToTop(previousScene);
        } else {
            // Default fallback if no previous scene
            this.scene.start('StartScene');
        }
    }

    closeInfoScene() {
        this.scene.start('StartScene');
    }
}
