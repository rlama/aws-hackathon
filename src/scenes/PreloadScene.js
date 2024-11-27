export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload() {
    // Add loading bar first
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);

    // Load assets
    console.log('Preloading assets...');

    // Load background
    this.load.image('backgroundDesktop', 'assets/images/background.png');
    this.load.image('backgroundMobile', 'assets/images/background-mobile.png');
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

    this.load.atlas(
      'extras',
      'assets/sprites/extras_atlas.png',
      'assets/sprites/extras_atlas.json'
    );

    // Load buttons
    // Load button images with pixel art settings disabled
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
    });

    this.load.on('complete', () => {
      console.log('All assets loaded successfully');
      progressBar.destroy();
      progressBox.destroy();
      this.createScene();
    });
  }

  createScene() {
    console.log('Creating scene...');

    const cameraWidth = this.cameras.default.width;
    const cameraHeight = this.cameras.default.height;

    // Check device width
    const backgroundImage = cameraWidth <= 700 ? 'backgroundMobile' : 'backgroundDesktop';
    const gameNameImage = cameraWidth <= 700 ? 'gameNameMobile' : 'gameNameDesktop';
    

    // Verify if background texture exists
    if (!this.textures.exists(backgroundImage)) {
      console.error('Background texture not found!');
      return;
    }

    try {

      const background = this.add.image(0, 0, backgroundImage);
      background.setOrigin(0, 0);
      background.setDepth(-1);

      const gameName = this.add.image(0, 0, gameNameImage);
      gameName.setOrigin(0, 0)
      gameName.setPosition(cameraWidth/2 - gameName.width/2, cameraHeight/2 - gameName.height/0.7)
      gameName.setDepth(1);  // Ensure it's behind everything
      
      // Scale background to fit the game width and height
      background.displayWidth = cameraWidth;
      background.displayHeight = cameraHeight;

      // Add a slight delay before starting the game scene
      this.time.delayedCall(2000, () => {
        this.scene.start('StartScene');
      });

    } catch (error) {
      console.error('Error creating background:', error);
    }
  }


  create() {
    // Move scene creation to separate method
    // This ensures all assets are loaded before creating the scene
    this.createScene();
  }
}
