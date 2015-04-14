/*
 *
 * random
 *
 */

// random values for player, gem and enemy position, speed etc.
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
 *
 * game info text
 *
 */

// clears canvas on the top right partly to override changing 'action' text
function clearCanvasTopRight() {
    var canvas = document.getElementsByTagName("canvas")[0];
    ctx.clearRect(300, 0, canvas.width, 200);
}

// clears canvas bottom to override score, timer and player name
function clearCanvasBottom() {
    var canvas = document.getElementsByTagName("canvas")[0];
    ctx.clearRect(0, 585, canvas.width, 25);
}

// writes game title on the very top left
function writeGameTitle() {
    ctx.font = '20pt Calibri';
    ctx.fillStyle = 'blue';
    ctx.fillText("Classic Arcade Game", 0, 30);
}

// writes game 'action' on the very top right
// game 'action' tells the player whether he should move towards water
// or change the player in order to maximize gem value
function writeGameAction(action) {
    ctx.font = '14pt Calibri';
    ctx.fillStyle = 'red';
    ctx.fillText(action + "!", 300, 30);
}

// short gem rules explanation is on the very bottom of the game
function writeGameRules() {
    ctx.font = '12pt Calibri';
    ctx.fillStyle = 'gray';
    ctx.fillText("Cursors: Move", 0, 630);
    ctx.fillText("Enter: Change Player", 150, 630);
    ctx.fillText("Multiply Gem Value: Choose appropriate Player", 0, 650);
    ctx.fillText("Beat Timer: Reach Water", 0, 670);
    ctx.fillText("Game Over: Collision with Bug/ Rock or Time Out", 0, 690);
}

/*
 *
 * timer, the player will have to beat the timer. the timer is always running.
 * the more time the player needs the more scores he looses
 *
 */

var count = 0, // start value of the game time counter
    MAX_COUNT = 300, // maximum value of the game time counter
    counter = setInterval(writeTimer, 1000); // the interval between increments of the game time counter

// shows the maximum value of the time counter ('time out') to the player
function writeTimer() {
    ctx.font = '14pt Calibri';
    ctx.fillStyle = 'red';
    ctx.fillText(MAX_COUNT + "/ ", 200, 603);
    ctx.fillText(count, 240, 603);
    count = count + 1;
    clearInterval(counter);
}

function timeOut() {
    if (count > MAX_COUNT) { return true; } // if the time counter value is bigger than the maximum allowed value: 'time out'
    return false;
}

/*
 *
 * Gems, single gems appear randomly on the board. They can be collected by the player simply by overrunning them.
 * Different gems have different values. Some of the gems match to a specific player. If it is collected by him, the value
 * is multiplied by 10. The Rock is in the gem list, but running into it is fatal to the player.
 *
 */

var Gem = function() {
    this.init(); // gem is set twice (here and in reset), therefore I prefere
};             // to call 2 times the function init istead of repeating the code

// returns image urls array for the gem sprite
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

// returns random imageURL for the gem sprite
Gem.prototype.getRandomImageURL = function() {
    var gemImageURLs = this.imageURLs(),
        image = getRandomValue(0, gemImageURLs.length - 1);
    return gemImageURLs[image];
};

// init gem
Gem.prototype.init = function() {
    this.sprite = this.getRandomImageURL(); // gets random sprite url
    this.x = getRandomValue(0, 4) * 101; // random x position on the board
    this.y = getRandomValue(1, 3) * 70; // random y position on the board
};

Gem.prototype.reset = function() {
    this.init();
};

Gem.prototype.update = function() {
    clearCanvasTopRight(); // clears the space where the game action hints 'change player!' and 'keep moovin!' are displayed
    if (this.multiplyScore(player.name) != player.name) {
      writeGameAction('Change Player'); // game action tells the player to change the player in order to maximize gem value
      ctx.drawImage(Resources.get(player.getPlayerURL(this.multiplyScore(player.name))), 450, -20, 40, 70); // if player and gem do not match the appropriate player is displayed on the top right
    } else {
        writeGameAction('Keep movin'); // game action tells the player that he has to change the player to get
    }                                  //  extra gem score
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// checks gem collision with player
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
              g.bottom < p.top);
};

Gem.prototype.hide = function() {
    this.x = -100;  // puts gem x position off canvas after player collects gem
    this.y = -100;  // puts gem y position off canvas after player collects gem
    if (this.multiplyScore(player.name) === player.name) {
      player.score += this.gemScoreList() * 10; // multiply gem score by 10 if gem collision with specific player occurs
    } else {
        player.score += this.gemScoreList(); // player score increases by normal gem list score value when gem collision with player occurs
    }
};

// returns gem names array
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

// matches the player with the collected gem, if there is a match, the actual
// gem score is multiplied by 10
Gem.prototype.multiplyScore = function(currentPlayer) {
    var players = player.getPlayerNames(), // gets player names array
        gemPlayer = { // assigns gems to players
          'Blue' : players[0],
          'Green' : players[1],
          'Orange' : players[2],
          'Heart' : players[3],
          'Star' : players[4]
        },
        currentGem = this.sprite; // gets the current gem url

    for (var g in gemPlayer) { // gets one gem name after another
      if (currentGem.match(g)) { // matches gem url with gem name
        return gemPlayer[g]; // if there is a match, returns the specific player => gem value will be multiplied by 10
      }
    }
    return currentPlayer;
};

// different gems have different values
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
      if (currentGem.match(g)) { return gemScore[g]; } // return current gem's value
    }
    return 0;
};

/*
 *
 * enemies
 *
 */

var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = -101; // start off canvas
    this.y = getRandomValue(1, 3) * 70;
    this.speed = getRandomValue(80,200);
};

Enemy.prototype.update = function(dt) {
    if (this.x <= 606) {
      this.x = this.x + (this.speed * dt);
    } else {
        this.reset(); // when enemy reaches right side of board and starts over again on the left side
    }
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// checks enemy collision with player
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
              e.bottom < p.top);
};

// enemy gets new random coordinates and speed
Enemy.prototype.reset = function() {
    this.x = -101; // start off canvas
    this.y = getRandomValue(1, 3) * 70;
    this.speed = getRandomValue(80,300);
};

/*
 *
 * player
 *
 */

// players initial values
var Player = function() {
    this.sprite = "images/char-boy.png"; // default player
    this.x = 200; // start x-position
    this.y = 370; // start y-position
    this.speed = 1;
    this.move = { 'x' : 0, 'y' : 0 }; // when x and y of move are set to zero, player does not move
    this.score = 0; // initial score; minimum score; score never goes below zero
    this.name = this.getPlayerName(); // extracts the player name from the sprite url
};

// returns a player names array
Player.prototype.getPlayerNames = function() {
    return [
      'boy',
      'cat',
      'horn',
      'pink',
      'princess'
    ];
};

// compares sprite url with names array to extract current player name
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

// returns current player url depending on given player name
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

// shuffles player when 'enter' is hit
// matches current player sprite url against images array and shuffles accordingly
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

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// makes sure that player coordinates only change if the player moves inside the given bounds
Player.prototype.moveInBounds = function() {
    var newX = this.x + this.move.x, // calculate new x-coordiante
        newY = this.y + this.move.y; // calculate new y coordinate
    if (newX >= -80 && newX <= 480) { this.x = newX; } // if in bounds on x-axis update players x-coordinate
    if (newY >= -90 && newY <= 370) { this.y = newY; } // if in bounds on y-axis update players y-coordinate
    this.move = { 'x' : 0, 'y' : 0 }; // reset move variable to zero
};

// checks if the player reaches water
Player.prototype.detectGoal = function() {
    return !( this.y >= 0);
};

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

Player.prototype.writeScore = function() {
    ctx.font = '14pt Calibri';
    ctx.fillStyle = 'red';
    ctx.fillText("Score: " + this.score, 0, 603);
};

Player.prototype.writePlayerName = function() {
    ctx.font = '14pt Calibri';
    ctx.fillStyle = 'red';
    ctx.fillText(this.name, 400, 603);
};

/*
 *
 * controls
 *
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

// listens for allowed keypresses
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
      13: 'enter', // shuffle player
      37: 'left',  // move player left
      38: 'up',    // move player up
      39: 'right', // move player right
      40: 'down'   // move player down
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

//creates all variables necessary in the global scope to start game
var allEnemies = [], // array for up to 6 enemies
    player, // var for 1 player
    gem; // var for 1 gem

var startGame = function(numEnemies) {
    for (var i = 0; (i < numEnemies) && (i < 5); i++) { // max allowed enemies = 6
      allEnemies.push(new Enemy()); // creates x enemy bugs
    }
    player = new Player(); // creates 1 player
    gem = new Gem(); // creates 1 gem
};

startGame(5); // max allowed enemies = 6
