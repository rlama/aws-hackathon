// GameInfoScene.js
export default class GameInfoScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameInfoScene' });
        this.scrolling = false;
        this.lastY = 0;
    }


    init(data) {
        console.log("++++++")
        console.log(data)
        // Store the scene stack if provided
        this.sceneStack = data.sceneStack || [];
        if (data.previousScene && !this.sceneStack.includes(data.previousScene)) {
            this.sceneStack.push(data.previousScene);
        }
    }


    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Add semi-transparent background that covers the entire scene
        const overlay = this.add.rectangle(
            0, 0, width, height,
            0x000000, 0.8
        ).setOrigin(0);

        // Create a container for all content
        this.contentContainer = this.add.container(0, 0);


        // Create the main score box
        const titleBg = this.add.rectangle(
            0,           // x position (left aligned)
            0,           // y position (top aligned)
            width,   // width matches game width
            80,   // height of 60px
            0x000000,   // black color
            1         // 70% opacity
        );

        titleBg.setOrigin(0, 0); // Align to top-left


        // Title (fixed position, outside container)
        const title = this.add.text(
            width / 2,
            40,
            'How to Play',
            {
                fontSize: '48px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        title.setDepth(1);     // Ensure it's above game elements


        // Game instructions
        const instructions = [
            'Player 1 (Chad):',
            '- Use A and D keys to move left and right',
            '- Collect items to score points',
            '',
            'Player 2 (Barry):',
            '- Use LEFT and RIGHT arrow keys to move',
            '- Collect items to score points',
            '',
            'General Rules:',
            '- First player to collect 200 points wins',
            '- Press SPACE to pause/resume game',
            '- Avoid onions - they reduce your score!'
        ];

        // Add instructions text to container
        let yPosition = 150;
        instructions.forEach(instruction => {
            const text = this.add.text(
                width / 2,
                yPosition,
                instruction,
                {
                    fontSize: '24px',
                    fill: '#ffffff',
                    align: 'left'
                }
            ).setOrigin(0.5);
            this.contentContainer.add(text);
            yPosition += 40;
        });

        // Points guide
        const pointsGuide = [
            { item: '🥕 Carrot: 10 points' },
            { item: '🥦 Broccoli: 20 points' },
            { item: '🍎 Apple: 15 points' },
            { item: '🧅 Onion: -5 points' }
        ];

        // Add points guide header
        yPosition += 20;
        const pointsHeader = this.add.text(
            width / 2,
            yPosition,
            'Points Guide:',
            {
                fontSize: '32px',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);
        this.contentContainer.add(pointsHeader);

        // Add points guide items
        yPosition += 50;
        pointsGuide.forEach(item => {
            const text = this.add.text(
                width / 2,
                yPosition,
                item.item,
                {
                    fontSize: '24px',
                    fill: '#ffffff'
                }
            ).setOrigin(0.5);
            this.contentContainer.add(text);
            yPosition += 40;
        });

        // Back button (fixed position, outside container)
        const backButton = this.add.text(
            70,
            40,
            'Back',
            {
                fontSize: '32px',
                fill: '#ffffff',
                backgroundColor: '#444444',
                padding: { x: 20, y: 10 }
            }
        )
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .setScrollFactor(0);

        // Button interactions
        backButton
            .on('pointerover', () => {
                backButton.setStyle({ fill: '#ff0' });
            })
            .on('pointerout', () => {
                backButton.setStyle({ fill: '#ffffff' });
            })
            .on('pointerdown', () => {
                this.handleBack();
                
            });

        // Set up scrolling interaction
        this.input.on('pointerdown', (pointer) => {
            this.scrolling = true;
            this.lastY = pointer.y;
        });

        this.input.on('pointermove', (pointer) => {
            if (this.scrolling) {
                const deltaY = pointer.y - this.lastY;
                this.contentContainer.y += deltaY;
                
                // Clamp the container position
                const minY = height - yPosition - 100; // Bottom boundary
                const maxY = 0; // Top boundary
                this.contentContainer.y = Phaser.Math.Clamp(this.contentContainer.y, minY, maxY);
                
                this.lastY = pointer.y;
            }
        });

        this.input.on('pointerup', () => {
            this.scrolling = false;
        });

        // Add mouse wheel support
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            this.contentContainer.y -= deltaY;
            
            // Clamp the container position
            const minY = height - yPosition - 100; // Bottom boundary
            const maxY = 0; // Top boundary
            this.contentContainer.y = Phaser.Math.Clamp(this.contentContainer.y, minY, maxY);
        });

        // Add keyboard handler for ESC key
        this.input.keyboard.on('keydown-ESC', () => {
            this.closeInfoScene();
        });

        // Add scroll indicators if content is taller than screen
        if (yPosition > height) {
            const scrollIndicator = this.add.text(
                width - 20,
                height / 2,
                '⬍',
                {
                    fontSize: '32px',
                    fill: '#ffffff'
                }
            )
            .setOrigin(0.5)
            .setScrollFactor(0)
            .setAlpha(0.6);

            // Make indicator pulse
            this.tweens.add({
                targets: scrollIndicator,
                alpha: 0.2,
                duration: 1000,
                yoyo: true,
                repeat: -1
            });
        }
    }


    handleBack() {
        if (this.sceneStack.length > 0) {
            const previousScene = this.sceneStack.pop();
            console.log("$$$$$$$$$$$$$")
            console.log(previousScene)
            this.scene.stop();
            this.scene.start(previousScene);

            // this.scene.stop('GameInfoScene');
            // this.scene.resume(previousScene);
            // this.scene.bringToTop(previousScene);
        } else {
            // Default fallback if no previous scene
            this.scene.start('StartScene');
        }
    }

    closeInfoScene() {
        this.scene.start('StartScene');
    }
}
