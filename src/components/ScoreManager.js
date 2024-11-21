export default class ScoreManager {
    constructor(scene) {
        this.scene = scene;
        this.scores = {
            chad: 0,
            barry: 0
        };
        this.createScoreDisplay();
    }

    createScoreDisplay() {
        const gameWidth = this.scene.scale.width;
        const boxHeight = 60;

        // Create the main score box
        this.scoreBox = this.scene.add.rectangle(
            0,           // x position (left aligned)
            0,           // y position (top aligned)
            gameWidth,   // width matches game width
            boxHeight,   // height of 60px
            0x000000,   // black color
            1         // 70% opacity
        );
        this.scoreBox.setOrigin(0, 0); // Align to top-left
        this.scoreBox.setDepth(10);     // Ensure it's above game elements

        // Style for score text
        const textStyle = {
            fontSize: '25px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        };

        // Create score texts
        this.scoreText = {
            chad: this.scene.add.text(
                20,                 // Left padding
                boxHeight / 2,      // Vertical center of box
                'Chad: 0',
                textStyle
            ),
            barry: this.scene.add.text(
                gameWidth - 20,     // Right padding
                boxHeight / 2,      // Vertical center of box
                'Barry: 0',
                textStyle
            )
        };

        // Set text properties
        this.scoreText.chad.setOrigin(0, 0.5);    // Align left, vertically centered
        this.scoreText.barry.setOrigin(1, 0.5);   // Align right, vertically centered
        this.scoreText.chad.setDepth(11);         // Above the score box
        this.scoreText.barry.setDepth(11);        // Above the score box

    }

    calculatePoints(extraType) {
        // Point values for different extra types
        switch(extraType) {
            case 'onion':
                return -2;
            case 'fruit':
                return 1;
            case 'bird_fly':
                return 2;
            case 'dragon_fly':
                return 3;
            case 'five_coin':
                return 3;
            case 'gold_box':
                return 5;
            default:
                console.warn('Unknown extra type:', extraType);
                return 0;
        }
    }

    updateScore(character, extraType) {
        const points = this.calculatePoints(extraType);
        const characterKey = character === this.scene.characterManager.getCharacters().chad ? 'chad' : 'barry';
        this.scores[characterKey] += points;

        // Animate score change
        this.scene.tweens.add({
            targets: this.scoreText[characterKey],
            scale: { from: 1.2, to: 1 },
            duration: 200,
            ease: 'Power2'
        });

        // Update score text
        this.scoreText[characterKey].setText(
            `${characterKey.charAt(0).toUpperCase() + characterKey.slice(1)}: ${this.scores[characterKey]}`
        );
    }

    handleResize(gameSize) {
        const { width, height } = gameSize;
        const boxHeight = 60;

        // Resize and reposition score box
        this.scoreBox.width = width;

        // Reposition score texts
        this.scoreText.chad.setPosition(20, boxHeight / 2);
        this.scoreText.barry.setPosition(width - 20, boxHeight / 2);
    }

    reset() {
        this.scores = { chad: 0, barry: 0 };
        Object.keys(this.scoreText).forEach(key => {
            this.scoreText[key].setText(
                `${key.charAt(0).toUpperCase() + key.slice(1)}: 0`
            );
            this.scoreText[key].setScale(1);
        });
    }

    getScores() {
        return this.scores;
    }
}
