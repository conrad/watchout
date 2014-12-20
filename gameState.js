
var asteroidWidth = 40;
var asteroidHeight = 40;
var asteroids = [];
var gameHeight = $(".gamefield").height();
var gameWidth = $(".gamefield").width();
var graphics;
var round = 0;
var player = {
  x: gameWidth / 2,
  y: gameHeight / 2,
  totalVelocity: function() {
    return Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2))
  },
  setPos: function() {
    this.x += this.velocity.x;
    this.y -= this.velocity.y;

    if (this.y < -this.height) {
      this.y = gameHeight;
    } else if (this.y > gameHeight) {
      this.y = -this.height;
    }
    if (this.x < -this.width) {
      this.x = gameWidth;
    } else if (this.x > gameWidth) {
      this.x = -this.width;
    }

  $('.player').css("top", this.y).css("left", this.x);
  $('.player').rotate(player.angle);
  // player.setPos(player.x, player.y - player.velocity);

  },
  angle: 0,
  stopAngle: 0,
  velocity: { x : 0, y : 0 },
  acceleration: { x : 0, y : 0 },
  height: 80,
  width: 60
};
var gameVariables = {
  acceleration:  .05,
  isAccelerating: false,
  timePressed: 0,
  turnRate: 8,
  maxVelocity: 25,
  minVelocity: 2,
  boost: 1
}
