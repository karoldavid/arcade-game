/*
 *
 * timer
 *
 */

var count = 0,
    counter = setInterval(timer, 1000);

function timer() {
  ctx.font = '15pt Calibri';
  ctx.fillStyle = 'red';
  ctx.fillText("Timer: " + count, 200, 605);
  count = count + 1;
  clearInterval(counter);
}

function timeOut() {
  if (count > 2500) return true;
  return false;
}

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
 * gems
 *
 */

function getImageURL() {
  var gemImages = [
          'images/Gem Blue.png',
          'images/Gem Green.png',
          'images/Gem Orange.png',
          'images/Heart.png',
          'images/Key.png',
          'images/Rock.png',
          'images/Selector.png',
          'images/Star.png',
        ],
        image = getRandomValue(0, gemImages.length - 1);
  return gemImages[image];
}

var Gem = function() {
  this.sprite = getImageURL();
  this.x = getRandomValue(0, 4) * 101;
  this.y = getRandomValue(1, 3)* 70;
}

Gem.prototype.update = function() {

}

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

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

Gem.prototype.reset = function() {
  this.sprite = getImageURL();
  this.x = getRandomValue(0, 4) * 101;
  this.y = getRandomValue(1, 3) * 70;
}

Gem.prototype.hide = function() {
  this.x = -100;  // off canvas
  this.y = -100; // off canvas
  player.score += 10; // player score inreases because gem only hides because of collision with player
}

/*
 *
 * enemies
 *
 */

var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = -50; // start off canvas
    this.y = getRandomValue(1, 3) * 70;
    this.speed = getRandomValue(80,200);
}

Enemy.prototype.update = function(dt) {
  if (this.x <= 550) {
    this.x = this.x + (this.speed * dt);
  } else {
    this.reset();
  }
}

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Enemy.prototype.checkCollision = function() {
  var enemyBox = { 'x' : 50, 'y' : 50 },
      playerBox = { 'x' : 50, 'y' : 50 },
      e = { "right" : this.x + enemyBox.x, "left" : this.x, "top" : this.y, "bottom" : this.y + enemyBox.y },
      p = { "right" : player.x + playerBox.x, "left" : player.x, "top" : player.y, "bottom" : player.y + playerBox.y };

  return !( e.left > p.right ||
            e.right < p.left ||
            e.top > p.bottom ||
            e.bottom < p.top);
}

Enemy.prototype.reset = function() {
  this.x = -50; // start off canvas
  this.y = getRandomValue(1, 3) * 70;
  this.speed = getRandomValue(80,300);
}

/*
 *
 * player
 *
 */

function writePlayerName(currentPlayer) {
  ctx.font = '15pt Calibri';
  ctx.fillStyle = 'red';
  ctx.fillText(currentPlayer, 400, 605);
}

var Player = function() {
  this.sprite = "images/char-boy.png"; // default player
  this.x = 200;
  this.y = 370;
  this.speed = 1;
  this.move = { 'x' : 0, 'y' : 0 };
  this.score = 0;
  this.name = this.getPlayerName();
}

Player.prototype.getPlayerName = function() {
  var playerNames = ['boy', 'cat', 'horn', 'pink', 'princess'],
      length = playerNames.length,
      currentPlayer = this.sprite;
  for (var i = 0; i < length; i++) {
    if (currentPlayer.match(playerNames[i])) return playerNames[i];
  }
}

Player.prototype.chosenPlayer = function() {
  var playerImage = ['boy', 'cat', 'horn', 'pink', 'princess'],
      length = playerImage.length,
      currentPlayer = this.sprite;
  for (var i = 0; i < length; i++) {
    if (currentPlayer.match(playerImage[i]) && i + 1 < length) return "images/char-" + playerImage[i+1] + "-girl" + ".png";
  }
  return "images/char-" + playerImage[0] + ".png";
}

Player.prototype.update = function() {
  this.moveInBounds();
  if (this.detectGoal()) {
    this.score += 100;
    this.reset(false);
  }
  if (timeOut()) this.reset(true);
  this.updateScore();
  writePlayerName(this.name);
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.moveInBounds = function() {
  var newX = this.x + this.move.x,
      newY = this.y + this.move.y;
  if (newX >= -80 && newX <= 480) this.x = newX;
  if (newY >= -90 && newY <= 370) this.y = newY;
  this.move = { 'x' : 0, 'y' : 0 };
}

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
    this.score -= Math.round(count / 10);
    if (this.score < 0) this.score = 0;
  }
  count = 0;
  gem.reset();
}

Player.prototype.updateScore = function() {
  var canvas = document.getElementsByTagName("canvas")[0];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '15pt Calibri';
  ctx.fillStyle = 'red';
  ctx.fillText("Score: " + this.score, 0, 605);
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
      this.sprite = this.chosenPlayer();
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
        13: 'enter', // change player
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
