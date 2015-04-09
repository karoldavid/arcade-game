
var count = 0,
    counter = setInterval(timer, 1000);

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function timer() {
  ctx.font = '20pt Calibri';
  ctx.fillStyle = 'red';
  ctx.fillText(count, 400, 605);
  count = count + 1;
  clearInterval(counter);
}

function getRandomSpeed(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomHeight(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.x = -50;
    this.y = getRandomHeight(50,250);
    this.speed = getRandomSpeed(20,60);
}

Enemy.prototype.update = function(dt) {
  if (this.x <= 550) {
    this.x = this.x + (this.speed * dt);
  } else {
    this.reset();
  }
  if (this.detectCollission()) {
    player.reset(true);
  }
}

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

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

Enemy.prototype.reset = function() {
  this.x = -50;
  this.y = getRandomHeight(50,250);
  this.speed = getRandomSpeed(20,60);
}

var Player = function(chosenPlayer) {
  this.sprite = "images/char-boy.png";
  this.x = 200;
  this.y = 400;
  this.speed = 1;
  this.move = { 'x' : 0, 'y' : 0 };
  this.score = 0;
}

function chosenPlayer(currentPlayer) {
  var playerImage = ['boy', 'cat-girl', 'horn-girl', 'pink-girl', 'princess-girl'],
      imageUrl;
    var length = playerImage.length;
    for (var i = 0; i < length; i++) {
      console.log(playerImage[i]);
        if (currentPlayer.match(playerImage[i]) && i + 1 < length) return "images/char-" + playerImage[i+1] + ".png";
    }
    return "images/char-" + playerImage[0] + ".png";
}


Player.prototype.update = function() {
  this.inBounds();
  if (this.detectGoal()) {
    this.score += 10;
    this.reset(false);
  }
  this.updateScore();
  timer();
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
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
}

Player.prototype.detectGoal = function() {
  return !( this.y >= 0);
}

Player.prototype.reset = function(collision) {
  this.x = 200;
  this.y = 400;
  this.speed = 1;
  this.move = { 'x' : 0, 'y' : 0 };
  if (collision) {
    this.score = 0;
  } else {
    this.score += count;
  }
  count = 0;
}

Player.prototype.updateScore = function() {
  var canvas = document.getElementsByTagName("canvas")[0];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '20pt Calibri';
  ctx.fillStyle = 'red';
  ctx.fillText("Score: " + this.score, 0, 605);
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

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    var playerKey = {
      13: 'enter'
    }
    if (playerKey[e.keyCode]) {
      player.sprite = chosenPlayer(player.sprite);
    }
    player.handleInput(allowedKeys[e.keyCode]);
});
