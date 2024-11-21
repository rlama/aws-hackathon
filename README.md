# Development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview


phaser-game/
├── package.json
├── vite.config.js
├── .gitignore
├── index.html
├── src/
│   ├── main.js
│   ├── scenes/
│   │   ├── GameScene.js
│   │   └── PreloadScene.js
│   ├── objects/
│   │   ├── Character.js
│   │   └── FallingObject.js
│   ├── config/
│   │   └── gameConfig.js
│   └── assets/
│       ├── sprites/
│       │   ├── monsters.png
│       │   └── monsters.json
│       └── styles/
│           └── style.css