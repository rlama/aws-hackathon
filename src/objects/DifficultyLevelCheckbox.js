/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */


import { PRIMARY_TEXT_COLOR, FONT_FAMILY } from "../config/gameConfig";
import GameStateManager from "../components/GameStateManager";

export default class DifficultyLevelCheckbox extends Phaser.Scene {
    constructor() {
        super({ key: 'DifficultyLevelCheckbox' });
        this.gameStateManager = GameStateManager.getInstance();
        this.selectedDifficulty = 'beginner'; // Default difficulty
        this.difficultyContainers = [];
    }

    create(width, height, scene) {
        this.createDifficultySelection(width, height, scene);
    }

    createDifficultySelection(width, height, scene) {
        // Add difficulty title
        // scene.add.text(width / 2, height * 0.8, 'Select Difficulty', {
        //     fontSize: '28px',
        //     fill: PRIMARY_TEXT_COLOR,
        //     fontFamily: FONT_FAMILY,
        //     stroke: '#000000',
        //     strokeThickness: 4,
        //     letterSpacing: 10
        // }).setOrigin(0.5);

        // Difficulty options
        const difficulties = [
            { key: 'beginner', text: 'Beginner', x: width * 0.16 },
            { key: 'intermediate', text: 'Intermediate', x: width * 0.4 },
            { key: 'expert', text: 'Expert', x: width * 0.7 }
        ];

        // Create radio buttons for each difficulty
        difficulties.forEach(diff => {
            this.createRadioButton(diff.x, height * 0.84, diff.key, diff.text, scene);
        });
    }

    createRadioButton(x, y, key, text, scene) {
        const container = scene.add.container(x, y);
        
        // Create radio button circle
        const circle = scene.add.circle(0, 0, 12);
        circle.setStrokeStyle(2, 0xffffff);
        
        // Create inner circle for selected state
        const innerCircle = scene.add.circle(0, 0, 6, 0xffffff);
        innerCircle.visible = (key === this.selectedDifficulty);
    
        // Add text label
        const label = scene.add.text(25, 0, text, {
            fontSize: '24px',
            fill: PRIMARY_TEXT_COLOR,
            fontFamily: FONT_FAMILY,
            stroke: '#000000',
            strokeThickness: 4,
            letterSpacing: 4
        }).setOrigin(0, 0.5);
    
        // Add all elements to container
        container.add([circle, innerCircle, label]);
    
        // Make both circle and label interactive
        circle.setInteractive({ useHandCursor: true });
        label.setInteractive({ useHandCursor: true });
    
        // Single handler for both circle and label clicks
        const handleClick = () => {
            this.selectedDifficulty = key;
            this.updateDifficultySelection(key);
            this.gameStateManager.difficultyLevel=this.selectedDifficulty;
        };
    
        // Add click handlers
        circle.on('pointerdown', handleClick);
        label.on('pointerdown', handleClick);
    
        // Hover effects
        circle.on('pointerover', () => {
            circle.setStrokeStyle(2, 0x00ff00);
        });
        circle.on('pointerout', () => {
            circle.setStrokeStyle(2, 0xffffff);
        });
    
        // Store reference to inner circle for updating later
        container.innerCircle = innerCircle;
        
        // Store reference to the container
        if (!this.difficultyContainers) {
            this.difficultyContainers = [];
        }
        this.difficultyContainers.push(container);
    }
    
    updateDifficultySelection(selectedKey) {
        // Update all radio buttons immediately
        this.difficultyContainers.forEach(container => {
            const text = container.list[2].text.toLowerCase();
            container.innerCircle.visible = (text === selectedKey);
        });
    }

    updateRadioButtons() {
        this.difficultyContainers.forEach(container => {
            const text = container.list[2].text.toLowerCase();
            container.innerCircle.visible = (text === this.selectedDifficulty);
        });
    }

    getSelectedDifficulty() {
        return this.selectedDifficulty;
    }
}
