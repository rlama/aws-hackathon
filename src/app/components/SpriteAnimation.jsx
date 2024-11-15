// components/SpriteAnimation.jsx
import { useEffect, useRef, useState } from 'react';
import { Stage, Sprite, Ticker } from 'createjs-module';
import { useSpriteSheet } from '../hooks/useSpriteSheet';
import CharacterControls from './CharacterControls';
import { initializeSprite } from '../utils/spriteInitializer';
import { CHARACTERS, EXTRAS } from '../config/characterConfigs';
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
    // Create sprite sheet for extras
    const spriteSheet = createSpriteSheet(
      EXTRAS.image,
      EXTRAS.atlasData,
      EXTRAS.animations
    );

    // Randomly select one of the animations
    const animations = ['dragon', 'bird', 'onion'];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];

    const sprite = new Sprite(spriteSheet);
    sprite.x = Math.random() * (canvasRef.current.width - 50);
    sprite.y = -50; // Start above the canvas
    sprite.scaleX = sprite.scaleY = EXTRAS.scale;
    sprite.gotoAndPlay(randomAnimation);
    sprite.objectType = randomAnimation;
    sprite.speed = 3;

    // Add to stage and store reference
    stageRef.current.addChild(sprite);
    fallingObjectsRef.current.push(sprite);
    
    // Debug log
    console.log(`Created falling object: ${randomAnimation} at x:${sprite.x}`);
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
      obj.y += obj.speed;

      // Check collisions with characters (excluding extras)
      Object.entries(charactersRef.current).forEach(([charName, charSprite]) => {
        if (charName !== 'extras' && checkCollision(obj, charSprite)) {
          console.log(`${charName} collided with ${obj.objectType}`);
          console.log(`${charName}'s current animation: ${charSprite.currentAnimation}`);
          removeList.push(index);
        }
      });

      // Remove if out of bounds
      if (obj.y > canvasRef.current.height) {
        removeList.push(index);
      }
    });

    // Remove collided or out-of-bounds objects
    removeList.reverse().forEach(index => {
      stageRef.current.removeChild(fallingObjectsRef.current[index]);
      fallingObjectsRef.current.splice(index, 1);
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
    <div>
      {isLoading && <div>Loading sprite animations...</div>}
      <canvas 
        ref={canvasRef}
        width={800}
        height={600}
        style={{ 
          border: '1px solid black',
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
