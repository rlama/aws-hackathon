/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */


import { FONT_FAMILY } from "../config/gameConfig";


export default class StandardButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, text, config = {}) {
        super(scene, x, y);
        
        // Default configuration
        this.config = {
            fontFamily:FONT_FAMILY,
            backgroundColor: 0x3498db,
            textColor: '#ffffff',
            borderColor: 0xffffff,
            hoverColor: 0x2980b9,
            fontSize: '18px',
            padding: 10,
            borderRadius: 6,
            borderWidth: 1,
            alpha: 0.8,
            hoverAlpha: 0.9,
            visible: true,
            onClick: null, // Add onClick to config
            zIndex:1,
            ...config
        };

        // Initialize button components
        this.createButton(text);
        this.setDepth(this.config.zIndex)

        // Add to scene
        scene.add.existing(this);

    }

    setText(msg){
        this.text.setText(msg)
    }

    createButton(message) {
        // Create text
        this.text = this.scene.add.text(0, 0, message, {
            fontFamily: this.config.fontFamily,
            fontSize: this.config.fontSize,
            color: this.config.textColor,
            visible: this.config.visible
        }).setOrigin(0.5);

        // Calculate dimensions
        const width = this.config.width ? this.config.width : this.text.width + (this.config.padding * 2) ;
        const height = this.text.height + (this.config.padding * 2);

        // Create background
        this.background = this.scene.add.graphics();
        
        // Draw initial state
        this.drawBackground(width, height);

        // Add elements to container
        this.add([this.background, this.text]);

        // Make interactive
        this.setInteractive(
            new Phaser.Geom.Rectangle(
                -(width/2), 
                -(height/2), 
                width, 
                height
            ), 
            Phaser.Geom.Rectangle.Contains
        );  

        this.setVisibility(this.config.visible)

        // Add default event listeners
        this.setupEventListeners();
    }

    setVisibility(visible) {
        this.text.setVisible(visible);
        this.background.setVisible(visible);
    }

    drawBackground(width, height, isHover = false) {
        this.background.clear();

        this.background.lineStyle(
            this.config.borderWidth, 
            this.config.borderColor, 
            isHover ? this.config.hoverAlpha : this.config.alpha
        );
        
        this.background.strokeRoundedRect(
            -(width/2) - this.config.borderWidth/2, 
            -(height/2) - this.config.borderWidth/2, 
            width + this.config.borderWidth, 
            height + this.config.borderWidth, 
            this.config.borderRadius
        );

        this.background.fillStyle(
            isHover ? this.config.hoverColor : this.config.backgroundColor, 
            isHover ? this.config.hoverAlpha : this.config.alpha
        );
        
        this.background.fillRoundedRect(
            -(width/2), 
            -(height/2), 
            width, 
            height, 
            this.config.borderRadius
        );
    }

    setupEventListeners() {
        this.on('pointerover', this.onPointerOver, this);
        this.on('pointerout', this.onPointerOut, this);
        this.on('pointerdown', this.onPointerDown, this);
        this.on('pointerup', this.onPointerUp, this);
    }

    onPointerOver() {
        const width = this.config.width ? this.config.width : this.text.width + (this.config.padding * 2) ;
        const height = this.text.height + (this.config.padding * 2);
        this.drawBackground(width, height, true);
        this.scene.game.canvas.style.cursor = 'pointer';
    }

    onPointerOut() {
        const width = this.config.width ? this.config.width : this.text.width + (this.config.padding * 2) ;
        const height = this.text.height + (this.config.padding * 2);
        this.drawBackground(width, height, false);
        this.scene.game.canvas.style.cursor = 'default';
    }

    onPointerDown() {
        this.y += 2;
        this.text.y += 2;
        // Execute onClick callback if provided
        if (this.config.onClick) {
            this.config.onClick();
        }
    }

    onPointerUp() {
        this.y -= 2;
        this.text.y -= 2;
    }
}
