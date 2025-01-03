/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */


import { PRIMARY_TEXT_COLOR, FONT_FAMILY } from "../config/gameConfig";

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PreloadScene' });
    }

    preload() {
        // Add loading bar first
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Create loading bar elements
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0xffffff, 0.6);
        progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);

        // Add loading text
        this.loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading Assets...', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#2576a8'
        }).setOrigin(0.5);

        // Load your sound files
        this.load.audio('win', 'assets/sounds/SndWin.mp3');
        this.load.audio('onion', 'assets/sounds/SndOnion.mp3');
        this.load.audio('loose', 'assets/sounds/SndLoose.mp3');
        this.load.audio('pluspoints', 'assets/sounds/SndEatGood.mp3');
        this.load.audio('minuspoints', 'assets/sounds/SndEatBad.mp3');
        this.load.audio('background', 'assets/sounds/background.mp3');
        this.load.audio('eating', 'assets/sounds/eating.mp3');
        this.load.audio('eatingopp', 'assets/sounds/eat-opp.mp3');
        this.load.audio('onionopp', 'assets/sounds/onion-opp.mp3');
        this.load.audio('statewin', 'assets/sounds/player-state.mp3');
        this.load.audio('statewinopp', 'assets/sounds/opp-state.mp3');

        // Load background
        this.load.image('backgroundDesktop', 'assets/images/background.jpg');
        this.load.image('backgroundMobile', 'assets/images/background-mobile.jpg');
        this.load.image('backgroundFinishDesktop', 'assets/images/background-finish.png');
        this.load.image('backgroundFinishMobile', 'assets/images/background-finish-mobile.png');
        // this.load.image('gameNameDesktop', 'assets/images/game-name.png');
        // this.load.image('gameNameMobile', 'assets/images/game-name-mobile.png');

        // Load both HTML and CSS files
        this.load.text('gameInfoHTML', 'assets/html/gameInfo.html');
        this.load.text('leaderboardHTML', 'assets/html/leaderboard.html');
        this.load.text('settingsHTML', 'assets/html/settings.html');
        this.load.text('finishHTML', 'assets/html/finish.html');
        this.load.text('difficultyCheckboxHTML', 'assets/html/difficultyCheckbox.html');

        // states geojson
        this.load.json('mapData', 'assets/data/us-states.json');

        // Load atlases
        this.load.atlas(
            'characters',
            'assets/sprites/chad_barry_atlas.png',
            'assets/sprites/chad_barry_atlas.json'
        );

        // Setup loading events
        this.load.on('loaderror', (fileObj) => {
            console.error('Error loading asset:', fileObj.src);
        });

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x61a203, 1);
            progressBar.fillRect(width / 4 + 10, height / 2 - 20, (width / 2 - 20) * value, 30);
            this.loadingText.setText(`Loading Assets: ${Math.round(value * 100)}%`);
        });

        this.load.on('complete', () => {
            // console.log('All assets loaded successfully');
            this.loadingText.setText('Loading Fonts...');
            progressBar.destroy();
            progressBox.destroy();
            this.checkFonts();
        });
    }

    checkFonts() {
        const fonts = ['Lagome', 'BarcadeBold'];

        // Debug: Check if fonts are loading
        fonts.forEach(font => {
            document.fonts.ready.then(() => {
                const isLoaded = document.fonts.check(`12px ${font}`);
            }); 
        });

        // Add a timeout in case fonts don't load
        if (this.scene.key === 'PreloadScene') {
            console.warn('Font loading timed out, proceeding anyway');
            this.scene.start('IntroScene');
        }

        return fonts;
    }



    create() {
        // The create method is now just a fallback
        // Most of the work is handled in the load complete callback
        // console.log('Creating scene...');
    }
}
