var gameCycle = function () {
  // Controls
  player.angle += gameVariables.right ? gameVariables.turnRate : 0;
  player.angle -= gameVariables.left ? gameVariables.turnRate : 0;
  // check acceleration state
  if (gameVariables.isAccelerating) {
    // Choose proper image for motion, depending on current vehicle
    $(".player").css("background-image", 'url(' + player.images[player.vehicle][1] + ')' );
    // accelerate
    if (player.totalVelocity() < gameVariables.maxVelocity) {
      player.velocity.x += gameVariables.timePressed * gameVariables.acceleration * Math.sin(player.angle / 180 * Math.PI);
      player.velocity.y += gameVariables.timePressed * gameVariables.acceleration * Math.cos(player.angle / 180 * Math.PI);
    }
  } else {
    // Change to stationary image for current vehicle
    $(".player").css("background-image", 'url(' + player.images[player.vehicle][0] + ')' );
    // decelerate
    player.velocity.x = player.velocity.x * (1 - gameVariables.acceleration * 0.15);
    player.velocity.y = player.velocity.y * (1 - gameVariables.acceleration * 0.15);
  }

  fireLaser();
  player.setPos();

  // Having the numbers read out was working, but it didn't look cool enough:
  $('.velocityReader span').text( Math.round(player.totalVelocity()) );     // <span>0</span>
  $('.velocityBar').css('width', player.totalVelocity() * 3 );
  // Setting the bar's color dynamically isn't working yet. Also the stars go over the bar and show if it's something besides white.
  //   .css( 'background-color', 'rgb(255, '+ 255 - (player.totalVelocity() * 10) +', '+ 255 - (player.totalVelocity() * 10) +')' );
  // console.log( $('.velocityBar').css('background-color') );
  if (player.totalVelocity() > gameVariables.maxVelocity-1) {
    $('.velocityBar').css('background-color', 'red');
    console.log('reaching max velocity!');      // not getting triggered
  } else {
    $('.velocityBar').css('background-color', 'white');
  }

  // Game Over
  if (player.life <= 0 && gameVariables.gameOver === false) {
    // $('.player').remove();
    $('body').append('<div class="gameover">GAME OVER</div>');
    gameVariables.gameOver = true;
    setTimeout(newGame, 8000);
  }

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


