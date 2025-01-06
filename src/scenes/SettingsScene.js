/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */

import { BackgroundManager } from "../managers/BackgroundManager";
import GameStateManager from "../managers/GameStateManager";
import StorageManager from "../managers/StorageManager";


export default class SettingsScene extends Phaser.Scene {

    constructor() {
        super({ key: 'SettingsScene' });
        this.gameStateManager = GameStateManager.getInstance();
    }
    init(data) {
        this.parentScene = data.parentScene;
        this.isGameScene = data.isGameScene;
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const btnWidth = 300;

        // Add background with options
        this.backgroundManager = new BackgroundManager(this);
        this.backgroundManager.addBackground({
            isGameScene: false,
            addOverlay: true,
            overlayOnly: this.isGameScene,
            type: 'default',
            header: false
        });

        // Get the preloaded html content 
        this.htmlContent = this.cache.text.get('settingsHTML');

        this.element = document.createElement('div');
        this.element.innerHTML = this.htmlContent;
        this.element.style.width = '100%';
        this.element.style.height = '100%';

        // Add click handler for close button
        const closeButton = this.element.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', (e) => {
                e.preventDefault()
                this.closeScene(this, this.parentScene)
            });
        }

        // Add level select dropdown input
        this.addGameLevelSelect();

        // Add click handler for musicSwitch
        const musicSwitch = this.element.querySelector('#musicSwitch');
        if (musicSwitch) {
            musicSwitch.checked = !this.gameStateManager.musicOn;
            musicSwitch.addEventListener('change', (e) => {
                e.preventDefault()
                const val = e.target.checked;
                if (val) {
                    this.gameStateManager.musicOn = false;
                    this.gameStateManager.pauseSound('background');
                    StorageManager.updateProperty("musicon", false)
                } else {
                    this.gameStateManager.musicOn = true;
                    this.gameStateManager.resumeSound('background');
                    StorageManager.updateProperty("musicon", true)
                }
            });
        }

        // Add click handler for soundSwitch
        const soundSwitch = this.element.querySelector('#soundSwitch');
        if (soundSwitch) {
            soundSwitch.checked = !this.gameStateManager.soundOn;
            soundSwitch.addEventListener('change', (e) => {
                e.preventDefault()
                const val = e.target.checked;
                if (val) {
                    this.gameStateManager.soundOn = false;
                    StorageManager.updateProperty("soundon", false)
                } else {
                    this.gameStateManager.soundOn = true;
                    StorageManager.updateProperty("soundon", true)
                }
            });
        }

        // Add Leaderboard button
        const leaderboardButton = this.element.querySelector('#leaderboard');
        if (leaderboardButton) {
            leaderboardButton.addEventListener('click', (e) => {
                const sc = this.scene.start('LeaderboardScene', {
                    parentScene: this.scene.key,
                    previousScene: this.scene.key,
                    sceneStack: [this.scene.key]
                });
                this.scene.stop();
            })
        }

        // Add info button
        const infoButton = this.element.querySelector('#info');
        if (infoButton) {
            infoButton.addEventListener('click', (e) => {
                const sc = this.scene.start('GameInfoScene', {
                    parentScene: this.scene.key,
                    previousScene: this.scene.key,
                    sceneStack: [this.scene.key]
                });
                this.scene.stop();
            })
        }

        // Add click handler for resume button in the html template
        const resumeButton = this.element.querySelector('#resume');
        if (resumeButton) {
            resumeButton.addEventListener('click', (e) => {
                const sc = this.parentScene.resumeGame();
                this.scene.stop();
            })
        }

        // Add html item to the scene
        this.add.dom(width / 2, height / 2, this.element)
            .setOrigin(0.5);

        if (resumeButton) {
            if (!this.isGameScene) {
                resumeButton.style.display = 'none';
            } else {
                closeButton.style.display = 'none';
            }
        }

        const keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keySpace.on('down', () => {
            const sc = this.parentScene.resumeGame();
            this.scene.stop();
        })


    }


    addGameLevelSelect() {

        const lsLevel = StorageManager.getProperty("level");
        if (lsLevel) {
            this.element.querySelector('.d-selected').textContent = lsLevel;
        }

        this.element.querySelector('.custom-select').addEventListener('click', function (e) {
            e.preventDefault()
            this.classList.toggle('active');
        });

        this.element.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault()
                const selected = option.querySelector('.v-span').textContent;
                this.element.querySelector('.d-selected').textContent = selected;

                this.gameStateManager.difficultyLevel = selected.toLowerCase();

                StorageManager.updateProperty("level", selected.toLowerCase());

                if (this.parentScene.scene.key === 'StartScene') {
                    this.parentScene.updateDifficultyCheckbox()
                }
            });
        });

        // Close dropdown when clicking outside
        this.element.addEventListener('click', (e) => {
            const select = this.element.querySelector('.custom-select');
            if (!select.contains(e.target)) {
                select.classList.remove('active');
            }
        });
    }


    closeScene(scene, parentScene) {
        if (parentScene) {
            scene.scene.start(parentScene);
        }
        scene.scene.sleep();
    }


}