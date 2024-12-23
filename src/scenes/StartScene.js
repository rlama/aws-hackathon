/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */


import { PRIMARY_TEXT_COLOR, FONT_FAMILY } from "../config/gameConfig";
import CharacterManager from "../components/CharacterManager";
import StandardButton from "../objects/StandardButton";
import DifficultyLevelCheckbox from "../objects/DifficultyLevelCheckbox";
import { addBackground } from "../utils/helpers";



export default class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
        this.selectedCharacter = null;
        this.autoPlayingCharacter = null;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        addBackground(this, width, height, false)


        // Add title text
        this.add.text(width / 2, height * 0.24, 'Select Your Candidate', {
            fontSize: '38px',
            fill: PRIMARY_TEXT_COLOR,
            fontFamily: FONT_FAMILY
        }).setOrigin(0.5);

        // Create character containers with correct frames
        this.characterManager = new CharacterManager(this);
        this.characterManager.createCharacters()


        // Add character names
        this.add.text(width * 0.3, height * 0.7, 'CHAD', {
            fontSize: '32px',
            fill: PRIMARY_TEXT_COLOR,
            fontFamily: FONT_FAMILY
        }).setOrigin(0.5);

        this.add.text(width * 0.7, height * 0.7, 'BARRY', {
            fontSize: '32px',
            fill: PRIMARY_TEXT_COLOR,
            fontFamily: FONT_FAMILY
        }).setOrigin(0.5);

    
        // Add info button
        const infoButton = new StandardButton(this, width - 45, 30, 'info', {
            onClick: () => {
                this.scene.start('GameInfoScene', {
                    parentScene: this
                });
            }
        });

        // Create difficulty checkbox
        this.difficultyCheckbox = new DifficultyLevelCheckbox();
        this.difficultyCheckbox.create(width, height, this);


         // Add debug button
        //  const debugButton = new StandardButton(this, 140, 30, 'Open Atlas Debugger', {
        //     onClick: () => {
        //         this.scene.start('DebugAtlasScene', {
        //             atlasKeys: ['characters', 'extras'],
        //             parentScene: this
        //         });
        //         this.scene.pause();
        //     }
        // });
    }

}


