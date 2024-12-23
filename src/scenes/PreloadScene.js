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
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);

        // Add loading text
        this.loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading Assets...', {
            fontFamily: 'Arial',
            fontSize: '24px',
            color: '#ffffff'
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
        this.load.image('backgroundDesktop', 'assets/images/background.png');
        this.load.image('backgroundMobile', 'assets/images/background-mobile.png');
        this.load.image('backgroundFinishDesktop', 'assets/images/background-finish.png');
        this.load.image('backgroundFinishMobile', 'assets/images/background-finish-mobile.png');
        this.load.image('gameNameDesktop', 'assets/images/game-name.png');
        this.load.image('gameNameMobile', 'assets/images/game-name-mobile.png');

        // states geojson
        this.load.json('mapData', 'assets/data/us-states.json');

        // Load atlases
        this.load.atlas(
            'characters',
            'assets/sprites/chad_barry_atlas.png',
            'assets/sprites/chad_barry_atlas.json'
        );

        // this.load.atlas(
        //     'extras',
        //     'assets/sprites/extras_atlas.png',
        //     'assets/sprites/extras_atlas.json'
        // );

        // Load buttons
        this.load.image('pause-button', 'assets/images/pause-btn.png', {
            pixelArt: false,
            antialiasing: true,
            smoothing: true
        });
        this.load.image('play-button', 'assets/images/play-btn.png', {
            pixelArt: false,
            antialiasing: true,
            smoothing: true
        });

        // Setup loading events
        this.load.on('loaderror', (fileObj) => {
            console.error('Error loading asset:', fileObj.src);
        });

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
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
        const requiredFonts = ['Lagome', 'BarcadeBold'];
        let fontsLoaded = 0;
        
        const checkAllFonts = () => {
            requiredFonts.forEach(font => {
                if (document.fonts.check(`16px ${font}`)) {
                    fontsLoaded++;
                }
            });

            if (fontsLoaded === requiredFonts.length) {
                // console.log('All fonts loaded successfully');
                this.loadingText.setText('Starting Game...');

                this.time.delayedCall(500, () => {
                  this.scene.start('IntroScene');
 
                });
            } else {
                // Check again after a short delay
                this.time.delayedCall(100, checkAllFonts);
            }
        };

        // Start checking fonts
        checkAllFonts();

        // Add a timeout in case fonts don't load
        this.time.delayedCall(5000, () => {
            if (this.scene.key === 'PreloadScene') {
                console.warn('Font loading timed out, proceeding anyway');
                this.scene.start('StartScene');
            }
        });
    }

    create() {
        // The create method is now just a fallback
        // Most of the work is handled in the load complete callback
        // console.log('Creating scene...');
    }
}
