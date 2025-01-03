/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */


import { PRIMARY_TEXT_COLOR, FONT_FAMILY, SHOW_SPRITE_DEBUG, MAX_MOBILE_WIDTH } from "../config/gameConfig";
import CharacterManager from "../managers/CharacterManager";
import StandardButton from "../objects/StandardButton";
import { addBackground, isIphone } from "../utils/helpers";
import { BackgroundManager } from "../managers/BackgroundManager";
import SettingsButton from "../objects/SettingsButton";
import GameStateManager from "../managers/GameStateManager";
import StorageManager from "../managers/StorageManager";


export default class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
         this.gameStateManager = GameStateManager.getInstance();
        this.selectedCharacter = null;
        this.autoPlayingCharacter = null;
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


        // Add difficulty checkbox
        this.addDifficultyCheckbox(width, height);

        // Add title text
        let yOffSet = 0

        this.selectCandidate = this.add.text(width / 2, height * 0.24 + yOffSet, 'Select Your Candidate', {
            fontSize: '38px',
            fill: PRIMARY_TEXT_COLOR,
            fontFamily: FONT_FAMILY,
            stroke: '#2d7605',
            strokeThickness: 1
        }).setOrigin(0.5);

        // Create character containers with correct frames
        this.characterManager = new CharacterManager(this);
        this.characterManager.initialize()


        // Add character names
        this.chadTxt = this.add.text(width * 0.3, height * 0.7 + yOffSet, 'CHAD', {
            fontSize: '32px',
            fill: PRIMARY_TEXT_COLOR,
            fontFamily: FONT_FAMILY
        }).setOrigin(0.5);

        this.barryTxt = this.add.text(width * 0.7, height * 0.7 + yOffSet, 'BARRY', {
            fontSize: '32px',
            fill: PRIMARY_TEXT_COLOR,
            fontFamily: FONT_FAMILY
        }).setOrigin(0.5);


        // Add settings button
        let ypos = width < 650 ? 55 : 30;
        ypos = isIphone() ? ypos + 3 : ypos;
        this.settingsButton = new SettingsButton(this, width - 45, ypos, false)


        // Add debug button
        if (SHOW_SPRITE_DEBUG) {
            const debugButton = new StandardButton(this, 140, 30, 'Open Atlas Debugger', {
                onClick: () => {
                    this.scene.start('DebugAtlasScene', {
                        atlasKeys: ['characters', 'extras'],
                        parentScene: this
                    });
                    this.scene.pause();
                }
            });
        }
        this.game.events.on('widthchange', this.hadleResize, this);

        this.hadleResize()
    }


    addDifficultyCheckbox(width, height) {
        // Get the loaded content
        this.htmlContent = this.cache.text.get('difficultyCheckboxHTML');

        this.element = document.createElement('div');

        this.element.innerHTML = this.htmlContent;
        this.element.style.width = '100%';
        this.element.style.height = '100%';
        this.element.style.cssText = `pointer-events: none;`;


        const lsLevel = StorageManager.getProperty('level')  ;//localStorage.getItem('cb-level');

        if(lsLevel){
            const radiosByName = this.element.querySelectorAll('input[name="cb-options"]');
            radiosByName.forEach(radio => {
                radio.checked = (radio.id === lsLevel);
            });
        }

        this.element.querySelectorAll('.circular-radio').forEach(radio => {

            radio.style.pointerEvents = 'auto';

            radio.addEventListener('change', (event) => {
              // Log the selected option to the console
              this.gameStateManager.difficultyLevel = event.target.id;
              StorageManager.updateProperty('level', event.target.id);
            });
          });

        // Add to scene
        this.add.dom(width / 2, height / 2, this.element)
            .setOrigin(0.5);
    }

    
    updateDifficultyCheckbox() {
        const difficultyLevel = this.gameStateManager.difficultyLevel;
            const radiosByName = this.element.querySelectorAll('input[name="cb-options"]');
            radiosByName.forEach(radio => {
                radio.checked = (radio.id === difficultyLevel);
            });
    }



    hadleResize(newWidth) {
        const width = newWidth || this.cameras.main.width;
        const height = this.cameras.main.height;
        if (width < MAX_MOBILE_WIDTH) {

            let yOffSet = 10;
            yOffSet = isIphone() ? yOffSet + 10 : yOffSet;

            this.selectCandidate.setY(height * 0.22 + yOffSet)
            this.selectCandidate.setStyle({ fontSize: '22px' })

            this.chadTxt.setX(width * 0.25)
            this.barryTxt.setX(width * 0.75)

            this.chadTxt.setY(height * 0.55 + yOffSet)
            this.barryTxt.setY(height * 0.55 + yOffSet)

            // this.infoButton.setYPosition(50)

        }
    }


}


