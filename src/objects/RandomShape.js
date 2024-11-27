export default class RandomShape {
    constructor(scene, x, y, number) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.number = number;
    }

    create() {
        // First create a graphics object to draw our shape
        const graphics = this.scene.add.graphics();
        
        // Generate random vertices (5-8 points)
        const numPoints = Phaser.Math.Between(5, 8);
        const points = [];
        const radius = 50;
        
        for (let i = 0; i < numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            const randomRadius = radius + Phaser.Math.Between(-20, 20);
            const x = randomRadius * Math.cos(angle);
            const y = randomRadius * Math.sin(angle);
            points.push({ x, y });
        }

        // Style and draw the shape
        const color = Phaser.Math.Between(0x000000, 0xffffff);
        graphics.lineStyle(2, 0x000000);
        graphics.fillStyle(color, 0.7);
        
        // Draw the shape
        graphics.beginPath();
        graphics.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            graphics.lineTo(points[i].x, points[i].y);
        }
        graphics.closePath();
        graphics.strokePath();
        graphics.fillPath();

        // Convert graphics to texture
        const texture = graphics.generateTexture('shape_' + this.number, 100, 100);
        
        // Create a sprite with physics using the generated texture
        const sprite = this.scene.physics.add.sprite(this.x, this.y, 'shape_' + this.number);
        
        // Enable physics on the sprite
        sprite.body.setCollideWorldBounds(true);
        sprite.body.setBounce(0.6);
        sprite.body.setDrag(10);
        sprite.body.setAngularDrag(10);

        // Add text as a separate object that follows the sprite
        const text = this.scene.add.text(this.x, this.y, this.number.toString(), {
            fontSize: '32px',
            color: '#000000',
            fontStyle: 'bold'
        });
        text.setOrigin(0.5);

        // Update text position to follow the sprite
        this.scene.events.on('update', () => {
            text.setPosition(sprite.x, sprite.y);
            text.setRotation(sprite.rotation);
        });

        // Clean up the temporary graphics object
        graphics.destroy();

        return { sprite, text };
    }
}