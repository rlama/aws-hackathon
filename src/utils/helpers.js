/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */

import FingerprintJS from '@fingerprintjs/fingerprintjs'; 

// Unique ID based on device fingerprint
export const getFingerprint = async () => {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    const base64Fingerprint = btoa(result.visitorId ).slice(0, 12);
    return base64Fingerprint ; 
}



export function createCloseButton(scene, parentScene) {
    const closeButton = scene.add.text(
        scene.cameras.main.width - 60, 20,
        '❌',
        {
            fontSize: '24px',
            padding: { x: 10, y: 5 },
            // backgroundColor: '#ff0000',
            color: '#ffffff'
        }
    )
    .setDepth(2)
        .setInteractive({ useHandCursor: true })
        // .on('pointerover', () => closeButton.setStyle({ backgroundColor: '#aa0000' }))
        // .on('pointerout', () => closeButton.setStyle({ backgroundColor: '#ff0000' }))
        .on('pointerdown', () => closeDebugger());


    function setupKeyboardControls() {
        scene.input.keyboard.on('keydown-ESC', () => {
            closeDebugger();
        });
    }

    function closeDebugger() {
        if (parentScene) {
            scene.scene.start(parentScene);
        }
        scene.scene.sleep();
    }
}


export function capitalizeWords(str) {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}


export function addBackground(scene, gameWidth, gameHeight, header=true, isGameScene, type) {
    let backgroundImage = gameWidth <= 700 ? 'backgroundMobile' : 'backgroundDesktop';

    if(type === 'finishScene'){
        backgroundImage = gameWidth <= 700 ? 'backgroundFinishMobile' : 'backgroundFinishDesktop';
    }
    // Add background first before any other game objects
    // if (scene.textures.exists(backgroundImage)) {

        // Check device width
        // const backgroundImage = gameWidth <= 700 ? 'backgroundMobile' : 'backgroundDesktop';

        const background = scene.add.image(0, 0, backgroundImage);
        background.setOrigin(0, 0);
        background.setDepth(-1);  // Ensure it's behind everything

        // Scale background to fit the game width and height
        background.displayWidth = gameWidth;
        background.displayHeight = gameHeight;

        // Add semi-transparent overlay
        if(!isGameScene){
            scene.add.rectangle(0, 0, gameWidth, gameHeight, 0x000000, 0.7).setOrigin(0);
        }
    

    if (header) {
        // Create the main score box
        const titleBg = scene.add.rectangle(
            0,           // x position (left aligned)
            0,           // y position (top aligned)
            gameWidth,   // width matches game width
            80,   // height of 60px
            0x28383e,   // black color
            1        // 70% opacity
        );

        titleBg.setOrigin(0, 0); // Align to top-left
        titleBg.setDepth(1); // Align to top-left

    }
}


export function cssColor(phaserColor)
    {
       return '#' + phaserColor.toString(16).padStart(6, '0');

    }