/*
 *
 * random
 *
 */

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*
 *
 * game info text
 *
 */

function clearCanvasTopRight() {
  var canvas = document.getElementsByTagName("canvas")[0];
  ctx.clearRect(250, 0, canvas.width, 200);
}

function clearCanvasBottom() {
  var canvas = document.getElementsByTagName("canvas")[0];
  ctx.clearRect(0, 585, canvas.width, canvas.height);
}

function writeGameTitle() {
  ctx.font = '20pt Calibri';
  ctx.fillStyle = 'blue';
  ctx.fillText("Classic Arcade Game", 0, 30);
}

function writeGameAction(action) {
  ctx.font = '14pt Calibri';
  ctx.fillStyle = 'red';
  ctx.fillText(action + "!", 300, 30);
}

/*
 *
 * timer
 *
 */

var count = 0,
    maxCount = 300,
    counter = setInterval(writeTimer, 1000);

function writeTimer() {
  ctx.font = '14pt Calibri';
  ctx.fillStyle = 'red';
  ctx.fillText(maxCount + "/ ", 200, 603);
  ctx.fillText(count, 240, 603);
  count = count + 1;
  clearInterval(counter);
}

function timeOut() {
  if (maxCount > 300) return true;
  return false;
}

/*
 *
 * gems
 *
 */

var Gem = function() {
  this.init();
}

Gem.prototype.imageURLs = function() {
  return ['images/Gem Blue.png',
          'images/Gem Green.png',
          'images/Gem Orange.png',
          'images/Heart.png',
          'images/Key.png',
          'images/Rock.png',
          'images/Selector.png',
          'images/Star.png' ]
}

Gem.prototype.getImageURL = function() {
  var gemImageURLs = this.imageURLs(),
        image = getRandomValue(0, gemImageURLs.length - 1);
  return gemImageURLs[image];
}

Gem.prototype.init = function() {
  this.sprite = this.getImageURL();
  this.x = getRandomValue(0, 4) * 101;
  this.y = getRandomValue(1, 3) * 70;
}

Gem.prototype.reset = function() {
  this.init();
}

Gem.prototype.update = function() {
  clearCanvasTopRight();
  if (this.multiplyScore(player.name) != player.name) {
    writeGameAction('Change Player');
    ctx.drawImage(Resources.get(player.getPlayerURL(this.multiplyScore(player.name))), 450, -20, 40, 70);
  } else {
    writeGameAction('Keep movin')
  }
}

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// checks collision of gem with player
Gem.prototype.checkCollision = function() {
  var gemBox = { 'x' : 50, 'y' : 50 },
      playerBox = { 'x' : 50, 'y' : 50 },
      g = { "right" : this.x + gemBox.x, "left" : this.x, "top" : this.y, "bottom" : this.y + gemBox.y },
      p = { "right" : player.x + playerBox.x, "left" : player.x, "top" : player.y, "bottom" : player.y + playerBox.y };

  return !( g.left > p.right ||
            g.right < p.left ||
            g.top > p.bottom ||
            g.bottom < p.top);
}

Gem.prototype.hide = function() {
  this.x = -100;  // put gem off canvas after player collects gem
  this.y = -100; // put gem off canvas after player collects gem
  if (this.multiplyScore(player.name) === player.name) {
    player.score += this.gemScore() * 10; // player score increases when gem collision with player occurs
  } else {
    player.score += this.gemScore();
  }
}

Gem.prototype.gemNames = function() {
  return [ 'Blue', 'Green', 'Orange', 'Heart', 'Key', 'Rock', 'Selector', 'Star' ];
}

Gem.prototype.multiplyScore = function(currentPlayer) {
  var players = player.getPlayerNames(),
      gems = this.gemNames(),
      gemPlayer = { 'Blue' : players[0], 'Green' : players[1], 'Orange' : players[2], 'Heart' : players[3], 'Star' : players[4] },
      currentGem = this.sprite;
      for (g in gemPlayer) {
        if (currentGem.match(g)) return gemPlayer[g];
      }
  return currentPlayer;
}

// different gems have different values
Gem.prototype.gemScore = function() {
  var gemScore = { 'Blue' : 10, 'Green' : 20, 'Orange' : 30, 'Heart' : 40, 'Key' : 100, 'Rock' : 0, 'Selector' : 5, 'Star' : 50 },
      currentGem = this.sprite;
  for (g in gemScore) {
    if (currentGem.match(g)) return gemScore[g];
  }
  return 0;
}

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
}

Enemy.prototype.update = function(dt) {
  if (this.x <= 606) {
    this.x = this.x + (this.speed * dt);
  } else {
    this.reset(); // enemy reaches right side of board and starts over again on the left side
  }
}

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// checks collision of enemies with player
Enemy.prototype.checkCollision = function() {
  var enemyBox = { 'x' : 75, 'y' : 50 },
      playerBox = { 'x' : 50, 'y' : 50 },
      e = { "right" : this.x + enemyBox.x, "left" : this.x, "top" : this.y, "bottom" : this.y + enemyBox.y },
      p = { "right" : player.x + playerBox.x, "left" : player.x , "top" : player.y, "bottom" : player.y + playerBox.y };

  return !( e.left > p.right ||
            e.right < p.left ||
            e.top > p.bottom ||
            e.bottom < p.top);
}

// enemy gets new random coordinats and speed
Enemy.prototype.reset = function() {
  this.x = -101; // start off canvas
  this.y = getRandomValue(1, 3) * 70;
  this.speed = getRandomValue(80,300);
}

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
}

Player.prototype.getPlayerNames = function() {
  return ['boy', 'cat', 'horn', 'pink', 'princess'];
}

// compares sprite url with names array to discract current player name
Player.prototype.getPlayerName = function() {
  var playerNames = this.getPlayerNames(),
      length = playerNames.length,
      currentPlayer = this.sprite;
  for (var i = 0; i < length; i++) {
    if (currentPlayer.match(playerNames[i])) return playerNames[i];
  }
}

Player.prototype.getPlayerURL = function(playerName) {
  var playerNames = this.getPlayerNames();
      length = playerNames.length;
  if (playerName === playerNames[0]) {
    return "images/char-" + playerName + ".png";
  }
  for (i = 1; i < length; i++) {
    if (playerNames[i] === playerName )return "images/char-" + playerName + "-girl" + ".png";
  }
  return "images/blank.png";
}

// shuffles player when 'enter' is hit
// matches current player sprite url against images array and shuffles accordingly
Player.prototype.shufflePlayer = function() {
  var playerNames = this.getPlayerNames(),
      length = playerNames.length,
      currentPlayer = this.sprite;
  for (var i = 0; i < length; i++) {
    if (currentPlayer.match(playerNames[i]) && i + 1 < length) return "images/char-" + playerNames[i+1] + "-girl" + ".png";
  }
  return "images/char-" + playerNames[0] + ".png";
}

Player.prototype.update = function() {
  this.moveInBounds(); // player position only changes within the defined bounds
  if (this.detectGoal()) {
    this.score += 100; // score increas by 100 when player reaches water
    this.reset(false); // game continues from start
  }
  if (timeOut()) {
    this.reset(true);
  }
  clearCanvasBottom();
  this.writePlayerName();
  this.writeScore();
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// makes sure that player coordinates only change if the player moves inside the given bounds
Player.prototype.moveInBounds = function() {
  var newX = this.x + this.move.x,
      newY = this.y + this.move.y;
  if (newX >= -80 && newX <= 480) this.x = newX;
  if (newY >= -90 && newY <= 370) this.y = newY;
  this.move = { 'x' : 0, 'y' : 0 };
}

// checks if the player reaches water
Player.prototype.detectGoal = function() {
  return !( this.y >= 0);
}

Player.prototype.reset = function(collision) {
  this.x = 200;
  this.y = 370;
  this.speed = 1;
  this.move = { 'x' : 0, 'y' : 0 };
  if (collision) {
    this.score = 0;
  } else {
    this.score -= Math.round(count / 10); // the more time the player needs to reach the water, the more score he looses
    if (this.score < 0) this.score = 0;
  }
  count = 0;
  gem.reset(); // make geme reappear
}

Player.prototype.writeScore = function() {
  ctx.font = '14pt Calibri';
  ctx.fillStyle = 'red';
  ctx.fillText("Score: " + this.score, 0, 603);
}

Player.prototype.writePlayerName = function() {
  ctx.font = '14pt Calibri';
  ctx.fillStyle = 'red';
  ctx.fillText(this.name, 400, 603);
}

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
}

/*
 *
 * controls
 *
 */

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter', // shuffle player
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
