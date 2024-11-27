import { PRIMARY_TEXT_COLOR } from "../config/gameConfig";
import CharacterManager from "../components/CharacterManager";


const FONT_FAMILY = "Courier";// "Impact";

export default class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
        this.selectedCharacter = null;
        this.autoPlayingCharacter = null;
        
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.gameWidth = this.cameras.main.width;
        this.gameHeight = this.cameras.main.height;

        // Check device width
        const backgroundImage = this.gameWidth <= 700 ? 'backgroundMobile' : 'backgroundDesktop';

        // Add background first before any other game objects
        if (this.textures.exists(backgroundImage)) {
            const background = this.add.image(0, 0, backgroundImage);
            background.setOrigin(0, 0);
            background.setDepth(-1);  // Ensure it's behind everything

            // Scale background to fit the game width and height
            background.displayWidth = this.gameWidth;
            background.displayHeight = this.gameHeight;
        }

        // Add semi-transparent overlay
        this.add.rectangle(0, 0, width, height, 0x000000, 0.7).setOrigin(0);

        // Add title text
        this.add.text(width / 2, height * 0.2, 'Select Your Character', {
            fontSize: '48px',
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


        // Game Info button

        // Create the extra sprite
        // const infoButton = this.add.sprite(width - 150, height - 50, 'extras', 'frame_24').setOrigin(0.5).setInteractive().setScale(0.4)

        this.textures.get('extras').setFilter(
            Phaser.Textures.LINEAR,  // minFilter
            Phaser.Textures.LINEAR   // magFilter
        );
    
        // When creating your sprite
        const infoButton = this.add.sprite(width - 35, 35, 'extras', 'frame_24');
        infoButton.setInteractive({ 
            useHandCursor: true,
            pixelPerfect: true 
        }).setScale(0.4);
        infoButton.on('pointerdown', () => {
            this.scene.start('GameInfoScene');
        });


         // Add debug button
         const debugButton = this.add.text(16, 16, 'Open Atlas Debugger', {
            fontSize: '18px',
            padding: { x: 10, y: 5 },
            backgroundColor: '#000000',
            color: '#ffffff'
        })
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => debugButton.setStyle({ color: '#ff0' }))
        .on('pointerout', () => debugButton.setStyle({ color: '#fff' }))
        .on('pointerdown', () => {
              // Launch the debug scene
            this.scene.launch('DebugAtlasScene', {
                atlasKeys: ['characters', 'extras'],
                parentScene: this.scene.key
            });
            this.scene.pause();
        });

    }


}
