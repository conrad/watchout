var gameCycle = function () {
  // Controls
  player.angle += gameVariables.right ? gameVariables.turnRate : 0;
  player.angle -= gameVariables.left ? gameVariables.turnRate : 0;
  // check acceleration state
  if (gameVariables.isAccelerating) {
    // make falcon glow
    $(".player").css("background-image", 'url(' + player.images[player.vehicle][1] + ')' );
    // accelerate
    if (player.totalVelocity() < gameVariables.maxVelocity) {
      player.velocity.x += gameVariables.timePressed * gameVariables.acceleration * Math.sin(player.angle / 180 * Math.PI);
      player.velocity.y += gameVariables.timePressed * gameVariables.acceleration * Math.cos(player.angle / 180 * Math.PI);
    }
  } else {
    // lose the glow
    $(".player").css("background-image", 'url(' + player.images[player.vehicle][0] + ')' );
    // decelerate
    player.velocity.x = player.velocity.x * (1 - gameVariables.acceleration * 0.2);
    player.velocity.y = player.velocity.y * (1 - gameVariables.acceleration * 0.2);
  }

  fireLaser();
  player.setPos();
  // Collisions check in boardState.js / gameSetup.js
};





// ----------------------------------------------------GAME LOGIC STUFF
createStars(1000);
createAsteroids(20);
initializeGraphics();
moveAsteroids();
setInterval(moveAsteroids, 2000);


moveStars();
setInterval(moveStars, 200000);

setInterval(gameCycle, 20);


