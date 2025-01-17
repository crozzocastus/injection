const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

const CONFIG = {
  paddle: { width: 100, height: 10, speed: 7 },
  ball: { radius: 8, initialDX: 3, initialDY: -3 },
  brick: { rowCount: 4, columnCount: 7, width: 75, height: 20, padding: 10, offsetTop: 30, offsetLeft: 8 },
  maxRepetition: 10,
  repetitionCheckInterval: 2000,
};

let state = {
  paddleX: (canvas.width - CONFIG.paddle.width) / 2,
  ballX: canvas.width / 2,
  ballY: canvas.height - 30,
  ballDX: CONFIG.ball.initialDX,
  ballDY: CONFIG.ball.initialDY,
  rightPressed: false,
  leftPressed: false,
  bricks: [],
  lives: 5,
  hearts: [],
  keyInputBlocked: false,
  pongTerminado: false,
};

let lastTime = 0;

function checkGameStatus() {
  return state.pongTerminado;
}

function initializeGame() {
  setupBricks();
  setupGameBar();
  addEventListeners();
  requestAnimationFrame(draw);
}

function setupBricks() {
  state.bricks = [];
  for (let c = 0; c < CONFIG.brick.columnCount; c++) {
    state.bricks[c] = [];
    for (let r = 0; r < CONFIG.brick.rowCount; r++) {
      state.bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

function setupGameBar() {
  const livesContainer = document.getElementById("lives");
  livesContainer.innerHTML = '';
  state.hearts = [];
  for (let i = 0; i < state.lives; i++) {
    const heart = document.createElement("span");
    heart.textContent = " ♥ ";
    state.hearts.push(heart);
    livesContainer.appendChild(heart);
  }
}

function addEventListeners() {
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);
}

function keyDownHandler(e) {
  if (state.keyInputBlocked) return;
  if (e.key === "ArrowRight") state.rightPressed = true;
  if (e.key === "ArrowLeft") state.leftPressed = true;
}

function keyUpHandler(e) {
  if (state.keyInputBlocked) return;
  if (e.key === "ArrowRight") state.rightPressed = false;
  if (e.key === "ArrowLeft") state.leftPressed = false;
}

function draw(timestamp) {
  if (state.pongTerminado) {
    displayGameOver();
    return;
  }

  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  clearCanvas();
  drawBricks();
  drawBall(deltaTime);
  drawPaddle();
  collisionDetection();
  updateBallPosition(deltaTime);
  updatePaddlePosition();
  checkBlocksCleared();
  requestAnimationFrame(draw);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBricks() {
  state.bricks.forEach((column, c) => {
    column.forEach((brick, r) => {
      if (brick.status === 1) {
        const brickX = c * (CONFIG.brick.width + CONFIG.brick.padding) + CONFIG.brick.offsetLeft;
        const brickY = r * (CONFIG.brick.height + CONFIG.brick.padding) + CONFIG.brick.offsetTop;
        brick.x = brickX;
        brick.y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, CONFIG.brick.width, CONFIG.brick.height);
        ctx.fillStyle = "#f39c12";
        ctx.fill();
        ctx.closePath();
      }
    });
  });
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(state.paddleX, canvas.height - CONFIG.paddle.height, CONFIG.paddle.width, CONFIG.paddle.height);
  ctx.fillStyle = "#3498db";
  ctx.fill();
  ctx.closePath();
}

function drawBall(deltaTime) {
  ctx.beginPath();
  ctx.arc(state.ballX, state.ballY, CONFIG.ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#e74c3c";
  ctx.fill();
  ctx.closePath();
}

function collisionDetection() {
  for (let c = 0; c < CONFIG.brick.columnCount; c++) {
    for (let r = 0; r < CONFIG.brick.rowCount; r++) {
      const brick = state.bricks[c][r];
      if (brick.status === 1 && isCollidingWithBrick(brick)) {
        handleBrickCollision(brick);
        return;
      }
    }
  }

  if (state.ballX + CONFIG.ball.radius > state.paddleX && state.ballX - CONFIG.ball.radius < state.paddleX + CONFIG.paddle.width && state.ballY + CONFIG.ball.radius > canvas.height - CONFIG.paddle.height) {
    handlePaddleCollision();
  }

  if (state.ballY + CONFIG.ball.radius > canvas.height) {
    loseLife();
  }
}

function isCollidingWithBrick(brick) {
  return (
    state.ballX + CONFIG.ball.radius > brick.x &&
    state.ballX - CONFIG.ball.radius < brick.x + CONFIG.brick.width &&
    state.ballY + CONFIG.ball.radius > brick.y &&
    state.ballY - CONFIG.ball.radius < brick.y + CONFIG.brick.height
  );
}

function handleBrickCollision(brick) {
  if (
    state.ballX + CONFIG.ball.radius > brick.x &&
    state.ballX - CONFIG.ball.radius < brick.x + CONFIG.brick.width
  ) {
    state.ballDY = -state.ballDY; // Inverter direção no eixo Y
  } else {
    state.ballDX = -state.ballDX; // Inverter direção no eixo X
  }

  brick.status = 0; // Marcar o bloco como destruído
}

function handlePaddleCollision() {
  const hitPoint = state.ballX - (state.paddleX + CONFIG.paddle.width / 2);
  const maxBounceAngle = Math.PI / 4;
  const normalizedHitPoint = hitPoint / (CONFIG.paddle.width / 2);
  const bounceAngle = normalizedHitPoint * maxBounceAngle;
  state.ballDX = Math.sin(bounceAngle) * 5;
  state.ballDY = -Math.cos(bounceAngle) * 5;
}

function updateBallPosition(deltaTime) {
  const speed = 0.1; // Diminuir a velocidade fixa desejada
  state.ballX += state.ballDX * deltaTime * speed;
  state.ballY += state.ballDY * deltaTime * speed;

  if (state.ballX + CONFIG.ball.radius > canvas.width || state.ballX - CONFIG.ball.radius < 0) {
    state.ballDX = -state.ballDX;
  }
  if (state.ballY - CONFIG.ball.radius < 0) {
    state.ballDY = -state.ballDY;
  }
}

function updatePaddlePosition() {
  if (state.rightPressed && state.paddleX < canvas.width - CONFIG.paddle.width) {
    state.paddleX += CONFIG.paddle.speed;
  } else if (state.leftPressed && state.paddleX > 0) {
    state.paddleX -= CONFIG.paddle.speed;
  }
}

function loseLife() {
  state.lives--;
  if (state.lives <= 0) {
    gameOver();
  } else {
    const livesContainer = document.getElementById("lives");
    livesContainer.removeChild(state.hearts.pop());
    resetBallAndPaddle();
  }
}

function resetBallAndPaddle() {
  state.ballX = canvas.width / 2;
  state.ballY = canvas.height - 30;
  state.ballDX = CONFIG.ball.initialDX;
  state.ballDY = CONFIG.ball.initialDY;
  state.paddleX = (canvas.width - CONFIG.paddle.width) / 2;
}

function checkBlocksCleared() {
  let allCleared = true;

  state.bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.status === 1) {
        allCleared = false;
      }
    });
  });

  if (allCleared) {
    state.pongTerminado = true;
  }
}

function gameOver() {
  displayGameOver();
  resetGame();
}

function resetGame() {
  state.lives = 5; // Restabelece o número de vidas
  state.pongTerminado = false; // Desmarca o estado de jogo terminado
  setupBricks(); // Recria os blocos
  setupGameBar(); // Atualiza os corações
  resetBallAndPaddle(); // Reseta a posição da bola e da raquete
}

function displayGameOver() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "24px Arial";
  ctx.fillStyle = "#2ecc71";
  ctx.textAlign = "center";
  ctx.fillText("Você perdeu todas as vidas!", canvas.width / 2, canvas.height / 2);
}

initializeGame();