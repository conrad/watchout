// ---------------------------------------------KEY HANDLERS
$( 'body' ).keydown(function(e) {
  if (e.keyCode === 13) {           // ENTER
    player.nextVehicle();
  }
  if (e.keyCode === 32) {           // SPACE
    gameVariables.firing = true;
    setTimeout( function() { gameVariables.firing = false; }, 500);
  }
  if (e.keyCode === 37) {           // LEFT
    gameVariables.left = true;
  } else if (e.keyCode === 39) {    // RIGHT
    gameVariables.right = true;
    console.log(player.x, player.y);

  }
  if (e.keyCode === 38) {    // UP
    if (gameVariables.isAccelerating === false) {
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

  } else if (e.keyCode === 32) {

  }


});

$( 'body' ).keyup(function(e) {
  if (e.keyCode === 32) {             // SPACE
    gameVariables.firing = false;
  }
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
