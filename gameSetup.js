var Asteroid = function(id) {
  this.id = id;
  this.x = Math.random() * (gameWidth - asteroidWidth);
  this.y = Math.random() * (gameHeight - asteroidHeight);
  this.collided = false;
}

Asteroid.prototype.center = function() {
  return [this.x + asteroidWidth / 2, this.y + asteroidHeight / 2];
};
Asteroid.prototype.nextMove = function() {
  this.x = Math.random() * 3 * (gameWidth - asteroidWidth) - gameWidth;
  this.y = Math.random() * 3 * (gameHeight - asteroidHeight) - gameHeight;
};

var createAsteroids = function (n) {
  for (var i = 0; i < n; i++) {
    var id = asteroids.nextId();
    var asteroid = new Asteroid(id);
    asteroids[id] = asteroid;
  }
};


var moveAsteroids = function () {
  for (var i = 0; i < asteroids.maxId; i++) {
    asteroids[i].collided = false;
    asteroids[i].nextMove();
  }
  // console.log(asteroids[3].x);
  updateGraphics();
};

var initializeGraphics = function() {

  graphics = d3.select("svg").selectAll('image').data(asteroids.createArray(), function(d) { return d.id; });
  graphics.enter().append("image")
    .attr("xlink:href", "img/asteroid.png")
    .attr('height', asteroidHeight + 'px')
    .attr('width', asteroidWidth + 'px')
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; });
};

var updateGraphics = function() {

  graphics = d3.select("svg").selectAll('image').data(asteroids.createArray(), function(d) { return d.id; });
  graphics.transition('linear').duration(4000)
    .tween('custom', tweenWithCollisionDetection)
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; });
};

var explode = function(x, y) {
  // create div with explosion background
  var $explosion = $('<div></div>').addClass('explosion');
  $explosion.css('top', y - 15 + 'px');
  $explosion.css('left', x - 15 +'px');
  $explosion.appendTo('body');
  setTimeout( function() { $explosion.remove(); }, 700);
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

var onCollision = function (player, enemy) {
  // console.log(enemy.attr('x'));
  // enemy = enemy.data()[0];
  if (enemy.data()[0].collided === false) {



    console.log(asteroids.maxId);
    // player.$element.css('background', 'red');

    // create new asteroid at collision location      TURN THIS INTO A FUNCTION
    var newId = asteroids.nextId();
    var newAsteroid = new Asteroid(newId);

    newAsteroid.x = enemy.attr('x');
    newAsteroid.y = enemy.attr('y');
    newAsteroid.collided = true;
    asteroids[newId] = newAsteroid;
    // add it to DOM with d3
    graphics = d3.select("svg").selectAll('image').data([newAsteroid], function(d) { return d.id; });
    graphics.enter().append("image")
      .attr("xlink:href", "img/asteroid.png")
      .attr('height', asteroidHeight + 'px')
      .attr('width', asteroidWidth + 'px')
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; });

    // add explosion
    explode(enemy.attr('x'), enemy.attr('y'));

    // changes to old asteroid
    var oldAsteroid = asteroids[enemy.data()[0].id];
    oldAsteroid.collided = true;
    oldAsteroid.nextMove();
    newAsteroid.nextMove();

    graphics = d3.select("svg").selectAll('image').data([newAsteroid, oldAsteroid], function(d) { return d.id; });
    graphics.transition().ease('linear').duration(4000)
      .tween('custom', tweenWithCollisionDetection)
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; });

  }
}


var chooseVehicle = function () {
  if (player.vehicle === 'falcon') {
    $(".player").css("background", url("img/falcon_long.png") );
  } else if (player.vehicle === 'zamboni') {
    $(".player").css("background", url("img/zamboni.png") );      // check filename
  } else if (player.vehicle === '') {}
};
