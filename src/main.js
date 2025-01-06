/*
 * Author:          Richard Lama
 * Last Updated:    December 22, 2024
 * Version:         1.0.0
 */

import './assets/styles/style.css';
import './assets/styles/header.css';
import './assets/styles/gameLevel.css';
import './assets/styles/leaderboard.css';
import './assets/styles/finish.css';
import Phaser from 'phaser';
import './config/gameConfig'; 
import Game from './game/Game';

let game = null;

function createGame() {
    if (game) {
        game.destroy();
    }
    game = new Game();
    return game;
}

export default createGame();