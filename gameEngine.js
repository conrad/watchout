var gameCycle = function () {
  // Controls
  player.angle += gameVariables.right ? gameVariables.turnRate : 0;
  player.angle -= gameVariables.left ? gameVariables.turnRate : 0;
  // check acceleration state
  if (gameVariables.isAccelerating) {
    // make falcon glow
    if (player.vehicle === 'falcon') {
      $(".player").css("background-image", 'url("img/falcon_glow.png")' );
    }
    // accelerate
    if (player.totalVelocity() < gameVariables.maxVelocity) {
      player.velocity.x += gameVariables.timePressed * gameVariables.acceleration * Math.sin(player.angle / 180 * Math.PI);
      player.velocity.y += gameVariables.timePressed * gameVariables.acceleration * Math.cos(player.angle / 180 * Math.PI);
    }
  } else {
    // lose the glow
    if (player.vehicle === 'falcon') {
      $(".player").css("background-image", 'url("img/falcon_long.png")' );
    }
    // decelerate
    player.velocity.x = player.velocity.x * (1 - gameVariables.acceleration * .2);
    player.velocity.y = player.velocity.y * (1 - gameVariables.acceleration * .2);
  }

  player.setPos();
  // Collisions check in boardState.js / gameSetup.js
};





// ----------------------------------------------------GAME LOGIC STUFF
createAsteroids(20);
initializeGraphics();
moveAsteroids();
setInterval(moveAsteroids, 2000);

setInterval(gameCycle, 20);

