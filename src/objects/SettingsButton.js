

import StandardButton from "./StandardButton";
import { isIphone } from "../utils/helpers";
import { MAX_MOBILE_WIDTH } from "../config/gameConfig";

export default class SettingsButton extends Phaser.GameObjects.Container {
    constructor(parentScene, x, y, isGameScene) {

        super(parentScene, x, y);
            
        this.parentScene = parentScene;
        this.isGameScene = isGameScene;
        this.x = x;
        this.y = y;
        this.intitialize();
    }

    intitialize(){
        this.infoButton = new StandardButton(this.parentScene, this.x, this.y, '⛭', {
            onClick: (e) => {
                if(this.isGameScene){
                    this.parentScene.scene.pause()
                    this.parentScene.scene.launch('SettingsScene', {
                        parentScene: this.parentScene,
                        isGameScene:  this.isGameScene
                    });
                }else{
                    this.parentScene.scene.start('SettingsScene', {
                        parentScene: this.parentScene,
                        isGameScene:  this.isGameScene
                    });
                }
            },
            hoverAlpha: 0,
            alpha: 0,
            fontSize: "50px",
            resolution: 2,
            color: '#2693d6',
            // borderColor: '#000000',
            // borderWidth: 2,
            backgroundColor: "#ffffff00",
            fill: '#2693d6',
            stroke: '#000000',
            strokeThickness: 2,
        });

    }

}
     