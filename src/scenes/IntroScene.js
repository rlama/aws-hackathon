/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */


import { PRIMARY_TEXT_COLOR, SEC_TEXT_COLOR, FONT_FAMILY } from "../config/gameConfig";
import StandardButton from "../objects/StandardButton";
import { addBackground, getFingerprint } from "../utils/helpers";
import GameStateManager from '../components/GameStateManager';
import { checkNameAlreadyExists } from "../api/api";



export default class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
        this.gameStateManager = GameStateManager.getInstance();
        this.playerName="";
        this.labelbtn=null;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        addBackground(this, width, height, false, 'gamescene')

        this.gameStateManager.initializeAudio(this);
        this.gameStateManager.playSound('background',{
            volume: 0.1,
            loop: true,
        })

          // Add character names
          this.add.text(width/2, height * 0.25, 'AWS Game Builder Challenge', {
            fontSize: '24px',
            fill: PRIMARY_TEXT_COLOR,
            fontFamily: FONT_FAMILY,
            stroke: '#ffffff',
            strokeThickness: 1
        }).setOrigin(0.5);

        this.add.text(width/2, height * 0.37, 'CHAD & BARRY', {
            fontSize: '80px',
            fill: PRIMARY_TEXT_COLOR,
            fontFamily: FONT_FAMILY,
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        // Add info button
        this.goButton = new StandardButton(this, width/2, height * 0.7, 'Start', {
            onClick: async () => {
                try {
                    // Add uid
                    const uid = await getFingerprint();
                    this.gameStateManager.uid = uid;

                    // Update button text
                    this.goButton.setText('Checking...');
        
                    // Check if name exists
                    const exists = await checkNameAlreadyExists(this.playerName, uid);
                    
                    if (exists) {
                        this.labelbtn.setText('Name already taken. Choose another name.');
                        this.goButton.setText('Start');
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
            visible: false,
            width: 200
        });

        this.addInputField(width, height)
    
        // Add info button
        const infoButton = new StandardButton(this, width - 45, 30, 'info', {
            onClick: () => {
                this.scene.start('GameInfoScene', {
                    parentScene: this
                });
            }
        });
    }

    addInputField(width, height){
        // Add label
        const label = this.add.text(width/2 - 120, height * 0.5, 'Enter your name', {
            fontSize: '24px',
            color: SEC_TEXT_COLOR,
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
            border: 2px solid rgb(50, 62, 68);
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
        const input = this.add.dom(width/2, height * 0.58, inputElement);
        // input.setDepth(9)

        // Make sure DOM element is visible
        input.setVisible(true);

         //Focus with a slight delay (more reliable)
         this.time.delayedCall(100, () => {
            inputElement.focus();
        });

        // Optional: Add focus/blur effects
        inputElement.addEventListener('focus', () => {
            inputElement.style.background = '#3a7a91d9';
            inputElement.style.border = 'rgb(50, 62, 68)'
        });

        inputElement.addEventListener('blur', () => {
            inputElement.style.background = '#456f7ed9';
            // inputElement.style.border = '2px solid #fff';
        });

        // Optional: Handle input changes
        inputElement.addEventListener('input', (e) => {
            // console.log('Current value:', e.target.value);
            this.playerName = e.target.value;
            this.gameStateManager.playerName = this.playerName;

            if(this.playerName.length > 2){
                this.goButton.setVisibility(true)
            }else{
                this.goButton.setVisibility(false)
            }
        });


        this.labelbtn = this.add.text(width/2, height * 0.63, 'Max 10 Characters', {
            fontSize: '14px',
            color: 'orange',
            fontFamily: FONT_FAMILY,
            fontWeight: 'bold'
        });
        this.labelbtn.setOrigin(0.5);
    }


}


