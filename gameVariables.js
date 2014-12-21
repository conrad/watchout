
var asteroidWidth = 80;
var asteroidHeight = 80;
var asteroids = {
  nextId : function() {
    return this.maxId++;
  },
  maxId : 0,
  createArray : function() {
    var array = [];
    for (var key in this) {
      // test to determine whether key is a number (from string format)
      if ((key)*1 >= 0) {
        array.push(this[key]);
      }
    }
    return array;
  }
};
var gameHeight = $(".gamefield").height();
var gameWidth = $(".gamefield").width();
var graphics;
var player = {
  x: gameWidth / 2,
  y: gameHeight / 2,
  vehicle: 'falcon',
  totalVelocity: function() {
    return Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2))
  },
  setPos: function() {
    this.x += this.velocity.x;
    this.y -= this.velocity.y;

    if (this.y < -this.height()) {
      this.y = gameHeight;
    } else if (this.y > gameHeight) {
      this.y = -this.height();
    }
    if (this.x < -this.width()) {
      this.x = gameWidth;
    } else if (this.x > gameWidth) {
      this.x = -this.width();
    }
    $('.player').css("top", this.y).css("left", this.x);
    $('.player').css('transform', 'rotate('+ this.angle +'deg)');
  },
  angle: 0,
  stopAngle: 0,
  velocity: { x : 0, y : 0 },
  acceleration: { x : 0, y : 0 },
  $element: $('.player'),
  height: function() {
    return this.$element.height();
  },
  width: function() {
    return this.$element.width();
  },
  center: function() {
    return [this.x + this.width() / 2, this.y + this.height() / 2];
  }
};
var gameVariables = {
  acceleration:  .05,
  isAccelerating: false,
  timePressed: 0,
  turnRate: 8,
  maxVelocity: 22,
  minVelocity: 2,
  boost: 1,
  firing: false
};
