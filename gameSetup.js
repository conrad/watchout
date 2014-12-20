
var createAsteroids = function (n) {
  for (var i = 0; i < n; i++) {
    var asteroid = {
      id : i,
      x  : Math.random() * (gameWidth - asteroidWidth),
      y  : Math.random() * (gameHeight - asteroidHeight),
      center : function() {
        return [this.x + asteroidWidth / 2, this.y + asteroidHeight / 2];
      }
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
  graphics.transition().duration(4000)
    .tween('custom', tweenWithCollisionDetection)
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; });
    // .attr('transform', function(d) {
    //   var r = 45*round * (1-2*(d.id % 2))
    //   return 'rotate(' + r + ' ' + d.x + ' ' + d.y + ')';} );
};

var tweenWithCollisionDetection = function(endData) {
      var endPos, enemy, startPos;
      enemy = d3.select(this);
      startPos = {
        x: parseFloat(enemy.attr('x')),
        y: parseFloat(enemy.attr('y'))
      };
      endPos = {
        x: endData.x,
        y: endData.y
      };
      return function(t) {
        var enemyNextPos;
        checkCollision(enemy, onCollision);
        enemyNextPos = {
          x: startPos.x + (endPos.x - startPos.x) * t,
          y: startPos.y + (endPos.y - startPos.y) * t
        };
        return enemy.attr('x', enemyNextPos.x).attr('y', enemyNextPos.y);
      };
    };

var checkCollision = function(enemy, collidedCallback) {
      var radiusSum, separation, xDiff, yDiff;
      radiusSum = asteroidWidth / 2 + player.width() / 2;
      xDiff = parseFloat(enemy.attr('x')) - player.center()[0];
      yDiff = parseFloat(enemy.attr('y')) - player.center()[1];
      separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
      if (separation < radiusSum) return collidedCallback(player, enemy);
    };

var onCollision = function () {
  console.log('collide!');
}

var chooseVehicle = function () {
  if (player.vehicle === 'falcon') {
    $(".player").css("background", url("img/falcon_long.png") );
  } else if (player.vehicle === 'zamboni') {
    $(".player").css("background", url("img/zamboni.png") );      // check filename
  } else if (player.vehicle === '') {}
};
