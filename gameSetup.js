var randomAsteroid = function() {
  var asteroidChoices = ["img/Spinning-asteroid.gif", "img/asteroid_2.gif", "img/asteroid_3.gif", "img/asteroid_4.gif"];
  return asteroidChoices[Math.floor(Math.random() * asteroidChoices.length)];
};

var Asteroid = function(id) {
  this.id = id;
  this.x = Math.random() * (gameWidth - gameVariables.asteroidWidth);
  this.y = Math.random() * (gameHeight - gameVariables.asteroidHeight);
  this.collided = false;
};

Asteroid.prototype.center = function() {
  return [this.x + gameVariables.asteroidWidth / 2, this.y + gameVariables.asteroidHeight / 2];
};
Asteroid.prototype.nextMove = function() {
  this.x = Math.random() * 3 * (gameWidth - gameVariables.asteroidWidth) - gameWidth;
  this.y = Math.random() * 3 * (gameHeight - gameVariables.asteroidHeight) - gameHeight;
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
    if (asteroids[i] !== undefined) {
      asteroids[i].collided = false;
      asteroids[i].nextMove();
    }
  }
  // console.log(asteroids[3].x);
  updateGraphics();
};

var initializeGraphics = function() {

  player.life = player.initialLife;

  starGraphics = d3.select("svg").selectAll('circle').data(stars, function(d) { return d.id; });
  starGraphics.enter().append('circle')
    .attr('r', function(d) { return d.radius; })
    .attr('fill', 'white')
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; });


  graphics = d3.select("svg").selectAll('image').data(asteroids.createArray(), function(d) { return d.id; });
  graphics.enter().append("image")
    .attr("xlink:href", randomAsteroid)
    .attr('height', gameVariables.asteroidHeight + 'px')
    .attr('width', gameVariables.asteroidWidth + 'px')
    .attr('x', function(d) { return d.x; })
    .attr('y', function(d) { return d.y; });

  $('.life').append('<div class="lifeBar"></div>');
  $('.velocityReader').append('<div class="velocityBar"></div>');
};


var updateGraphics = function() {
  graphics = d3.select("svg").selectAll('image').data(asteroids.createArray(), function(d) { return d.id; });
  graphics.transition().ease('linear').duration(4000)
    .tween('custom', tweenWithCollisionDetection)
    .attr('x', function(d) { return d.center()[0]; })
    .attr('y', function(d) { return d.center()[1]; });
  // How can you use d3 here to update the scoreboard
  // d3.select('.collisions').selectAll('span').data([gameVariables.collisions])
};

var updateStars = function() {
  starGraphics = d3.select("svg").selectAll('circle').data(stars, function(d) { return d.id; });
  starGraphics.transition().ease('linear').duration(200000)
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; });
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
        // Laser functionality
        if (gameVariables.firing) {
          checkLaser(enemy, onLaser);
        }
        enemyNextPos = {
          x: startPos.x + (endPos.x - startPos.x) * t,
          y: startPos.y + (endPos.y - startPos.y) * t
        };
        return enemy.attr('x', enemyNextPos.x).attr('y', enemyNextPos.y);
      };
    };

var checkCollision = function(enemy, collidedCallback) {
      var radiusSum, separation, xDiff, yDiff;
      radiusSum = gameVariables.asteroidWidth / 2 + player.width() / 2;
      xDiff = parseFloat(enemy.attr('x')) - player.center()[0] - 30;
      yDiff = parseFloat(enemy.attr('y')) - player.center()[1] - 30;
      separation = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
      if (separation < radiusSum) return collidedCallback(player, enemy);
    };

var onCollision = function (player, enemy) {
  // console.log(enemy.attr('x'));
  // enemy = enemy.data()[0];
  if (enemy.data()[0].collided === false) {

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
      .attr("xlink:href", randomAsteroid())
      .attr('height', gameVariables.asteroidHeight + 'px')
      .attr('width', gameVariables.asteroidWidth + 'px')
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; });

    // add explosion
    explode(enemy.attr('x'), enemy.attr('y'));

    // increment collisions in scoreboard -- or maybe do a countdown to when you would die.
    // <div class="collisions">Collisions: <span>0</span></div>
    // gameVariables.collisions++;
    // $('.collisions span').text(gameVariables.collisions);

    // decrement life when hit
    if (player.life >= 0) {
      player.life--;
      $('.lifeBar').css('width', player.life * gameVariables.lifeBarMultiplier);
      console.log('life: ', player.life);
    }

    // changes to old asteroid
    var oldAsteroid = asteroids[enemy.data()[0].id];
    if (oldAsteroid !== undefined) {
      oldAsteroid.collided = true;
      oldAsteroid.nextMove();
    }
    newAsteroid.nextMove();

    var updatedAsteroids = [newAsteroid];
    if (oldAsteroid !== undefined) {
      updatedAsteroids.push(oldAsteroid);
    }

    graphics = d3.select("svg").selectAll('image').data(updatedAsteroids, function(d) { return d.id; });
    graphics.transition().ease('linear').duration(4000)
      .tween('custom', tweenWithCollisionDetection)
      .attr('x', function(d) { return d.x; })
      .attr('y', function(d) { return d.y; });

  }
};

var fireLaser = function() {
    if (gameVariables.firing) {
    var line = document.getElementById("laser");
    line.setAttribute("style", "stroke:rgb(255,0,0);stroke-width:5");
    line.setAttribute("x1", player.center()[0]);
    line.setAttribute("y1", player.center()[1]);
    line.setAttribute("x2", player.center()[1] + (Math.sin(player.angle / 180 * Math.PI ) * 5000 ) );
    line.setAttribute("y2", player.center()[1] - (Math.cos(player.angle / 180 * Math.PI ) * 5000 ) );

  } else {
    var line = document.getElementById("laser");
    line.setAttribute("style", "stroke:rgb(0,0,0);stroke-width:0");
  }
};

var checkLaser = function(enemy, laserCallback) {
  // px, py, radius, ax, ay, angle
  var radius = gameVariables.asteroidWidth / 2;
  var px = player.center()[0];
  var py = player.center()[1];
  var ax = enemy.attr('x') + gameVariables.asteroidWidth / 2;    // px = player x
  var ay = enemy.attr('y') + gameVariables.asteroidWidth / 2;
  var dx = ax - px;
  var dy = ay - py;
  var slope = - Math.cos(Math.PI * player.angle / 180) / Math.sin(Math.PI * player.angle / 180);
  // only hit asteroids on gamefield
  if (ax > 0 && ay > 0 && ax < gameWidth && ay < gameHeight) {      // may need to adjust if not hitting ones on edges

    if (dy < slope * dx + radius && dy > slope * dx - radius) {
      // check cos is positive (then enemy is above player (negative))
      if ( (Math.cos(Math.PI * player.angle / 180)) < 0 && ay > py) { // BOTTOM
        return laserCallback(enemy);
      }
      if ( (Math.cos(Math.PI * player.angle / 180)) > 0 && ay < py) {  // TOP
        return laserCallback(enemy);
      }
    }
  }

};

var onLaser  = function(enemy) {
  delete asteroids[enemy.data()[0].id];
  explode(enemy.attr('x'), enemy.attr('y'));

  gameVariables.destroyed++;
  // could use d3 to create array of destroyed asteroids, then return its length
  $('.destroyed span').text(gameVariables.destroyed);

  graphics = d3.select("svg").selectAll('image').data(asteroids.createArray(), function(d) { return d.id; });
  graphics.exit().remove();
  // add all matching enemies to array
};


var Star = function(id) {
  this.id = id;
  this.radius = Math.random() * 3;
  this.x = Math.random() * gameWidth;
  this.y = (Math.random() * 4 * gameHeight);
};

Star.prototype.center = function() {
  return [this.x + this.radius / 2, this.y + this.radius / 2];
};
Star.prototype.nextMove = function() {

  this.y -= (Math.random() * this.radius * gameHeight);
};

var createStars = function (n) {
  for (var i = 0; i < n; i++) {
    var star = new Star(i);
    stars[i] = star;
  }
};


var moveStars = function () {
  for (var i = 0; i < stars.length; i++) {
    stars[i].nextMove();
  }
  updateStars();
};

// var velocityBar = function () {
  // var bar = d3.select('.velocityReader').selectAll('.velocityReader span').data(player.totalVelocity() );
  // bar.enter().append();
  // bar.exit().remove();
// };


var newGame = function () {

  // if (gameVariables.gameOver === true) {   // && gameVariables.firing === true) {   // Not working properly
  gameVariables.gameOver = false;
  $('.gameover').remove();

  // Remove asteroids
  // for (var i = 0; i < asteroids.maxId; i++ ){
  //   delete asteroids[asteroids[id]];
  // }
  asteroids.deleteAsteroids();
  d3.select("svg").selectAll('image').data(asteroids.createArray(), function(d) { return d.id; }).exit().remove();

  // Remove stars
  stars = [];
  d3.select("svg").selectAll('circle').data(stars, function(d) { return d.id; }).exit().remove();

  // restart
  player.x = gameWidth / 2;
  player.y = gameHeight / 2;
  player.angle = 0;
  player.velocity = { x : 0, y : 0 };
  // $('.player').css('top', '50%');
  // $('.player').css('left', '50%');
    // .appendTo('body');
  createStars(1000);
  createAsteroids(20);
  initializeGraphics();
};





// This
// var chooseVehicle = function () {
//   if (player.vehicle === 'falcon') {
//     $(".player").css("background", url("img/falcon_long.png") );
//   } else if (player.vehicle === 'zamboni') {
//     $(".player").css("background", url("img/zamboni.png") );      // check filename
//   } else if (player.vehicle === '') {}
// };
