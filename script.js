var ctx;
var canvas;

var ballX = 100;
var ballY = 100;
var ballSpeedX = 10;
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 5;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var mouseX = evt.clientX - rect.left;
  var mouseY = evt.clientY - rect.top;
  return {
    x: mouseX,
    y: mouseY,
  };
}

function handleWinScreen(evt) {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

// update frames
let lastTime;
function update(time) {
  if (lastTime != null) {
    // const delta = time - lastTime;
    moveEverything();
    drawEverything();
    // console.log(delta);
  }
  lastTime = time;
  window.requestAnimationFrame(update);
}
window.requestAnimationFrame(update);

window.onload = function () {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  var rect = canvas.getBoundingClientRect();
  console.log(rect);

  const setUpCanvas = () => {
    // Feed the size back to the canvas.
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  };

  window.addEventListener("resize", () => {
    // Clear the canvas.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw it all again.
    drawEverything();
    setUpCanvas();
  });

  canvas.addEventListener("mousedown", handleWinScreen);

  canvas.addEventListener("mousemove", function (evt) {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT / 2;
  });
};

function ballReset() {
  if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  }

  ballSpeedX = -ballSpeedX;
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
}

function computerMovement() {
  var paddle2YCenter = paddle2Y + PADDLE_HEIGHT / 2;
  if (paddle2YCenter < ballY) {
    paddle2Y = paddle2Y + 6;
  } else if (paddle2YCenter > ballY) {
    paddle2Y = paddle2Y - 6;
  }
}

function moveEverything() {
  if (showingWinScreen) {
    return;
  }

  computerMovement();

  ballX = ballX + ballSpeedX;
  ballY = ballY + ballSpeedY;

  if (ballX < 0 + PADDLE_THICKNESS) {
    if (ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.25;
    } else {
      player2Score++; // must be BEFORE ballReset()
      ballReset();
    }
  }
  if (ballX >= canvas.width - PADDLE_THICKNESS) {
    if (ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.25;
    } else {
      player1Score++; // must be BEFORE ballReset()
      ballReset();
    }
  }
  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }
  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
}

function drawPlayingField() {
  // make dotted / dashed lines
  for (var i = 0; i < canvas.height; i += 100) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "white");
  }
}

function drawEverything() {
  // next line blanks out the screen with black
  colorRect(0, 0, canvas.width, canvas.height, "black");

  if (showingWinScreen) {
    ctx.fillStyle = "white";

    if (player1Score >= WINNING_SCORE) {
      ctx.fillText("Left Player Won", canvas.width / 2, 175);
    } else if (player2Score >= WINNING_SCORE) {
      ctx.fillText("Right Player Won", canvas.width / 2, 175);
    }

    ctx.fillText("click to continue", canvas.width / 2, canvas.height / 2);
    return;
  }

  drawPlayingField();

  // this is left player paddle
  colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, "white");

  // this is right computer paddle
  colorRect(
    canvas.width - PADDLE_THICKNESS,
    paddle2Y,
    PADDLE_THICKNESS,
    PADDLE_HEIGHT,
    "white"
  );

  // next line draws the ball
  colorCircle(ballX, ballY, 10, "white");

  ctx.fillText(player1Score, 100, 100);
  ctx.fillText(player2Score, canvas.width - 100, 100);
}

function colorCircle(centerX, centerY, radius, drawColor) {
  ctx.fillStyle = drawColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
  ctx.fillStyle = drawColor;
  ctx.fillRect(leftX, topY, width, height);
}
