/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */


import { PRIMARY_TEXT_COLOR, SEC_TEXT_COLOR, FONT_FAMILY, NAME_ALREADY_EXIST_MSG } from "../config/gameConfig";
import StandardButton from "../objects/StandardButton";
import { addBackground, getFingerprint, isIphone } from "../utils/helpers";
import GameStateManager from '../managers/GameStateManager';
import { checkNameAlreadyExists } from "../api/api";
import { OrientationManager } from "../managers/OrientationManager";
import { BackgroundManager } from "../managers/BackgroundManager";
import { MAX_MOBILE_WIDTH } from "../config/gameConfig";
import SettingsButton from "../objects/SettingsButton";
import StorageManager from "../managers/StorageManager";


export default class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
        this.gameStateManager = GameStateManager.getInstance();
        this.playerName = '';
        this.labelbtn = null;
        this.inputElement = null;
        this.boundHandleInput = null;
        this.boundHandleOutsideClick = null;
        this.checking = false;
    }

    create() {
        const { width, height } = this.cameras.main;
        this.isMobile = width < MAX_MOBILE_WIDTH;

        this.initializeScene(width, height);
        this.createUI(width, height);
        this.eventListeners();
    }

    initializeScene(width, height) {
        // Initialize background and audio
        this.backgroundManager = new BackgroundManager(this);
        this.backgroundManager.addBackground({
            isGameScene: false,
            addOverlay: false,
            type: 'default'
        });

        this.gameStateManager.initializeAudio(this);
        this.gameStateManager.playSound('background', {
            volume: 0.1,
            loop: true,
        });
    }

    createUI(width, height) {
        this.createHeaders(width, height);
        this.createInputField(width, height);
        this.createStartButton(width, height);
    }

    createHeaders(width, height) {
        const styles = {
            headA: {
                fontSize: this.isMobile ? '14px' : '28px',
                fill: '#1873ab',
                fontFamily: FONT_FAMILY,
                stroke: '#ffffff',
                strokeThickness: 1
            },
            headB: {
                fontSize: this.isMobile ? '40px' : '80px',
                fill: PRIMARY_TEXT_COLOR,
                fontFamily: FONT_FAMILY,
                stroke: '#000000',
                strokeThickness: 2
            }
        };

        const headAYpos = this.isMobile ? height * 0.3 : height * 0.25;
        
        this.headA = this.add.text(
            width / 2, 
            headAYpos, 
            'AWS Game Builder Challenge', 
            styles.headA
        ).setOrigin(0.5);

        this.headB = this.add.text(
            width / 2, 
            height * 0.37, 
            'CHAD & BARRY', 
            styles.headB
        ).setOrigin(0.5);
    }


    createInputField(width, height) {
        const yOffset = this.isMobile ? 0 : 20;
        
        // Create label
        this.createInputLabel(width, height, yOffset);
        
        // Create input element
        this.createInputElement(width, height, yOffset);
        
        // Create validation message
        this.createValidationMessage(width, height, yOffset);
    }

    createInputLabel(width, height, yOffset) {
        return this.add.text(
            width / 2 - 120, 
            height * 0.45 + yOffset, 
            'Enter your name', 
            {
                fontSize: '24px',
                color: '#1873ab',
                fontFamily: FONT_FAMILY
            }
        );
    }

    createInputElement(width, height, yOffset) {
        this.inputElement = document.createElement('input');
        Object.assign(this.inputElement, {
            type: 'text',
            style: this.getInputStyles(),
            maxLength: 10
        });

        this.inputElement.setAttribute('autofocus', 'true');
        
        const input = this.add.dom(
            width / 2, 
            height * 0.52 + yOffset, 
            this.inputElement
        ).setVisible(true);

        this.setupInputValidation(input);
    }

    getInputStyles() {
        return `
            width: 240px;
            height: 30px;
            font-size: 20px;
            padding: 5px;
            border: 1px solid rgb(50, 62, 68);
            border-radius: 5px;
            background-color: #456f7ed9;
            color: #ffffff;
            outline: none;
            text-align: center;
            font-family: ${FONT_FAMILY};
        `;
    }

    setupInputValidation(input) {
        this.boundHandleInput = this.handleInput.bind(this);
        this.inputElement.addEventListener('input', this.boundHandleInput);

        this.boundHandleOutsideClick = this.handleOutsideClick.bind(this, input);
        this.input.on('pointerdown', this.boundHandleOutsideClick);
    }

    handleInput(e) {
        const value = e.target.value;
        this.playerName = value;
        this.gameStateManager.playerName = value;

        if (value.length > 2) {
            const nameRegex = /^[A-Za-z0-9]+$/;
            const isValid = nameRegex.test(value);
            
            this.updateValidationUI(isValid);
        } else {
            this.startButton.setVisibility(false);
        }
    }

    createValidationMessage(width, height, yOffset) {
        // Create validation message text
        this.labelbtn = this.add.text(
            width / 2,
            height * 0.58 + yOffset,
            'Max 10 Characters',
            {
                fontSize: '14px',
                fill: '#FFA500', // Orange color
                fontFamily: FONT_FAMILY,
                align: 'center'
            }
        ).setOrigin(0.5);
    
        // Add method to update validation message
        this.labelbtn.updateMessage = (message, color = '#FFA500') => {
            this.labelbtn.setText(message);
            this.labelbtn.setColor(color);
        };
    
        return this.labelbtn;
    }
    

    updateValidationUI(isValid) {
        this.labelbtn.setText(isValid ? 'Max 10 Characters' : 'Only letters and numbers please!');
        this.startButton.setVisibility(isValid);
    }

    handleOutsideClick(input, pointer) {
        const rect = input.node.getBoundingClientRect();
        if (this.isClickOutside(pointer, rect)) {
            this.inputElement.blur();
        }
    }

    isClickOutside(pointer, rect) {
        return pointer.x < rect.left || 
               pointer.x > rect.right || 
               pointer.y < rect.top || 
               pointer.y > rect.bottom;
    }

    createStartButton(width, height) {
        const startYpos = this.isMobile ? 0.64 : 0.67;
        this.startButton = new StandardButton(this, width / 2, height * startYpos, 'Start', {
            onClick: this.handleStartClick.bind(this),
            visible: false
        });
    }

    async handleStartClick() {
        if(this.checking) return;
        this.checking = true
        try {
            const uid = await getFingerprint();
            this.gameStateManager.uid = uid;
            this.startButton.setText('Checking...');

            const exists = await checkNameAlreadyExists(this.playerName, uid);
            this.checking = false;
            
            if (exists) {
                this.handleNameExists();
                return;
            }

            this.startGame();
        } catch (error) {
            console.error('Error during start:', error);
            this.startGame(); // Fallback to starting game anyway
        }
    }

    handleNameExists() {
        // const alreadyExistTxt = NAME_ALREADY_EXIST_MSG[
        //     Phaser.Math.Between(0, NAME_ALREADY_EXIST_MSG.length - 1)
        // ];
        this.labelbtn.setText('Sorry that name is taken, try another one.');
        this.startButton.setText('Start');
    }

    startGame() {
        this.scene.start('StartScene', {
            parentScene: this,
            playerName: this.playerName
        });
    }

    handleResize(obj) {
        const newWidth = obj?.width || this.cameras.main.width;
        const newHeight = obj?.height || this.cameras.main.height;

        if (newWidth < MAX_MOBILE_WIDTH) {
            this.backgroundManager?.resize(newWidth, newHeight);
        }
    }

    shutdown() {
        // Clean up event listeners
        this.game.events.removeListener('orientationupdate');
        this.inputElement?.removeEventListener('input', this.boundHandleInput);
        this.input.removeListener('pointerdown', this.boundHandleOutsideClick);
        
        // Clean up DOM elements
        this.inputElement?.remove();
        this.inputElement = null;
    }




    eventListeners() {

        // Listen for orientation changes
        this.game.events.on('orientationupdate', this.handleOrientation, this);
        this.game.events.on('widthchange', this.handleResize, this);

        // Initial layout
        const orientationManager = OrientationManager.getInstance();
        if (orientationManager) {
            this.handleOrientation(orientationManager.isPortrait);
        }
        this.handleResize();

    }

    handleResize(obj) {
        const newWidth = obj ? obj.width : this.cameras.main.width;
        const newHeight = obj ? obj.height : this.cameras.main.height;

        if (newWidth < MAX_MOBILE_WIDTH) {
            // Update background
            if (this.backgroundManager) {
                this.backgroundManager.resize(newWidth, newHeight);
            }
            // this.infoButton.setYPosition(50)
            // this.headA.setY(newHeight * 0.30)
        }
    }


    handleOrientation(isLandscape) {
        // const width = this.cameras.main.width;
        // const height = this.cameras.main.height;

        // Adjust your UI elements based on orientation
        if (isLandscape) {
            // Portrait layout adjustments
        } else {
            // Landscape layout adjustments
        }
        // setTimeout(() => {
        //     this.handleResize()
        // }, 100)
    }

}



