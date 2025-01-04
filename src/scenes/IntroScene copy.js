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
        this.playerName = "";
        this.labelbtn = null;
    }

    create() {

        const { width, height } = this.cameras.main;

        // Create background manager and add background with options
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
        })

        // Add character names
        const headAYpos = width < MAX_MOBILE_WIDTH ? height * 0.3 : height * 0.25;
        this.headA = this.add.text(width / 2, headAYpos, 'AWS Game Builder Challenge', {
            fontSize: width < MAX_MOBILE_WIDTH ? '14px' : '28px',
            fill: '#1873ab',
            fontFamily: FONT_FAMILY,
            stroke: '#ffffff',
            strokeThickness: 1
        }).setOrigin(0.5);

        this.headB = this.add.text(width / 2, height * 0.37, 'CHAD & BARRY', {
            fontSize: width < MAX_MOBILE_WIDTH ? '40px' : '80px',
            fill: PRIMARY_TEXT_COLOR,
            fontFamily: FONT_FAMILY,
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        const yOffset = width < MAX_MOBILE_WIDTH ? 0 : 20
        this.addInputField(width, height, yOffset)


        const startYpos = width < MAX_MOBILE_WIDTH ? 0.64 : 0.67;
        this.startButton = new StandardButton(this, width / 2, height * startYpos, 'Start', {
            onClick: async () => {
                try {
                    // Add uid
                    const uid = await getFingerprint();
                    this.gameStateManager.uid = uid;

                    // Update button text
                    this.startButton.setText('Checking...');


                    // Check if name exists
                    const exists = await checkNameAlreadyExists(this.playerName, uid);

                    if (exists) {

                        const alreadyExistTxt = NAME_ALREADY_EXIST_MSG[Phaser.Math.Between(0, NAME_ALREADY_EXIST_MSG.length - 1)];

                        this.labelbtn.setText(alreadyExistTxt);
                        this.startButton.setText('Start');
                        return;
                    }

                    // Debug FinishScene
                    // this.scene.start('FinishScene', {});

                    // Start game if name is available
                    this.scene.start('StartScene', {
                        parentScene: this,
                        playerName: this.playerName
                    });

                } catch (error) {
                    // If any error occurs, start the game anyway
                    this.scene.start('StartScene', {
                        parentScene: this,
                        playerName: this.playerName
                    });
                }
            },
            visible: false
        });

        // Add settings button
        // let ypos =  width < MAX_MOBILE_WIDTH ?  55 : 30;
        // ypos =  isIphone() ? ypos +5 : ypos;
        // this.settingsButton = new SettingsButton(this, width - 45, ypos, false)

        this.eventListeners();

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

    addInputField(width, height, yOffset) {
        // Add label
        const label = this.add.text(width / 2 - 120, height * 0.45 + yOffset, 'Enter your name', {
            fontSize: '24px',
            color: '#1873ab',
            fontFamily: FONT_FAMILY
        });

        // Create HTML input element
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.style = `
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

        // Add autofocus attribute
        inputElement.setAttribute('autofocus', 'true');

        // Add input to the game using DOM element
        const input = this.add.dom(width / 2, height * 0.52 + yOffset, inputElement);


        // Make sure DOM element is visible
        input.setVisible(true);

        //Focus with a slight delay (more reliable)
        // this.time.delayedCall(100, () => {
        //     inputElement.focus();
        // });

        inputElement.addEventListener('click', () => {
            inputElement.focus();
        });

        // Add blur when tapping outside
        this.input.on('pointerdown', (pointer) => {
            // Get the actual DOM element from the Phaser DOM game object
            const inputElement = input.node;
            const rect = inputElement.getBoundingClientRect();

            // Check if the tap is outside the input field
            if (pointer.x < rect.left ||
                pointer.x > rect.right ||
                pointer.y < rect.top ||
                pointer.y > rect.bottom) {
                inputElement.blur();
            }
        });


        // Optional: Handle input changes
        inputElement.addEventListener('input', (e) => {
            // console.log('Current value:', e.target.value);
            this.playerName = e.target.value;
            this.gameStateManager.playerName = this.playerName;

            if (this.playerName.length > 2) {

                // Allow only letters and numbers
                const nameRegex = /^[A-Za-z0-9]+$/;
                if (!nameRegex.test(e.target.value)) {
                    this.labelbtn.setText('Only letters and numbers please!');
                    this.startButton.setVisibility(false)
                }else{
                    this.startButton.setVisibility(true)
                }

            } else {
                this.startButton.setVisibility(false)
            }
        });


        this.labelbtn = this.add.text(width / 2, height * 0.58 + yOffset, 'Max 10 Characters', {
            fontSize: '14px',
            color: 'orange',
            fontFamily: FONT_FAMILY,
            fontWeight: 'bold'
        });
        this.labelbtn.setOrigin(0.5);
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

    shutdown() {
        // Clean up
        this.game.events.removeListener('orientationupdate');
    }


}


