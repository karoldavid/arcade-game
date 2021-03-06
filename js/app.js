/**
 * @file app.js
 * @author Karol Zyskowski
 * Please read the README.md file for more information about the Game.
 * Here is a link to the live version:
 * {@link http://karoldavid.github.io/arcade-game/ GitHub}
 */

/**
 * This file provides the Game functionality and starts the game.
 * As a very basic functionality, random values are produced for speed and position
 * (or type of appearing gems). Fundamental to the functioning of the game are
 * the enemy and the player prototypes, and, additionally, collectible items,
 * the gems. Furthermore, the file provides essential methods to detect collisions
 * (called in engine.js) and to update the objects (called in engine.js).
 * It also handles the player input via keybord, the timer/ time-out, the
 * score calculation and the player selection.
 * Additionally, the file provides functions to display the game information
 * such as the current player score or the game timer on the canvas.
 * At the very bottom of this file, the enemy, the player and the gem objects
 * are created in the global scope and initialized by the function call startGame.
 */

"use strict";

/**
 * @function getRandomValue
 * @param {number} min
 * @param {number} max
 * @returns a random value within the given bounds of min and max
 */
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * The Game info text is diplayed on top of and below the game board. It
 * consists of 'Scores', 'Timer', 'current Player character', and the
 * 'player character', the player should change to, to maximize the current
 * gem's value.
 */

/**
 * @function clearCanvasTopRight
 * The function partly clears the canvas on the top right to override the
 * changing 'action' text. ( The 'action' text tells the player, whether he
 * should move or change the player character by pressing 'enter',
 * in order to maximize the current gem's value.)
 */
function clearCanvasTopRight() {
    var canvas = document.getElementsByTagName('canvas')[0];
    ctx.clearRect(300, 0, canvas.width, 200);
}

/**
 * @function clearCanvasBottom
 * The function clears the canvas bottom to override the
 * score, the timer and the player name.
 */
function clearCanvasBottom() {
    var canvas = document.getElementsByTagName('canvas')[0];
    ctx.clearRect(0, 585, canvas.width, 25);
}

/**
 * @function writeGameTitle
 * The function writes the game title on the very top left
 * of the canvas.
 * The function is called by the function reset in engine.js.
 */
function writeGameTitle() {
    ctx.font = '20pt Calibri';
    ctx.fillStyle = 'blue';
    ctx.fillText('GEM LAND', 0, 30);
}

/**
 * @function writeGameAction
 * @param {string} action
 * The function writes the 'game action' on the very top right.
 * The 'game action' tells the player whether he should move towards the water
 * or change the player by pressing 'enter' in order to maximize the current
 * gem's value.
 */
function writeGameAction(action) {
    ctx.font = '14pt Calibri';
    ctx.fillStyle = 'red';
    ctx.fillText(action + '!', 300, 30);
}

/**
 * @function writeGameRules
 * The function displays the game rules explanation. You find the rules on the
 * very bottom of the game board.
 * The function is called by the function reset in engine.js.
 * The README.md file contains a more detailed explanation of the game rules.
 */
function writeGameRules() {
    ctx.font = '12pt Calibri';
    ctx.fillStyle = 'gray';
    ctx.fillText('Cursors: Move', 0, 630);
    ctx.fillText('Enter: Change Player', 150, 630);
    ctx.fillText('Multiply Gem Value: Choose appropriate Player', 0, 650);
    ctx.fillText('Beat Timer: Reach Water', 0, 670);
    ctx.fillText('Game Over: Collision with Bug/ Rock or Time Out', 0, 690);
}

/**
 * Timer: the player has to beat the timer. The timer is always running.
 * The more time the player needs to reach the water the more scores he looses.
 */

/**
 * @global {number} count start value of the game time counter
 * @constant {number} MAX_COUNT maximum value of the game time counter
 * @function counter sets the interval of the game time counter
 * The function is called by the function updateEntities in engine.js.
 */
var count = 0,
    MAX_COUNT = 300,
    counter = setInterval(writeTimer, 1000);

/**
 * @function writeTime
 * The function writeTimer displays the current time in relation to the maximum
 * value of the time counter ('time out') to the player.
 * The function is called by the function updateEntities in engine.js.
 */
function writeTimer() {
    ctx.font = '14pt Calibri';
    ctx.fillStyle = 'red';
    ctx.fillText(MAX_COUNT + '/ ', 200, 603);
    ctx.fillText(count, 240, 603);
    count = count + 1;
    clearInterval(counter);
}

/**
 * @function timeOut
 * @returns true if the time counter is bigger than the maximum allowed value,
 * otherwise false.
 */
function timeOut() {
    if (count > MAX_COUNT) { return true; }
    return false;
}

/**
 * Gems: single gems appear randomly on the board. They can be collected by
 * the player. He simply has to overrun them. Different gems have different values.
 * Some of the gems match to a specific player character. If the gem is collected
 * by the specific player character, the value is multiplied by 10. The Rock is
 * part of the gem list, but running into it has fatal consequences for the player.
 * This consequences are handled by the function checkCollisions in engine.js.
 */

/**
 * @function Gem
 * The function calls its init function. The gem is initialized twice
 * (here and in the reset function), therefore I prefere to wrap it
 * in an own function to avoid repeating code.
 */
var Gem = function() {
    this.init();
};

/**
 * @function imageURLs
 * @returns an array with eight different image url strings for the gem sprite
 */
Gem.prototype.imageURLs = function() {
    return [
      'images/gem-blue.png',
      'images/gem-green.png',
      'images/gem-orange.png',
      'images/heart.png',
      'images/key.png',
      'images/rock.png',
      'images/selector.png',
      'images/star.png'
    ];
};

/**
 * @function getRandomImageURL
 * @returns one random image url string for the gem sprite.
 */
Gem.prototype.getRandomImageURL = function() {
    var gemImageURLs = this.imageURLs(),
        imageURL = getRandomValue(0, gemImageURLs.length - 1);
    return gemImageURLs[imageURL];
};

/**
 * @function init
 * The function initalizes the current gem. The gem gets a random image url
 * string and a random x and y position value.
 */
Gem.prototype.init = function() {
    this.sprite = this.getRandomImageURL();
    this.x = getRandomValue(0, 4) * 101;
    this.y = getRandomValue(1, 3) * 70;
};

/**
 * @function reset
 * The function resets the current gem by calling the gem init function.
 */
Gem.prototype.reset = function() {
    this.init();
};

/**
 * @function update
 * The function handles the display of information related to the gem value
 * in relation with the player's current character: It tells the player whether
 * he should keep moving or change to another player character to maximize the
 * current gem's value. The function also clears the space on the very top right
 * of the the canvas where the 'game action' hints 'change player!' and
 * 'keep moovin!' are displayed.
 * The function is called by the function updateEntities in engine.js.
 */
Gem.prototype.update = function() {
    clearCanvasTopRight();
    if (this.multiplyScore(player.name) != player.name) {
      writeGameAction('Change Player');
      ctx.drawImage(Resources.get(player.getCurrentPlayerURL(this.multiplyScore(player.name))), 450, -20, 40, 70);
    } else {
        writeGameAction('Keep movin');
    }
};

/**
 * @function render
 * The function paints the current gem sprite onto the canvas.
 */
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * @function checkCollision
 * @returns true or false
 * The function checks whether a collision between a gem and the player has
 * occured.
 * The function is called by the function checkCollisions in engine.js.
 */
Gem.prototype.checkCollision = function() {
    var gemBox = {'x': 50, 'y': 50},
        playerBox = {'x': 50, 'y': 50},
        g = {
          'right': this.x + gemBox.x,
          'left': this.x, 'top' : this.y,
          'bottom': this.y + gemBox.y
    },
        p = {
          'right': player.x + playerBox.x,
          'left': player.x,
          'top': player.y,
          'bottom': player.y + playerBox.y
    };
    return !( g.left > p.right ||
              g.right < p.left ||
              g.top > p.bottom ||
              g.bottom < p.top );
};

/**
 * @function hide
 * The function puts the gem off canvas after it has been collected by the player.
 * It also checks whether the player character matches with the gem-player list.
 * If yes, it multiplies the value of the current gem by ten. If not, it adds
 * the normal gem value to the players score.
 */
Gem.prototype.hide = function() {
    this.x = -100;
    this.y = -100;
    if (this.multiplyScore(player.name) === player.name) {
      player.score += this.gemScoreList() * 10;
    } else {
        player.score += this.gemScoreList();
    }
};

/**
 * @function gemNames
 * @returns an array with eight gem name strings
 */
Gem.prototype.gemNames = function() {
    return [
      'blue',
      'green',
      'orange',
      'heart',
      'key',
      'rock',
      'selector',
      'star'
    ];
};

/**
 * @function multiplyScore
 * @param {string} currentPlayer
 * @returns player name string
 * The function matches the current collected gem with the gem-player object.
 */
Gem.prototype.multiplyScore = function(currentPlayer) {
    var players = player.getPlayerNames(),
        gemPlayer = {
          'blue': players[0],
          'green': players[1],
          'orange': players[2],
          'heart': players[3],
          'star': players[4]
    },
        currentGem = this.sprite;
    for (var g in gemPlayer) {
      if (currentGem.match(g)) {
        return gemPlayer[g];
      }
    }
    return currentPlayer; // fallback
};

/**
 * @function gemScoreList
 * @returns the current gem's value from the gem-score object
 */
Gem.prototype.gemScoreList = function() {
    var gemScore = {
          'blue': 10,
          'green': 20,
          'orange': 30,
          'heart': 40,
          'key': 100,
          'rock': 0,
          'selector': 5,
          'star': 50
    },
        currentGem = this.sprite;
    for (var g in gemScore) {
      if (currentGem.match(g)) {
        return gemScore[g];
      }
    }
    return 0; // fallback
};

/**
 * Enemy: Up to 6 enemy bugs cross the board from left to right
 * with different speed. Their sole hope is to run into the player
 * so that he looses all of his points and has to restart from zero.
 * Once an enemy bug disappears on the right, it reappears shortly after
 * with a new random vertical position and speed on the left of the board.
 */

/**
 * @function Enemy
 * The enemy bug gets his initial values suchs as the sprite url, the x-position
 * (always off canvas on the left), a random y-position and a random speed value.
 */
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = -101; // start off canvas
    this.y = getRandomValue(1, 3) * 70;
    this.speed = getRandomValue(80, 200);
};

/**
 * @function update
 * @param {number} dt time delta for smooth animation
 * The function resets the enemy when it reaches the right side of the board so
 * that it can reappear on the left side.
 * The function is called by the function updateEntities in engine.js.
 */
Enemy.prototype.update = function(dt) {
    if (this.x <= 606) {
      this.x = this.x + (this.speed * dt);
    } else {
        this.reset();
    }
};

/**
 * @function render
 * The function paints the enemy sprite onto the canvas.
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * @function checkCollision
 * @returns true or false
 * The function checks whether a collision between an enemy bug and the player
 * has occured.
 * The function is called by the function checkCollisions in engine.js.
 */
Enemy.prototype.checkCollision = function() {
    var enemyBox = {'x': 75, 'y': 50},
        playerBox = {'x': 50, 'y': 50},
        e = {
          'right': this.x + enemyBox.x,
          'left': this.x,
          'top': this.y,
          'bottom': this.y + enemyBox.y
    },
        p = {
          'right': player.x + playerBox.x,
          'left': player.x ,
          'top': player.y,
          'bottom': player.y + playerBox.y
    };
    return !( e.left > p.right ||
              e.right < p.left ||
              e.top > p.bottom ||
              e.bottom < p.top );
};

/**
 * @function reset
 * The function resets the enemy's position and speed to new random values. And
 * puts him back to start of canvas on the left.
 */
Enemy.prototype.reset = function() {
    this.x = -101; // start off canvas
    this.y = getRandomValue(1, 3) * 70;
    this.speed = getRandomValue(80, 300);
};

/**
 * The player can be one of five different characters. The default character is
 * a little boy. The character can be changed at any given moment by pressing
 * 'enter'. The player can collect gems on his way to the goal, the water.
 */

/**
 * @function Player
 * The function initializes the players values like default player sprite, the
 * x and y values for the player's start position, the scores starting from 0,
 * the player's name.
 */
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 200;
    this.y = 370;
    this.speed = 1;
    this.move = {'x': 0, 'y': 0}; // when y & x = 0 player does not move
    this.score = 0; // initial/ minimum score; score never goes below zero
    this.name = this.getCurrentPlayerName();
};

/**
 * @function getPlayerNames
 * @returns an array with five player name strings
 */
Player.prototype.getPlayerNames = function() {
    return [
      'boy',
      'cat',
      'horn',
      'pink',
      'princess'
    ];
};

/**
 * @function getCurrentPlayerName
 * @returns the current player name string
 * The function compares the current sprite url string with the player name
 * strings array.
 */
Player.prototype.getCurrentPlayerName = function() {
    var playerNames = this.getPlayerNames(), // get player names array
        length = playerNames.length,
        currentPlayer = this.sprite; // get current player sprite url
    for (var i = 0; i < length; i++) {
      if (currentPlayer.match(playerNames[i])) {
        return playerNames[i];
      }
    }
    return playerNames[0]; // fallback
};

/**
 * @function getCurrentPlayerURL
 * @params {string} playerName the current player's name
 * @returns the current player's sprite url string depending on the given
 * player name string
 */
Player.prototype.getCurrentPlayerURL = function(playerName) {
    var playerNames = this.getPlayerNames();
        length = playerNames.length;
    if (playerName === playerNames[0]) {
      return 'images/char-' + playerName + '.png'; // url for boy sprite
    }
    for (var i = 1; i < length; i++) {
      if (playerNames[i] === playerName )
      {
        return 'images/char-' + playerName + '-girl' + '.png'; // url for girls sprite
      }
    }
    return 'images/blank.png'; // fallback
};

/**
 * @function shufflePlayer
 * @returns player sprite url string
 * The function shuffles the player's character when 'enter' is hit. To do so, it
 * matches the current player's sprite url string against a player names string
 * array.
 */
Player.prototype.shufflePlayer = function() {
    var playerNames = this.getPlayerNames(),
        length = playerNames.length,
        currentPlayer = this.sprite;
    for (var i = 0; i < length; i++) {
      if (currentPlayer.match(playerNames[i]) && i + 1 < length) {
        return 'images/char-' + playerNames[i+1] + '-girl' + '.png'; // url for girls sprite
      }
    }
    return 'images/char-' + playerNames[0] + '.png'; // url for boy sprite
};

/**
 * @function update
 * The function updates all information vital to the player. It checks that
 * the player's position never leaves the board. It also checks whether the
 * player reaches the water. If yes, it adds 100 to the player's score and
 * continues the game from the start. In case of a time out, the game is
 * over and the player starts from the start with 0 points. It also updates
 * the current player character's name and the current player's score on the
 * bottom of the board.
 * The function is called by the function updateEntities in engine.js.
 */
Player.prototype.update = function() {
    this.moveInBounds();
    if (this.detectGoal()) {
      this.score += 100;
      this.reset(false);
    }
    if (timeOut()) {
      this.reset(true);
    }
    clearCanvasBottom();
    this.writePlayerName();
    this.writeScore();
};

/**
 * @function render
 * The function paints the player sprite onto the canvas.
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/**
 * @function moveInBounds
 * The function updates the player's coordinates if the new coordinates are
 * inside the given bounds of the board.
 */
Player.prototype.moveInBounds = function() {
    var newX = this.x + this.move.x,
        newY = this.y + this.move.y;
    if (newX >= -80 && newX <= 480) { this.x = newX; }
    if (newY >= -90 && newY <= 370) { this.y = newY; }
    this.move = {'x': 0, 'y': 0};
};

/**
 * @function detectGoal
 * @returns true or false
 * The function checks if the player reaches the water.
 */
Player.prototype.detectGoal = function() {
    return !( this.y >= 0);
};

/**
 * @function reset
 * @param {boolean} collision
 * The function resets the player's values. If the reset is due to a collision,
 * the player loses all his scores, the game is over and starts again. If the
 * player made it to the water without collision, the time needed is substracted
 * from the player's score.
 * The function is called by the function checkCollisions in engine.js.
 */
Player.prototype.reset = function(collision) {
    this.x = 200;
    this.y = 370;
    this.speed = 1;
    this.move = {'x': 0, 'y': 0};
    if (collision) {
      this.score = 0; // collision with enemy/ rock or time out resets player score
    } else {
        this.score -= Math.round(count / 10);
        if (this.score < 0) { this.score = 0; }
    }
    count = 0;
    gem.reset(); // make gem reappear
};

/**
 * @function writeScore
 * The function writes the player's score onto the bottom left of the canvas.
 */
Player.prototype.writeScore = function() {
    ctx.font = '14pt Calibri';
    ctx.fillStyle = 'red';
    ctx.fillText('Score: ' + this.score, 0, 603);
};

/**
 * @function writePlayerName
 * The function writes the player's name onto the bottom right of the canvas.
 */
Player.prototype.writePlayerName = function() {
    ctx.font = '14pt Calibri';
    ctx.fillStyle = 'red';
    ctx.fillText(this.name, 400, 603);
};

/**
 * @function handleInput
 * @param {string} key current key pressed
 * The function handles the input and therefore allows to control the game.
 * 'Arrow keys' move the player into the according direction and 'return'
 * shuffles the player's character.
 */
Player.prototype.handleInput = function(key) {
    switch(key){
      case 'left' :
        this.move.x = -this.speed * 101;
        this.move.y = 0;
        break;
      case 'up' :
        this.move.y = -this.speed * 80;
        this.move.x = 0;
        break;
      case 'right' :
        this.move.x = this.speed * 101;
        this.move.y = 0;
        break;
      case 'down' :
        this.move.y = this.speed * 80;
        this.move.x = 0;
        break;
      case 'enter' :
        this.sprite = this.shufflePlayer();
        this.name = this.getCurrentPlayerName();
        break;
      default :
        break;
    }
};

/**
 * @param {number} keyup current key pressed
 * @param {function} function(e)
 * Adds an event listener to the DOM that listens for allowed keypresses
 * such as 'enter', to shuffle the player character, and the 'arrow keys', to
 * move the player in one of four directions. Passes the current pressed key to
 * the handleInput function.
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
      13: 'enter',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

/**
 * @global {array} for up to 6 enemy objects
 * @global {object} for one player object
 * @global {object} for one gem object
 */
var allEnemies = [],
    player,
    gem;

/**
 * @function startGame
 * @param {number} numEnemies
 * The function startGame initializes all global objects (<= 6 enemies,
 * 1 player, 1 gem) necessary to start the game.
 */
var startGame = function(numEnemies) {
    for (var i = 0; (i < numEnemies) && (i < 5); i++) {
      allEnemies.push(new Enemy());
    }
    player = new Player();
    gem = new Gem();
};

/**
 * starts the game with the given number of enemies
 */
startGame(5);
