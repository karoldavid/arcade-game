function getRandomSpeed(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomHeight(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = -50;
    this.y = getRandomHeight(50,250);
    this.speed = getRandomSpeed(20,60);
}

Enemy.prototype.reset = function() {
  this.x = -50;
  this.y = getRandomHeight(50,250);
  this.speed = getRandomSpeed(20,60);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  if (this.x <= 550) {
    this.x = this.x + (this.speed * dt);
  } else {
    this.reset();
  }
  if (this.detectCollission()) {
    player.reset();
  }
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

Enemy.prototype.detectCollission = function() {
  var enemyBox = { 'x' : 50, 'y' : 50 },
      playerBox = { 'x' : 50, 'y' : 50 },
      e = { "right" : this.x + enemyBox.x, "left" : this.x, "top" : this.y, "bottom" : this.y + enemyBox.y },
      p = { "right" : player.x + playerBox.x, "left" : player.x, "top" : player.y, "bottom" : player.y + playerBox.y };

  return !( e.left > p.right ||
            e.right < p.left ||
            e.top > p.bottom ||
            e.bottom < p.top);
}

var Player = function() {
  this.sprite = 'images/char-boy.png';
  this.x = 200;
  this.y = 400;
  this.speed = 1;
  this.move = { 'x' : 0, 'y' : 0 };
}

Player.prototype.inBounds = function() {
  var newX = this.x + this.move.x,
      newY = this.y + this.move.y;

  if (newX >= 0 && newX <= 400) {
    this.x = newX;
  }
  if (newY >= -10 && newY <= 400) {
    this.y = newY;
  }
  // this.move = { 'x' : 0, 'y' : 0 };
}

Player.prototype.update = function() {
  this.inBounds();

  if (this.detectGoal()) {
    this.reset();
  }
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(key) {
  switch(key){
    case 'left' :
      this.move.x = -this.speed;
      break;
    case 'up' :
      this.move.y = -this.speed;
      break;
    case 'right' :
      this.move.x = this.speed;
      break;
    case 'down' :
      this.move.y = this.speed;
      break;
    }
}

Player.prototype.detectGoal = function() {
  return !( this.y >= 0);
}

Player.prototype.reset = function() {
  this.x = 200;
  this.y = 400;
  this.speed = 1;
  this.move = { 'x' : 0, 'y' : 0 };
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
