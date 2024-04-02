/** @type {CanvasRenderingContext2D} */
const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext("2d");

// Resizing
canvas.height = window.innerHeight - 10;
canvas.width = window.innerWidth - 10;
let dx = 8;
let dy = 8;
let speed = Math.sqrt(2) * dy;
let x = 150;
let y = 250;
let ballRadius = 15;
let paddleHeight = 20;
let paddleWidth = 150;
let paddleX = (canvas.width - paddleWidth) / 2;
let restartX = 10;
let restartY = 10;
let restartRadius = 20;

var brickRowCount = 5;
var brickColumnCount = 40;
var brickWidth = 150;
var brickHeight = 30;
var brickPadding = 5;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {
      x: c * (brickWidth + brickPadding) + brickOffsetLeft,
      y: r * (brickHeight + brickPadding) + brickOffsetTop,
      status: 1,
      width: brickWidth,
      height: brickHeight,
    };
  }
}
function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        ctx.beginPath();
        ctx.rect(bricks[c][r].x, bricks[c][r].y, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  let vertical_refleciton = false;
  let horizontal_reflection = false;
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        let circle = { x: x, y: y, r: ballRadius };

        if (intersects(circle, b)) {
          // || x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {

          if (b.x > circle.x || b.x + b.width < circle.x) {
            vertical_refleciton = true;

            // console.log(b.x > circle.x + circle.r);
            // console.log(b.x + b.width < circle.x);
          }
          // if(b.y > circle.y || b.y + b.height <= circle.y + circle.r)
          else {
            horizontal_reflection = true;
          }
          b.status = 0;
        }
      }
    }
  }
  if (vertical_refleciton) dx = -dx;
  if (horizontal_reflection) dy = -dy;
}

function intersects(circle, b) {
  let circleDistance = {};
  let abs = Math.abs;
  rect = Object.assign({}, b);
  rect.x += rect.width / 2;
  rect.y += rect.height / 2;
  circleDistance.x = abs(circle.x - rect.x);
  circleDistance.y = abs(circle.y - rect.y);

  if (circleDistance.x > rect.width / 2 + circle.r) {
    return false;
  }
  if (circleDistance.y > rect.height / 2 + circle.r) {
    return false;
  }

  if (circleDistance.x <= rect.width / 2) {
    return true;
  }
  if (circleDistance.y <= rect.height / 2) {
    return true;
  }

  cornerDistance_sq =
    (circleDistance.x - rect.width / 2) ^
    (2 + (circleDistance.y - rect.height / 2)) ^
    2;

  return cornerDistance_sq <= (circle.r ^ 2);
}

let transition = 1;

function transitionBricks() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      bricks[c][r].y += transition;
    }
  }
  console.log(bricks[0][0].y);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  collisionDetection();
  drawBall();
  drawBricks();
  drawMenu();
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }

  if (y + dy < ballRadius || y + dy > canvas.height - ballRadius + 10) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius - paddleHeight) {
    if (x > paddleX && x < paddleX + paddleWidth && dy > 0) {
      // dy = -dy;
      dx = (10 * (x - paddleX - paddleWidth / 2)) / (paddleWidth / 2);
      if (dx > speed) dx = speed - 3;
      if (-dx > speed) dx = -speed + 3;
      dy = -Math.sqrt(speed * speed - dx * dx);
      // console.log(dx, dy, speed);
    } else {
      // alert("GAME OVER");
      // document.location.reload();
      // clearInterval(interval);
    }
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}
draw();

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawMenu() {
  ctx.beginPath();
  ctx.arc(restartX, restartY, restartRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function movePaddle(e) {
  paddleX = e.clientX - paddleWidth / 2;
  if (paddleX + paddleWidth > canvas.width) {
    paddleX = canvas.width - paddleWidth;
  }
  if (paddleX < 0) {
    paddleX = 0;
  }
}

function gameActions(e) {
  if (
    restartX - restartRadius < e.clientX &&
    e.clientX < restartX + restartRadius &&
    restartY - restartRadius < e.clientY &&
    e.clientY < restartY + restartRadius
  ) {
    document.location.reload();
  }
}

canvas.addEventListener("mousemove", movePaddle);
canvas.addEventListener("mousedown", gameActions);
// canvas.addEventListener("touchmove", movePaddle);
canvas.addEventListener("touchmove", function (e) {
  var touch = e.touches[0];
  e.preventDefault();
  movePaddle(touch);
});

window.addEventListener("resize", () => {
  // Resizing
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});
