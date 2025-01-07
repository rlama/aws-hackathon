/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */

import { BackgroundManager } from "../managers/BackgroundManager";
import GameStateManager from "../managers/GameStateManager";
import StorageManager from "../managers/StorageManager";
import { checkIfMobile } from "../utils/helpers";


export default class PauseScene extends Phaser.Scene {

    constructor() {
        super({ key: 'PauseScene' });
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

        this.add.text(
            width/2,
            checkIfMobile() ? height * 0.5 : height * 0.3,
            checkIfMobile() ? "Tap To Resume" : "Press spacebar again to resume",
            {
                fontSize: '20px',
                fill: '#000000',
                fontFamily: 'Courier',
                fontWeight: 'bold',
                stroke: checkIfMobile() ? '#000000' : '#ffffff',
                strokeThickness: 2
            }
        )
        .setOrigin(0.5)
        .setDepth(10);


        if(checkIfMobile()){
            this.input.on('pointerdown', this.handleSceneClick, this);

        }else{
            const keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            keySpace.on('down', this.handleSceneClick)
        }
    }


    handleSceneClick=()=>{
        event.stopPropagation();
        const sc = this.parentScene.resumeGame();
        this.gameStateManager.resumeSound('background');
        this.scene.stop();
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