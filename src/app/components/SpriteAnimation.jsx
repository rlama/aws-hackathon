// components/SpriteAnimation.jsx
import { useEffect, useRef, useState } from 'react';
import { Stage, Sprite, Ticker } from 'createjs-module';
import { useSpriteSheet } from '../hooks/useSpriteSheet';
import CharacterControls from './CharacterControls';
import { initializeSprite } from '../utils/spriteInitializer';
import { CHAD_CONFIG, BARRY_CONFIG, CHARACTERS, EXTRAS } from '../config/characterConfigs';
import PlayPauseButton from './molecules/PlayPauseButton';

const SpriteAnimation = () => {
  const canvasRef = useRef(null);
  const charactersRef = useRef({});
  const stageRef = useRef(null);
  const fallingObjectsRef = useRef([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const tickerRef = useRef(null);

  const { createSpriteSheet } = useSpriteSheet();

  const createFallingObject = () => {

    try {
      const spriteSheet = createSpriteSheet(
        EXTRAS.image,
        EXTRAS.atlasData,
        EXTRAS.animations
      );

      const animations = ['dragon', 'bird', 'onion'];
      const randomAnimation = animations[Math.floor(Math.random() * animations.length)];

      const sprite = new Sprite(spriteSheet);

      sprite.scaleX = sprite.scaleY = EXTRAS.scale;



      // Calculate character positions with their scales taken into account
      const characterPositions = [
        {
          x: CHAD_CONFIG.position.x * canvasRef.current.width, // Chad at 0.2
          scale: CHAD_CONFIG.scale // 0.8
        },
        {
          x: BARRY_CONFIG.position.x * canvasRef.current.width, // Barry at 0.6
          scale: BARRY_CONFIG.scale // 0.8
        }
      ];

      // Randomly select either Chad or Barry
      const selectedCharacter = characterPositions[Math.floor(Math.random() * characterPositions.length)];

      // Calculate the offset to center the extra over the character
      // This accounts for the difference in scales between characters (0.8) and extras (0.6)
      const scaleOffset = (selectedCharacter.scale - EXTRAS.scale) * 30; // Adjust the 50 value as needed
      sprite.x = selectedCharacter.x + scaleOffset;



        // Get Chad and Barry's x positions based on their config positions and canvas width
      // const xpositions = [
      //   CHAD_CONFIG.position.x * canvasRef.current.width,  // Chad's x position
      //   BARRY_CONFIG.position.x * canvasRef.current.width  // Barry's x position
      // ];
      // // Randomly select either Chad's or Barry's x position
      // const randomIndex = Math.floor(Math.random() * xpositions.length);
      // sprite.x = xpositions[randomIndex];


      sprite.y = -20;

      sprite.gotoAndPlay(randomAnimation);
      sprite.objectType = randomAnimation;
      sprite.speed = 3;

      // Add to stage and ensure it's on top
      const stage = stageRef.current;
      stage.addChild(sprite);

      // Move the sprite to the top
      stage.setChildIndex(sprite, stage.numChildren - 1);

      fallingObjectsRef.current.push(sprite);

      // Debug logs
      console.log(`Created falling object: ${randomAnimation} at x:${sprite.x}, y:${sprite.y}`);
      console.log('Sprite sheet animations:', spriteSheet.getAnimations());
      console.log('Current animation:', sprite.currentAnimation);
      console.log('Sprite visible:', sprite.visible);
      console.log('Sprite dimensions:', sprite.getBounds());

      // console.log(`Created falling object: ${randomAnimation} at x:${sprite.x}, y:${sprite.y}`);
    } catch (error) {
      console.error("Error creating falling object:", error);
    }
  };



  const checkCollision = (object1, object2) => {
    const bounds1 = object1.getBounds();
    const bounds2 = object2.getBounds();

    return !(bounds1.x > bounds2.x + bounds2.width ||
      bounds1.x + bounds1.width < bounds2.x ||
      bounds1.y > bounds2.y + bounds2.height ||
      bounds1.y + bounds1.height < bounds2.y);
  };



  const updateFallingObjects = () => {

    const removeList = [];

    fallingObjectsRef.current.forEach((obj, index) => {
      console.log(obj)
      obj.y += obj.speed;

      // Check collisions with characters (excluding extras)
      Object.entries(charactersRef.current).forEach(([charName, charSprite]) => {
        if (charName !== 'extras' && checkCollision(obj, charSprite)) {
          // console.log(`${charName} collided with ${obj.objectType}`);
          // console.log(`${charName}'s current animation: ${charSprite.currentAnimation}`);
          removeList.push(index);
        }
      });

      // Remove if out of bounds
      if (obj.y > canvasRef.current.height) {
        removeList.push(index);
      }
    });

    // Remove collided or out-of-bounds objects
    removeList.forEach(obj => {
      stageRef.current.removeChild(obj);
      const index = fallingObjectsRef.current.indexOf(obj);
      if (index > -1) {
        fallingObjectsRef.current.splice(index, 1);
      }
    });
  };



  useEffect(() => {
    const loadSprites = async () => {
      try {
        const stage = new Stage(canvasRef.current);
        stageRef.current = stage;

        await loadCharacters(stage, CHARACTERS.filter(char => char.name !== 'extras'));
        setupStage(stage);

        // Start spawning falling objects
        const spawnInterval = setInterval(() => {
          if (!Ticker.paused) {
            createFallingObject();
          }
        }, 2000);

        return () => clearInterval(spawnInterval);
      } catch (error) {
        console.error('Error loading sprites:', error);
        setIsLoading(false);
      }
    };

    loadSprites();

    return () => cleanup();
  }, []);


  const loadCharacters = async (stage, configs) => {
    for (const config of configs) {
      const atlasData = config.atlasData;
      const image = await loadImage(config.image);
      const spriteSheet = createSpriteSheet(image, atlasData, config.animations);

      const sprite = initializeSprite(
        spriteSheet,
        config.position.x,
        config.position.y,
        canvasRef.current.width,
        canvasRef.current.height,
        config.scale
      );

      sprite.gotoAndPlay(config.defaultAnimation);
      stage.addChild(sprite);

      // Ensure main characters are at the bottom
      stage.setChildIndex(sprite, 0);

      charactersRef.current[config.name] = sprite;
    }
  };

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const setupStage = (stage) => {
    const ticker = Ticker;
    ticker.framerate = 30;

    // Create a tick function that updates both the stage and falling objects
    const tickHandler = () => {
      updateFallingObjects();
      stage.update();
    };

    ticker.addEventListener("tick", tickHandler);
    tickerRef.current = ticker;
    setIsLoading(false);
  };

  const handlePlayPause = () => {
    if (tickerRef.current) {
      if (isPlaying) {
        Ticker.paused = true;
      } else {
        Ticker.paused = false;
      }
      setIsPlaying(!isPlaying);
    }
  };

  const cleanup = () => {
    if (stageRef.current) {
      if (tickerRef.current) {
        Ticker.paused = false;
        Ticker.removeAllEventListeners("tick"); // Remove all tick listeners
      }
      stageRef.current.removeAllChildren();
    }
  };

  const handleAnimation = (character, animationName) => {
    if (charactersRef.current[character]) {
      charactersRef.current[character].gotoAndPlay(animationName);
    }
  };

  const handleStop = (character) => {
    if (charactersRef.current[character]) {
      charactersRef.current[character].stop();
    }
  };

  return (
    <div className="canvas-container" >
      {isLoading && <div>Loading sprite animations...</div>}
      <canvas
        className="game-canvas"
        ref={canvasRef}
        width={800}
        height={600}
        style={{
          display: isLoading ? 'none' : 'block'
        }}
      />
      <div style={{ marginTop: '10px' }}>
        <PlayPauseButton
          isPlaying={isPlaying}
          onClick={handlePlayPause}
        />
        <div style={{ display: 'flex', gap: '20px' }}>
          {CHARACTERS.filter(config => config.name !== 'extras').map(config => (
            <CharacterControls
              key={config.name}
              character={config.name}
              onAnimate={(animation) => handleAnimation(config.name, animation)}
              onStop={() => handleStop(config.name)}
              animations={config.animations}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpriteAnimation;
