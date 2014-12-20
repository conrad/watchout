// start slingin' some d3 here.
jQuery.fn.rotate = function(degrees) {
    $(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                 '-moz-transform' : 'rotate('+ degrees +'deg)',
                 '-ms-transform' : 'rotate('+ degrees +'deg)',
                 'transform' : 'rotate('+ degrees +'deg)'});
    return $(this);
};

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

var createAsteroids = function (n) {
  for (var i = 0; i < n; i++) {
    var asteroid = {
      id : i,
      x  : Math.random() * (gameWidth - asteroidWidth),
      y  : Math.random() * (gameHeight - asteroidHeight),
    };
    asteroids.push(asteroid);
  }
};

var moveAsteroids = function () {
  round++;
  for (var i = 0; i < asteroids.length; i++) {
    asteroids[i].x = Math.random() * 3 * (gameWidth - asteroidWidth) - gameWidth;     //(gameWidth * .1) + .75 *
    asteroids[i].y = Math.random() * 3 * (gameHeight - asteroidHeight) - gameHeight;
  }
  // console.log(asteroids[3].x);
  updateGraphics();
};

var initializeGraphics = function() {

  graphics = d3.select("svg").selectAll('image').data(asteroids, function(d) { return d.id; });
  graphics.enter().append("image")
    .attr("xlink:href", "img/asteroid.png")
    .attr('height', asteroidHeight + 'px')
    .attr('width', asteroidWidth + 'px')
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; });
};

var updateGraphics = function() {

  graphics = d3.select("svg").selectAll('image').data(asteroids, function(d) { return d.id; });
  graphics.transition().duration(2000)
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; });
    // .attr('transform', function(d) {
    //   var r = 45*round * (1-2*(d.id % 2))
    //   return 'rotate(' + r + ' ' + d.x + ' ' + d.y + ')';} );

};

var gameCycle = function () {
  // Controls
  console.log(gameVariables.left);
  player.angle += gameVariables.right ? gameVariables.turnRate : 0;
  player.angle -= gameVariables.left ? gameVariables.turnRate : 0;
  // check acceleration state
  // console.log('vx: ' + player.velocity.x, 'vy: ' + player.velocity.y);
  // console.log(gameVariables.isAccelerating, player.angle);
  // console.log(Math.sin(player.angle / 180 * Math.PI), Math.cos(player.angle / 180 * Math.PI));
  // console.log('---------');
  if (gameVariables.isAccelerating) {
    // accelerate
    if (player.totalVelocity() < gameVariables.maxVelocity) {
      player.velocity.x += gameVariables.timePressed * gameVariables.acceleration * Math.sin(player.angle / 180 * Math.PI);
      player.velocity.y += gameVariables.timePressed * gameVariables.acceleration * Math.cos(player.angle / 180 * Math.PI);
      // console.log(player.velocity);
    }
  } else {
    // decelerate
    player.velocity.x = player.velocity.x * (1 - gameVariables.acceleration);
    player.velocity.y = player.velocity.y * (1 - gameVariables.acceleration);
    // console.log(player.velocity);
    // console.log(player.angle);
  }

  player.setPos();

    // increment / decrement the velocity
  // move the player

  // check for collisions
}


// ---------------------------------------------KEY HANDLERS
$( 'body' ).keydown(function(e) {
  if (e.keyCode === 37) {           // LEFT
    gameVariables.left = true;
  } else if (e.keyCode === 39) {    // RIGHT
    gameVariables.right = true;
  } else if (e.keyCode === 38) {    // UP
    if (gameVariables.isAccelerating == false) {
      if (player.totalVelocity() < gameVariables.minVelocity )  {
        player.velocity.x = gameVariables.minVelocity * Math.sin(player.angle / 180 * Math.PI);
        player.velocity.y = gameVariables.minVelocity * Math.cos(player.angle / 180 * Math.PI);
      }
    }
    player.velocity.x += gameVariables.boost * Math.sin(player.angle / 180 * Math.PI);
    player.velocity.y += gameVariables.boost * Math.cos(player.angle / 180 * Math.PI);
    gameVariables.isAccelerating = true;
    gameVariables.timePressed+=10;
  } else if (e.keyCode === 40) {      //DOWN
    console.log('down\n');
  }


});

$( 'body' ).keyup(function(e) {
  if (e.keyCode === 37) {
    gameVariables.left = false;
  }
  if (e.keyCode === 39) {
    gameVariables.right = false;
  }
  if (e.keyCode === 38) {
    gameVariables.isAccelerating = false;
    gameVariables.timePressed = 0;
    player.stopAngle = Math.PI * Math.atan(player.velocity.x / player.velocity.y);
  }
});


// ----------------------------------------------------GAME LOGIC STUFF
createAsteroids(20);
initializeGraphics();
setInterval(moveAsteroids, 2000);

setInterval(gameCycle, 20);


