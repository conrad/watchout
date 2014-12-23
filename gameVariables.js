
var asteroids = {
  nextId : function() {
    return this.maxId++;
  },
  maxId : 0,
  // width : 80,
  // height : 80,

  createArray : function() {
    var array = [];
    for (var key in this) {
      // test to determine whether key is a number (from string format)
      if ((key)*1 >= 0) {
        array.push(this[key]);
      }
    }
    return array;
  },

  deleteAsteroids : function() {
    for (var key in this) {
      if ((key)*1 >= 0) {
        delete this[key];
      }
    }
    this.maxId = 0;
  }
};
var gameHeight = $(".gamefield").height();
var gameWidth = $(".gamefield").width();

var player = {
  x: gameWidth / 2,
  y: gameHeight / 2,

  vehicles: ['falcon', 'fighter', 'zamboni'],
  // include a tuple of images for each vehicle (still, accelerating) with the key set to the vehicle name in the vehicles array
  images: {
    falcon : ['img/falcon_long.png', 'img/falcon_glow.png'],
    fighter : ['img/fighterjet.png', 'img/fighterjet.png'],
    zamboni : ['img/zamboni.png', 'img/zamboni-fire.png']
  },
  vehicle: 'falcon', //it breaks when I do this: this.vehicles[1],       // set initial vehicle
  nextVehicle: function () {
    var i = this.vehicles.indexOf(this.vehicle);
    if ( i + 1 < this.vehicles.length) {
      this.vehicle = this.vehicles[i + 1];
      console.log(this.vehicle);
    } else {
      this.vehicle = this.vehicles[0];
    }
  },

  velocity: { x : 0, y : 0 },
  totalVelocity: function() {
    return Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2));
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
  },
  // initialLife : function() { return 3; },
  // life : this.initialLife()
  initialLife : 200,
  life : this.initialLife
  // life : gameVariables.initialLife   // This wouldn't work
};
var gameVariables = {
  acceleration   : 0.05,
  isAccelerating : false,
  timePressed    : 0,
  turnRate       : 8,
  maxVelocity    : 22,
  minVelocity    : 2,
  boost          : 1,
  firing         : false,
  asteroidWidth  : 80,
  asteroidHeight : 80,
  // collisions     : 0,
  destroyed      : 0,
  // initialLife : 200,      // How do I get this into this object?
  lifeBarMultiplier: 1,     // should be adjusted based on initialLife
  gameOver       : false
};

var stars = [];
var graphics, starGraphics;
