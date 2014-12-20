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
  setPos: function() {
    this.x += this.velocity.x;
    this.y -= this.velocity.y;

    if (this.y < -this.height) {
      this.y = gameHeight;
    } else if (this.y > gameHeight) {
      this.y = 0;
    }
    if (this.x < -this.width) {
      this.x = gameWidth;
    } else if (this.x > gameWidth) {
      this.x = 0;
    }

  $('.player').css("top", this.y).css("left", this.x)
  // player.setPos(player.x, player.y - player.velocity);

  },
  angle: 0,
  velocity: { x : 0, y : 0 },
  acceleration: { x : 0, y : 0 },
  height: 80,
  width: 60
};
var gameVariables = {
  acceleration:  .1,
  isAccelerating: false,
  timePressed: 0
}
var timePressed = 0;

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
  // check acceleration state
  if (gameVariables.isAccelerating) {
    gameVariables.timePressed++;
    // accelerate
    player.velocity.x = gameVariables.timePressed * gameVariables.acceleration * Math.sin(player.angle / 180 * Math.PI);
    player.velocity.y = gameVariables.timePressed * gameVariables.acceleration * Math.cos(player.angle / 180 * Math.PI);
    // console.log(player.velocity);
  } else {
    // decelerate
    if (gameVariables.timePressed > 0) {
      gameVariables.timePressed-=0.5;
    }
    player.velocity.x = gameVariables.timePressed * gameVariables.acceleration * Math.sin(player.angle / 180 * Math.PI);
    player.velocity.y = gameVariables.timePressed * gameVariables.acceleration * Math.cos(player.angle / 180 * Math.PI);
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
  if (e.keyCode === 37) {
    // LEFT
    player.angle -= 10;
  } else if (e.keyCode === 39) {
    //RIGHT
    player.angle += 10;
  } else if (e.keyCode === 38) {
    // UP
    gameVariables.isAccelerating = true;
  } else if (e.keyCode === 40) {
    //DOWN
  }

  $('.player').rotate(player.angle);
});

$( 'body' ).keyup(function(e) {
  if (e.keyCode === 38) {
    gameVariables.isAccelerating = false;
  }
});


// ----------------------------------------------------GAME LOGIC STUFF
createAsteroids(20);
initializeGraphics();
setInterval(moveAsteroids, 2000);

setInterval(gameCycle, 20);


