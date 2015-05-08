/**
 * @author Karol Zyskowski
 * Please read the README.md file for more information about the game.
 * Here is a link to the live version:
 * {@link http://karoldavid.github.io/arcade-game/ GitHub}
 */

/** app.js
 * This file provides the game functionality. Most important it provides the
 * object functionality for the enemies, the player and the gems.
 * It produces random values where necessary, detects collisions
 * (called in engine.js) and updates the objects (called in engine.js).
 * It also handles the player input, the timer and the scores
 * and it displays the game information. At the very bottom of this file it
 * initializes the enemy objects, the player and the gem and starts the game.
*/

/**
 * @function getRandomValue
 * @param {integer} min
 * @param {integer} max
 * @returns a random integer value within the given bounds of min and max
 */
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * The Game info text is diplayed on top of and below the game board,
 * it consists of 'Scores', 'Timer', 'current player character',
 * and the 'player character', the player should change to, to maximize
 * the current gem's value.
 */

/**
 * @function clearCanvasTopRight
 * The function clears the canvas partly on the top right to override changing
 * 'action' text.
 */
function clearCanvasTopRight() {
    var canvas = document.getElementsByTagName("canvas")[0];
    ctx.clearRect(300, 0, canvas.width, 200);
}

/**
 * @function clearCanvasBottom
 * The function clearCanvasBottom clears the canvas bottom to override the
 * score, the timer and the player name.
 */
function clearCanvasBottom() {
    var canvas = document.getElementsByTagName("canvas")[0];
    ctx.clearRect(0, 585, canvas.width, 25);
}

/**
 * @function writeGameTitle
 * The function is called by the function reset in engine.js.
 * The function writeGameTitle writes the game title on the very top left
 * of the canvas.
 */
function writeGameTitle() {
    ctx.font = '20pt Calibri';
    ctx.fillStyle = 'blue';
    ctx.fillText("Classic Arcade Game", 0, 30);
}

/**
 * @function writeGameAction
 * The function writeGameAction writes the 'game action' on the very top right.
 * The 'game action' tells the player whether he should move towards water
 * or change the player by pressing 'enter' in order to maximize the gem value.
 */
function writeGameAction(action) {
    ctx.font = '14pt Calibri';
    ctx.fillStyle = 'red';
    ctx.fillText(action + "!", 300, 30);
}

/**
 * @function writeGameRules
 * The function is called by the function reset in engine.js.
 * The function writeGameRules displays the game rules explanation.
 * You find it on the very bottom of the game.
 * The README.md file contains a more detailed explanation of the game rules.
 */
function writeGameRules() {
    ctx.font = '12pt Calibri';
    ctx.fillStyle = 'gray';
    ctx.fillText("Cursors: Move", 0, 630);
    ctx.fillText("Enter: Change Player", 150, 630);
    ctx.fillText("Multiply Gem Value: Choose appropriate Player", 0, 650);
    ctx.fillText("Beat Timer: Reach Water", 0, 670);
    ctx.fillText("Game Over: Collision with Bug/ Rock or Time Out", 0, 690);
}

/**
 * Timer: the player will have to beat the timer. The timer is always running.
 * The more time the player needs to reach the water the more scores he looses.
 */

/**
 * @param {integer} count
 * @constant {integer} MAX_COUNT
 * @function counter
 * The function counter is called by the function updateEntities in engine.js
 */
var count = 0, // start value of the game time counter
    MAX_COUNT = 300, // maximum value of the game time counter
    counter = setInterval(writeTimer, 1000); // the interval of the time counter

/**
 * @function writeTime
 * The function is called by the function updateEntities in engine.js.
 * The function writeTimer displays the current time in relation to the maximum
 * value of the time counter ('time out') to the player.
 */
function writeTimer() {
    ctx.font = '14pt Calibri';
    ctx.fillStyle = 'red';
    ctx.fillText(MAX_COUNT + "/ ", 200, 603);
    ctx.fillText(count, 240, 603);
    count = count + 1;
    clearInterval(counter);
}

/**
 * @function timeOut
 * @returns true if the time counter is bigger than the maximum allowed value,
 * otherwise false.
 * The function timeOut checks whether the current value of the timer is
 * bigger then the maximum allowed value of 300.
 */
function timeOut() {
    if (count > MAX_COUNT) { return true; }
    return false;
}

/**
 * Gems: single gems appear randomly on the board. They can be collected by
 * the player simply by overrunning them. Different gems have different values.
 * Some of the gems match to a specific player character. If it is collected by
 * this specific player character, the value is multiplied by 10. The Rock is
 * in the gem list, but running into it is fatal to the player. This is handled
 * by the function checkCollisions in engine.js.
 */

/**
 * @function Gem
 * The function gem calls its init function. The gem is set twice
 * (here and in the reset function), therefore I prefere to wrap it
 * in an own function to avoid repeating code.
 */

var Gem = function() {
    this.init();
};

/**
 * @function
 * @returns an array with 8 different image url strings for the gem sprite.
 */
Gem.prototype.imageURLs = function() {
    return [
      'images/Gem Blue.png',
      'images/Gem Green.png',
      'images/Gem Orange.png',
      'images/Heart.png',
      'images/Key.png',
      'images/Rock.png',
      'images/Selector.png',
      'images/Star.png'
    ];
};

/**
 * @function
 * @returns one random image url string for the gem sprite.
 */
Gem.prototype.getRandomImageURL = function() {
    var gemImageURLs = this.imageURLs(),
        image = getRandomValue(0, gemImageURLs.length - 1);
    return gemImageURLs[image];
};

/**
 * @function
 * The function initalizes the current gem. The gem gets a random image url
 * string and a random x and y integer position value.
 */
Gem.prototype.init = function() {
    this.sprite = this.getRandomImageURL();
    this.x = getRandomValue(0, 4) * 101;
    this.y = getRandomValue(1, 3) * 70;
};

/**
 * @function
 * The function resets the current gem by calling the gem init function.
 */
Gem.prototype.reset = function() {
    this.init();
};

/**
 * @function
 * The function is called by the function updateEntities in engine.js.
 * The function handles the display of information related to the gem value
 * in relation with the player's current character. It tells the player whether
 * he should move or change to another player character to maximize the current
 * gem's value. The function also clears the space on the canvas where the
 * game action hints 'change player!' and 'keep moovin!' are displayed.
 */
Gem.prototype.update = function() {
    clearCanvasTopRight();
    if (this.multiplyScore(player.name) != player.name) {
      writeGameAction('Change Player');
      ctx.drawImage(Resources.get(player.getPlayerURL(this.multiplyScore(player.name))), 450, -20, 40, 70);
    } else {
        writeGameAction('Keep movin');
    }
};

/**
 * @function
 * The function paints the gem onto the canvas.
 */
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * @function
 * The function is called by the function checkCollisions in engine.js.
 * The function checks whether a collision between gem and player occurs.
 * @returns true or false
 */
Gem.prototype.checkCollision = function() {
    var gemBox = { 'x' : 50, 'y' : 50 },
        playerBox = { 'x' : 50, 'y' : 50 },
        g = {
          "right" : this.x + gemBox.x,
          "left" : this.x, "top" : this.y,
          "bottom" : this.y + gemBox.y
        },
        p = {
          "right" : player.x + playerBox.x,
          "left" : player.x,
          "top" : player.y,
          "bottom" : player.y + playerBox.y
    };

    return !( g.left > p.right ||
              g.right < p.left ||
              g.top > p.bottom ||
              g.bottom < p.top );
};

/**
 * @function
 * The function puts the gem off canvas after the player has collected the gem.
 * It also checks whether the player charcter matches with the gem-player list.
 * If yes, it multiplies the value of the current gem by 10.
 * If not, it adds the normal gem value to the players score.
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
 * @function
 * @returns an array with 8 gem name strings
 */
Gem.prototype.gemNames = function() {
    return [
      'Blue',
      'Green',
      'Orange',
      'Heart',
      'Key',
      'Rock',
      'Selector',
      'Star'
    ];
};

/**
 * @function
 * The function matches the player with the collected gem. If they match,
 * it returns the current player name, and the current gem value can be
 * multiplied by 10.
 */
Gem.prototype.multiplyScore = function(currentPlayer) {
    var players = player.getPlayerNames(), // gets player names array
        gemPlayer = { // assigns gems to players
          'Blue' : players[0],
          'Green' : players[1],
          'Orange' : players[2],
          'Heart' : players[3],
          'Star' : players[4]
    },
        currentGem = this.sprite;

    for (var g in gemPlayer) {
      if (currentGem.match(g)) {
        return gemPlayer[g];
      }
    }
    return currentPlayer;
};

/**
 * @function
 * @returns the current gem's value
 */
Gem.prototype.gemScoreList = function() {
    var gemScore = {
      'Blue' : 10,
      'Green' : 20,
      'Orange' : 30,
      'Heart' : 40,
      'Key' : 100,
      'Rock' : 0,
      'Selector' : 5,
      'Star' : 50
    },
       currentGem = this.sprite;

    for (var g in gemScore) {
      if (currentGem.match(g)) { return gemScore[g]; }
    }
    return 0;
};

/**
 * @function
 * enemies
 */
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = -101; // start off canvas
    this.y = getRandomValue(1, 3) * 70;
    this.speed = getRandomValue(80,200);
};

/**
 * @function
 * The function is called by the function updateEntities in engine.js.
 * The function resets the enemy when it reaches the right side of the board so
 * that it can reappear on the left side.
 */
Enemy.prototype.update = function(dt) {
    if (this.x <= 606) {
      this.x = this.x + (this.speed * dt);
    } else {
        this.reset();
    }
};

/**
 * @function
 * The function paints the enemy onto the canvas.
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * @function
 * The function is called by the function checkCollisions in engine.js.
 * The function checks whether there is a collision between an enemy and
 * the player.
 * @returns true or false
 */
Enemy.prototype.checkCollision = function() {
    var enemyBox = { 'x' : 75, 'y' : 50 },
        playerBox = { 'x' : 50, 'y' : 50 },
        e = {
          "right" : this.x + enemyBox.x,
          "left" : this.x,
          "top" : this.y,
          "bottom" : this.y + enemyBox.y
    },
        p = {
          "right" : player.x + playerBox.x,
          "left" : player.x ,
          "top" : player.y,
          "bottom" : player.y + playerBox.y
    };

    return !( e.left > p.right ||
              e.right < p.left ||
              e.top > p.bottom ||
              e.bottom < p.top );
};

/**
 * @function
 * The function resets the enemy's position and speed to new random values.
 */
Enemy.prototype.reset = function() {
    this.x = -101; // start off canvas
    this.y = getRandomValue(1, 3) * 70;
    this.speed = getRandomValue(80,300);
};

/**
 * player
 */

/**
 * @function
 * The function initializes the players values like default player sprite, the
 * x and y values for the player's start position, the scores starting from 0,
 * the player's name.
 */
var Player = function() {
    this.sprite = "images/char-boy.png"; // default player
    this.x = 200; // start x-position
    this.y = 370; // start y-position
    this.speed = 1;
    this.move = { 'x' : 0, 'y' : 0 }; // when y, x = 0 player does not move
    this.score = 0; // initial/ min. score; score never goes below zero
    this.name = this.getPlayerName(); // gets the player name from the sprite url
};

/**
 * @function
 * The function returns an array with 5 player name strings.
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
 * @function
 * The function compares the current sprite url srting with the player name
 * strings array and returns the current player name string.
 */
Player.prototype.getPlayerName = function() {
    var playerNames = this.getPlayerNames(), // get player names array
        length = playerNames.length,
        currentPlayer = this.sprite; // get current player sprite url
    for (var i = 0; i < length; i++) {
      if (currentPlayer.match(playerNames[i])) { // match player name to sprite url
        return playerNames[i]; // if there is a match, return the player name
      }
    }
};

/**
 * @function
 * The function returns the current player's sprite url string depending on the
 * given player name string.
 */
Player.prototype.getPlayerURL = function(playerName) {
    var playerNames = this.getPlayerNames();
        length = playerNames.length;
    if (playerName === playerNames[0]) {
      return "images/char-" + playerName + ".png"; // url for boy sprite
    }
    for (var i = 1; i < length; i++) {
      if (playerNames[i] === playerName )
      {
        return "images/char-" + playerName + "-girl" + ".png"; // url for girls sprite
      }
    }
    return "images/blank.png"; // fallback
};

/**
 * @function
 * The function shuffles the player's character when 'enter' is hit. To do so it
 * matches the current player's sprite url string against a player name string
 * array.
 * @returns player sprite url string
 */
Player.prototype.shufflePlayer = function() {
    var playerNames = this.getPlayerNames(),
        length = playerNames.length,
        currentPlayer = this.sprite;
    for (var i = 0; i < length; i++) {
      if (currentPlayer.match(playerNames[i]) && i + 1 < length) {
        return "images/char-" + playerNames[i+1] + "-girl" + ".png"; // url for girls sprite
      }
    }
    return "images/char-" + playerNames[0] + ".png"; // url for boy sprite, shuffle restarts from 0
};

/**
 * @function
 * The function is called by the function updateEntities in engine.js.
 * The function updates all information vital to the player. It checks that
 * the player's position never leaves to board. It also checks whether the
 * player reaches the water. If yes, it adds 100 to the player's score and
 * continues the game from the start line. In case of a time out, the game is
 * over and the player starts from the start line with 0 points. It also updates
 * The current player characters name and the current player's score on the
 * bottom of the board.
 */
Player.prototype.update = function() {
    this.moveInBounds(); // player position changes only within the predefined bounds
    if (this.detectGoal()) {
      this.score += 100; // score increases by 100 when player reaches water
      this.reset(false); // game continues from start
    }
    if (timeOut()) {
      this.reset(true); // game over/ reset
    }
    clearCanvasBottom();
    this.writePlayerName();
    this.writeScore();
};

/**
 * @function
 * The function paints the player onto the canvas.
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/**
 * @function
 * The function updates the player's coordinates if the new coordinates are
 * inside the given bounds of the board.
 */
Player.prototype.moveInBounds = function() {
    var newX = this.x + this.move.x, // calculate new x-coordiante
        newY = this.y + this.move.y; // calculate new y coordinate
    if (newX >= -80 && newX <= 480) { this.x = newX; } // if in bounds on x-axis update players x-coordinate
    if (newY >= -90 && newY <= 370) { this.y = newY; } // if in bounds on y-axis update players y-coordinate
    this.move = { 'x' : 0, 'y' : 0 }; // reset move variable to zero
};

/**
 * @function
 * The function checks if the player reaches the water.
 * @returns true or false
 */
Player.prototype.detectGoal = function() {
    return !( this.y >= 0);
};

/**
 * @function
 * @param {boolean} collision
 * The function is called by the function checkCollisions in engine.js.
 * The function resets the player's values. If the reset is due to a collision,
 * the player loses all his scores, the game is over and starts again. If the
 * player made it wo the water without collision, the time needed is substracted
 * from the player's score.
 */
Player.prototype.reset = function(collision) {
    this.x = 200;
    this.y = 370;
    this.speed = 1;
    this.move = { 'x' : 0, 'y' : 0 };
    if (collision) {
      this.score = 0; // everything fatal such as collision with enemy/ rock or time out resets player score
    } else {
        this.score -= Math.round(count / 10); // the more time the player needs to reach the water, the more score he looses
        if (this.score < 0) { this.score = 0; } // player score minimum is zero
    }
    count = 0;
    gem.reset(); // make gem reappear
};

/**
 * @function
 * The function writes the players score onto the bottom left of the canvas.
 */
Player.prototype.writeScore = function() {
    ctx.font = '14pt Calibri';
    ctx.fillStyle = 'red';
    ctx.fillText("Score: " + this.score, 0, 603);
};

/**
 * @function
 * The function writes the player's name onto the bottom right of the canvas.
 */
Player.prototype.writePlayerName = function() {
    ctx.font = '14pt Calibri';
    ctx.fillStyle = 'red';
    ctx.fillText(this.name, 400, 603);
};

/**
 * @function
 * The function handles the input and therefore allows to control the game.
 * 'Arrow keys' move the player into the according direction and 'Return'
 * shuffles the players character.
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
        this.name = this.getPlayerName();
        break;
    }
};

/**
 * Adds an event listener to the DOM that listens for allowed keypresses
 * such as 'enter', to shuffle the player character, and the 'arrow keys', to
 * move the player in one of four directions
 */
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
      13: 'enter', // shuffle player character
      37: 'left',  // move player left
      38: 'up',    // move player up
      39: 'right', // move player right
      40: 'down'   // move player down
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

/**
 * @param {array} for up to 6 enemy objects
 * @param {object} for one player object
 * @param {object} for one gem object
 */
var allEnemies = [],
    player,
    gem;

/**
 * @function startGame
 * The function startGame initializes all variables necessary to start the game.
 * Up to 6 enemy bugs or enemy objects, one player object and one gem object
 * are created in the global scope.
 */
var startGame = function(numEnemies) {
    for (var i = 0; (i < numEnemies) && (i < 5); i++) { // max enemies <= 6
      allEnemies.push(new Enemy()); // creates x enemy bugs/ enemies
    }
    player = new Player(); // creates one player
    gem = new Gem(); // creates one gem
};

startGame(5); // starts the Game with the given number of enemies
