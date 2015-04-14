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

// clear canvas partly on the top right to override changing action text
function clearCanvasTopRight() {
  var canvas = document.getElementsByTagName("canvas")[0];
  ctx.clearRect(300, 0, canvas.width, 200);
}

// clear canvas bottom to override score, timer and player name
function clearCanvasBottom() {
  var canvas = document.getElementsByTagName("canvas")[0];
  ctx.clearRect(0, 585, canvas.width, 25);
}

// write game title on the very top right
function writeGameTitle() {
  ctx.font = '20pt Calibri';
  ctx.fillStyle = 'blue';
  ctx.fillText("Classic Arcade Game", 0, 30);
}

// game action tells the player whether he should move
// or change the player to maximize gem score
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
 */

var count = 0,
    MAX_COUNT = 300,
    counter = setInterval(writeTimer, 1000);

function writeTimer() {
  ctx.font = '14pt Calibri';
  ctx.fillStyle = 'red';
  ctx.fillText(MAX_COUNT + "/ ", 200, 603);
  ctx.fillText(count, 240, 603);
  count = count + 1;
  clearInterval(counter);
}

function timeOut() {
  if (count > MAX_COUNT) { return true; }
  return false;
}

/*
 *
 * gems
 *
 */

var Gem = function() {
  this.init(); // gem is set twice (here and in reset), therefore I prefere
};             // to call 2 times the function init

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

Gem.prototype.getImageURL = function() {
  var gemImageURLs = this.imageURLs(),
      image = getRandomValue(0, gemImageURLs.length - 1);
  return gemImageURLs[image];
};

Gem.prototype.init = function() {
  this.sprite = this.getImageURL();
  this.x = getRandomValue(0, 4) * 101;
  this.y = getRandomValue(1, 3) * 70;
};

Gem.prototype.reset = function() {
  this.init();
};

Gem.prototype.update = function() {
  clearCanvasTopRight();
  if (this.multiplyScore(player.name) != player.name) {
    writeGameAction('Change Player'); // game action tells the player, to move
    ctx.drawImage(Resources.get(player.getPlayerURL(this.multiplyScore(player.name))), 450, -20, 40, 70);
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
  this.x = -100;  // puts gem off canvas after player collects gem
  this.y = -100;
  if (this.multiplyScore(player.name) === player.name) {
    player.score += this.gemScoreList() * 10; // multiply gem score by 10 if gem collision with specific player occurs
  } else {
      player.score += this.gemScoreList(); // player score increases by normal gem list score value when gem collision with player occurs
  }
};

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
  var players = player.getPlayerNames(),
      gems = this.gemNames(),
      gemPlayer = {
        'Blue' : players[0],
        'Green' : players[1],
        'Orange' : players[2],
        'Heart' : players[3],
        'Star' : players[4]
      },
      currentGem = this.sprite;

  for (var g in gemPlayer) {
    if (currentGem.match(g)) { return gemPlayer[g]; }
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

var Player = function() {
  this.sprite = "images/char-boy.png"; // default player
  this.x = 200;
  this.y = 370;
  this.speed = 1;
  this.move = { 'x' : 0, 'y' : 0 };
  this.score = 0;
  this.name = this.getPlayerName();
};

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
  var playerNames = this.getPlayerNames(),
      length = playerNames.length,
      currentPlayer = this.sprite;
  for (var i = 0; i < length; i++) {
    if (currentPlayer.match(playerNames[i])) { return playerNames[i]; }
  }
};

// returns current player url depending on given player name
Player.prototype.getPlayerURL = function(playerName) {
  var playerNames = this.getPlayerNames();
      length = playerNames.length;
  if (playerName === playerNames[0]) {
    return "images/char-" + playerName + ".png"; // url for boy
  }
  for (var i = 1; i < length; i++) {
    if (playerNames[i] === playerName ) { return "images/char-" + playerName + "-girl" + ".png"; } // url for girls
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
      return "images/char-" + playerNames[i+1] + "-girl" + ".png"; // url for girls
    }
  }
  return "images/char-" + playerNames[0] + ".png"; // url for boy, shuffle restarts from 0, fallback
};

Player.prototype.update = function() {
  this.moveInBounds(); // player position changes only within the predefined bounds
  if (this.detectGoal()) {
    this.score += 100; // score increas by 100 when player reaches water
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

//create all variables necessary to start game
var allEnemies = [];
for (var i = 0; i < 3; i++) { allEnemies.push(new Enemy()); } // create 3 enemies
var player = new Player(); // create player
var gem = new Gem(); // create gem
