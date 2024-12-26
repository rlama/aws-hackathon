/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */

import StandardButton from "./StandardButton";
import GameStateManager from "../components/GameStateManager";

export default class MusicButton {
    constructor(scene, x, y, config = {}) {
        this.scene = scene;
        this.gameStateManager = GameStateManager.getInstance();
        this.buttonTxtPrefix = config.buttonTxtPrefix;

        const txtCondition = config.buttonTxtPrefix === 'Music' ? this.gameStateManager.musicOn : this.gameStateManager.soundOn;
        // Default config values
        const defaults = {
            musicTxt: txtCondition ? `${config.buttonTxtPrefix} Off` : `${config.buttonTxtPrefix} On`,
            isOn: txtCondition        // Initial state
        };

        // Merge provided config with defaults
        this.config = { ...defaults, ...config };

        this.button = new StandardButton(this.scene, x, y, defaults.musicTxt, {
            backgroundColor: 0x444444,
            zIndex: 10,
            width: config.width
        });



        // Set up button states
        this.button.on('pointerover', () => {
            this.button.setAlpha(0.8);
        });

        this.button.on('pointerout', () => {
            this.button.setAlpha(1);
        });

        this.button.on('pointerdown', () => {
            this.button.setAlpha(0.5);
        });

        this.button.on('pointerup', () => {
            this.button.setAlpha(1);
            if(this.buttonTxtPrefix === 'Music'){
                this.toggleMusic();
            }else{
                this.toggleSound()
            }

        });
    }

    toggleSound() {
        const soundOn = this.gameStateManager.soundOn;
        this.gameStateManager.soundOn = !soundOn;
        const txt = this.gameStateManager.soundOn ? `${this.buttonTxtPrefix} Off` : `${this.buttonTxtPrefix} On`;
        this.button.setText(txt);
    }

    toggleMusic() {
        const musicOn = this.gameStateManager.musicOn;
        this.gameStateManager.musicOn = !musicOn;
        const txt = this.gameStateManager.musicOn ? `${this.buttonTxtPrefix} Off` : `${this.buttonTxtPrefix} On`;
        this.button.setText(txt);
    }

    setPosition(x, y) {
        this.button.setPosition(x, y);
        return this;
    }

    setDepth(depth) {
        this.button.setDepth(depth);
        return this;
    }
}
