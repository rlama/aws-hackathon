/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */

import PreloadScene from '../scenes/PreloadScene';
import IntroScene from '../scenes/IntroScene';
import GameScene from '../scenes/GameScene';
import StartScene from '../scenes/StartScene';
import OverlayScene from '../scenes/OverlayScene';
import FinishScene from '../scenes/FinishScene';
import GameInfoScene from '../scenes/GameInfoScene';
import LeaderboardScene from '../scenes/LeaderboardScene'
import DebugAtlasScene from '../scenes/DebugAtlasScene';

export const EXTRA_SCALE = 0.4;
export const RESET_TO_IDLE_TIME = 3500; // adds delay when onion is eaten
export const EXTRA_SPAWN_TIME = 1000;
export const EXTRA_TYPE_CHANGE_INTERVAL_TIME = [300, 800];
export const PRIMARY_TEXT_COLOR = "#74b40a";
export const SEC_TEXT_COLOR = "#358bc0";
export const FONT_FAMILY = "Lagome";// "Arcade";// "Impact";

export const GAME_FRAME_RATE = 60;

export const AWS_API_GATEWAY_ENDPOINT = "https://api.goondrook.com/hackathon"


export const AVAILABLE_EXTRAS = ['dragon_fly', 'bird_fly', 'gold_box', 'five_coin', 'fruit', 'onion', 'star_emoji'];

export const EXTRA_TYPES = ['onion', 'dragon_fly', 'bird_fly', 'onion', 'gold_box', 'five_coin', 'onion', 'fruit', 'onion', 'dragon_fly', 'bird_fly', 'onion', 'gold_box', 'five_coin', 'onion', 'fruit', 'onion'];


export const MAP_CONFIG = {
    idle: {
        lineColor: 0x9bb8c4,
        lineStyle: 1,
        fillStyle: 0xb8e7f8,
        fillAlpha: 1
    },
    CHAD_COLOR: 0xaf0808,
    BARRY_COLOR: 0x0878af
}


export const STATES_SEATS = [
    { "AL": 7 },
    { "AK": 1 },
    { "AZ": 9 },
    { "AR": 4 },
    { "CA": 52 },
    { "CO": 8 },
    { "CT": 5 },
    { "DE": 1 },
    { "FL": 28 },
    { "GA": 14 },
    { "HI": 2 },
    { "ID": 2 },
    { "IL": 17 },
    { "IN": 9 },
    { "IA": 4 },
    { "KS": 4 },
    { "KY": 6 },
    { "LA": 6 },
    { "ME": 2 },
    { "MD": 8 },
    { "MA": 9 },
    { "MI": 13 },
    { "MN": 8 },
    { "MS": 4 },
    { "MO": 8 },
    { "MT": 2 },
    { "NE": 3 },
    { "NV": 4 },
    { "NH": 2 },
    { "NJ": 12 },
    { "NM": 3 },
    { "NY": 26 },
    { "NC": 14 },
    { "ND": 1 },
    { "OH": 15 },
    { "OK": 5 },
    { "OR": 6 },
    { "PA": 17 },
    { "RI": 2 },
    { "SC": 7 },
    { "SD": 1 },
    { "TN": 9 },
    { "TX": 38 },
    { "UT": 4 },
    { "VT": 1 },
    { "VA": 11 },
    { "WA": 10 },
    { "WV": 2 },
    { "WI": 8 },
    { "WY": 1 }
]


// Define emoji types with weights for spawn probability
export const EMOJI_TYPES = [
    { emoji: '🍔', points: 20, type: 'Burger', weight: 1 },
    { emoji: '🍕', points: 10, type: 'Pizza', weight: 2 },
    { emoji: '🌭', points: 8, type: 'Hot Dog', weight: 2 },
    { emoji: '🍟', points: 5, type: 'Fries', weight: 2 },
    { emoji: '🍪', points: 3, type: 'Cookie', weight: 3 },
    { emoji: '🧅', points: 0, type: 'Onion', weight: 5 }  // Increased weight for onions
];



export const ALL_STATES = [
    { name: "Alabama", abbr: "AL", seats: 7 }, //7
    { name: "Alaska", abbr: "AK", seats: 1 },
    { name: "Arizona", abbr: "AZ", seats: 9 },  //9
    { name: "Arkansas", abbr: "AR", seats: 4 },
    { name: "California", abbr: "CA", seats: 52 }, //52
    { name: "Colorado", abbr: "CO", seats: 8 },
    { name: "Connecticut", abbr: "CT", seats: 5 },
    { name: "Delaware", abbr: "DE", seats: 1 },
    { name: "Florida", abbr: "FL", seats: 28 }, //28
    { name: "Georgia", abbr: "GA", seats: 14 }, //14
    { name: "Hawaii", abbr: "HI", seats: 2 },
    { name: "DC", abbr: "DC", seats: 3 }, // its not the state 
    { name: "Idaho", abbr: "ID", seats: 2 },
    { name: "Illinois", abbr: "IL", seats: 17 }, //17
    { name: "Indiana", abbr: "IN", seats: 9 },
    { name: "Iowa", abbr: "IA", seats: 4 },
    { name: "Kansas", abbr: "KS", seats: 4 },
    { name: "Kentucky", abbr: "KY", seats: 6 },
    { name: "Louisiana", abbr: "LA", seats: 6 },
    { name: "Maine", abbr: "ME", seats: 2 },
    { name: "Maryland", abbr: "MD", seats: 8 },
    { name: "Massachusetts", abbr: "MA", seats: 9 },
    { name: "Michigan", abbr: "MI", seats: 13 },
    { name: "Minnesota", abbr: "MN", seats: 8 },
    { name: "Mississippi", abbr: "MS", seats: 4 },
    { name: "Missouri", abbr: "MO", seats: 8 },
    { name: "Montana", abbr: "MT", seats: 2 },
    { name: "Nebraska", abbr: "NE", seats: 3 },
    { name: "Nevada", abbr: "NV", seats: 4 },
    { name: "New Hampshire", abbr: "NH", seats: 2 },
    { name: "New Jersey", abbr: "NJ", seats: 12 },
    { name: "New Mexico", abbr: "NM", seats: 3 },
    { name: "New York", abbr: "NY", seats: 26 },
    { name: "North Carolina", abbr: "NC", seats: 14 },
    { name: "North Dakota", abbr: "ND", seats: 1 },
    { name: "Ohio", abbr: "OH", seats: 15 },
    { name: "Oklahoma", abbr: "OK", seats: 5 },
    { name: "Oregon", abbr: "OR", seats: 6 },
    { name: "Pennsylvania", abbr: "PA", seats: 17 },
    { name: "Rhode Island", abbr: "RI", seats: 2 },
    { name: "South Carolina", abbr: "SC", seats: 7 },
    { name: "South Dakota", abbr: "SD", seats: 1 },
    { name: "Tennessee", abbr: "TN", seats: 9 },
    { name: "Texas", abbr: "TX", seats: 38 },
    { name: "Utah", abbr: "UT", seats: 4 },
    { name: "Vermont", abbr: "VT", seats: 1 },
    { name: "Virginia", abbr: "VA", seats: 11 },
    { name: "Washington", abbr: "WA", seats: 10 },
    { name: "West Virginia", abbr: "WV", seats: 2 },
    { name: "Wisconsin", abbr: "WI", seats: 8 },
    { name: "Wyoming", abbr: "WY", seats: 1 }
]

export const getStatesDetail = () => {
    let newDetail = [];
    // ALL_STATES.forEach((state) => {
    //     const reducedSeats = convertNumber(state.seats)
    //     const obj = { ...state, seats: reducedSeats, abbre: state.abbr }
    //     newDetail.push(obj)
    // })
    // console.log(newDetail)
    // return newDetail;
    return ALL_STATES;
}


export const STATES_DETAIL = getStatesDetail();


function convertNumber(num) {
    if (num === 1) {
        return 1;
    } else if (num > 1 && num < 5) {
        return 2;
    } else if (num > 5 && num < 15) {
        return 3;
    } else if (num > 15 && num < 25) {
        return 4;
    } else {
        return 5;
    }
}


export const DUMMY_SCORE = {
    playerName: "player A",
    selectedCharacter: "chad",
    score: {
        "chad": 122,
        "barry": 270
    },
    statesWon: 10,
    timestamp: new Date().toISOString(),
    gameId: Date.now().toString()
}


export const DEFAULT_INITIAL_SCORE = {
    chad: 0,
    barry: 0
}


export const _DEFAULT_INITIAL_SCORE = {
    chad: { score: 220, winner: "" },
    barry: { score: 220, winner: "" },
    chadState: { score: 0, winner: "" },
    barryState: { score: 0, winner: "" },
    selectedCharacter: ""
}


export const DEFAULT_DIFFICULTY_SETTINGS = {
    beginner: {
        missRate: 0.7,     // 50% chance to miss
        reactionDelay: 500, // slower reaction time
        resetToIdleTimeForOpponent: 3500

    },
    intermediate: {
        missRate: 0.2,     // 20% chance to miss
        reactionDelay: 200,
        resetToIdleTimeForOpponent: 2500
    },
    expert: {
        missRate: 0.05,    // 5% chance to miss
        reactionDelay: 100, // faster reaction time
        resetToIdleTimeForOpponent: 1500
    }
}

export const DUMMY_LEADERBOARD_SCORE = [
    {
        playerName: "player A",
        selectedCharacter: "chad",
        score: {
            "chad": 122,
            "barry": 270
        },
        statesWon: 10,
        timestamp: new Date().toISOString(),
        gameId: Date.now().toString()
    },
    {
        playerName: "player B",
        selectedCharacter: "barry",
        score: {
            "chad": 270,
            "barry": 154
        },
        statesWon: 15,
        timestamp: new Date().toISOString(),
        gameId: Date.now().toString()
    },
    {
        playerName: "player C",
        selectedCharacter: "chad",
        score: {
            "chad": 230,
            "barry": 270
        },
        statesWon: 25,
        timestamp: new Date().toISOString(),
        gameId: Date.now().toString()
    },
]


export const gameConfig = {
    type: Phaser.WEBGL,
    powerPreference: 'high-performance',
    scale: {
        mode: Phaser.Scale.RESIZE,
        parent: 'game',
        width: window.innerWidth,
        height: window.innerHeight,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            fps: GAME_FRAME_RATE,
            stepRate: GAME_FRAME_RATE,
            timeScale: 1,
            gravity: { y: 0 },
            debug: false,
            fixedStep: true,
            updateIterations: 2,
            skipQuadTree: false,
            overlapBias: 4
        }
    },
    dom: {
        createContainer: true  // This is crucial!
    },
    backgroundColor: '#ffffff',
    scene: [PreloadScene, IntroScene, StartScene, GameScene, OverlayScene, GameInfoScene, FinishScene, LeaderboardScene, DebugAtlasScene],
    fps: {
        target: GAME_FRAME_RATE,
        forceSetTimeOut: false
    },
    render: {
        antialias: true,
        pixelArt: false,
        roundPixels: true,
        transparent: true,
        clearBeforeRender: true
    }
};



let game;
const destroyGame = () => {
    if (game) {
        try {
            // First remove all scenes safely
            game.scene.scenes.forEach(scene => {
                try {
                    // Remove all scene event listeners first
                    scene.events.removeAllListeners();
                    scene.scene.stop();
                    scene.scene.remove();
                } catch (e) {
                    console.warn('Scene cleanup error:', e);
                }
            });

            // Remove game level events
            game.events.removeAllListeners();

            // Remove scale manager listeners
            game.scale.removeAllListeners();

            // Remove all input listeners
            game.input?.removeAllListeners();

            // Destroy physics if it exists
            if (game.physics && game.physics.destroy) {
                game.physics.destroy();
            }

            // Finally destroy the game instance
            game.destroy(true, false);
            game = null;

            // Clean up DOM
            const gameContainer = document.getElementById('game');
            if (gameContainer) {
                gameContainer.innerHTML = '';
            }

            // Remove any lingering canvas elements
            document.querySelectorAll('canvas').forEach(canvas => {
                canvas.remove();
            });
        } catch (e) {
            console.warn('Game cleanup error:', e);
            // Force cleanup if normal destroy fails
            game = null;
            const gameContainer = document.getElementById('game');
            if (gameContainer) {
                gameContainer.innerHTML = '';
            }
        }
    }
};


// Add resize handler with debounce
let resizeTimeout;
window.addEventListener('resize', () => {
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
    }

    resizeTimeout = setTimeout(() => {
        // Destroy existing game
        destroyGame();

        // Create new game instance after a short delay
        setTimeout(() => {
            game = new Phaser.Game(gameConfig);
        }, 100);
    }, 250);
});

// Initial game creation
if (!game) {
    game = new Phaser.Game(gameConfig);
}

export { game };