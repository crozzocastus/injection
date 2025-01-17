const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const baseWidth = 600;
const baseHeight = 400;
const playerWidth = 50;
const playerHeight = 20;
const bulletWidth = 5;
const bulletHeight = 10;
const alienWidth = 60;
const alienHeight = 30;
const alienBulletWidth = 5;
const alienBulletHeight = 10;

canvas.width = baseWidth;
canvas.height = baseHeight;

let playerX, playerY;
let rightPressed, leftPressed, spacePressed;
let bullets, alienBullets;
let aliens;
let alienSpeed, bulletSpeed, alienBulletSpeed;
let gameOver;
let alienMoveInterval, alienShootInterval;
let alienDirection;
let lives;
let gameStarted;
let keyPressedOnce;
let SpaceInvadersTerminado = false;
let cheatEnabled = false; // Estado do cheat

const alienSpriteSheet = new Image();
alienSpriteSheet.src = "https://i.ibb.co/XjPgYkK/alieninimigo-spritesheet.png";
alienSpriteSheet.onload = function () {
  restartGame();
};

function checkGameStatus() {
  return SpaceInvadersTerminado;
}

function restartGame() {
  playerX = canvas.width / 2 - playerWidth / 2;
  playerY = canvas.height - playerHeight - 10;
  rightPressed = leftPressed = spacePressed = false;
  bullets = [];
  alienBullets = [];
  aliens = [];
  alienSpeed = 2.5;
  bulletSpeed = 5;
  alienBulletSpeed = 3;
  gameOver = false;
  alienDirection = 1;
  lives = 5;
  gameStarted = false;
  keyPressedOnce = false;
  createAliens();
  updateLifeCount();
  document.getElementById("message").style.display = "none";
  document.getElementById("endMessage").style.display = "none";
  clearInterval(alienMoveInterval);
  clearInterval(alienShootInterval);
  alienMoveInterval = null; // Reseta o intervalo
  alienShootInterval = null; // Reseta o intervalo
  moveAliens();
  startAlienShooting();
  requestAnimationFrame(draw);
}

function updateLifeCount() {
  const lifeCount = document.getElementById("lifeCount");
  lifeCount.textContent = " ♥ ".repeat(lives);
}

document.addEventListener("keydown", (e) => {
  if (gameOver && !keyPressedOnce) {
    keyPressedOnce = true;
    setTimeout(() => {
      restartGame();
    }, 1000);
    return;
  }
  if (e.code === "KeyD") rightPressed = true;
  if (e.code === "KeyA") leftPressed = true;
  if (e.key === "ArrowRight") rightPressed = true;
  if (e.key === "ArrowLeft") leftPressed = true;
  if (e.key === " " && bullets.length === 0) spacePressed = true;
  if (!gameStarted && !gameOver) gameStarted = true;
  if (e.key === "i" || e.key === "I") {
    cheatEnabled = !cheatEnabled;
    if (cheatEnabled) console.log("Cheat ativado!");
    else console.log("Cheat desativado!");
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowRight") rightPressed = false;
  if (e.key === "ArrowLeft") leftPressed = false;
  if (e.code === "KeyD") rightPressed = false;
  if (e.code === "KeyA") leftPressed = false;
  if (e.key === " ") spacePressed = false;
});

function createAliens() {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      aliens.push({
        x: col * (alienWidth + 10),
        y: row * (alienHeight + 10),
        alive: true,
      });
    }
  }
}

function drawPlayer() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

function fireBullet() {
  if (spacePressed) {
    bullets.push({
      x: playerX + playerWidth / 2 - bulletWidth / 2,
      y: playerY,
    });
    spacePressed = false;
  }
}

function drawBullets() {
  ctx.fillStyle = "yellow";
  bullets.forEach((bullet, index) => {
    ctx.fillRect(bullet.x, bullet.y, bulletWidth, bulletHeight);
    bullet.y -= bulletSpeed;
    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });
}

function drawAlienBullets() {
  ctx.fillStyle = "green";
  alienBullets.forEach((bullet, index) => {
    ctx.fillRect(bullet.x, bullet.y, alienBulletWidth, alienBulletHeight);
    bullet.y += alienBulletSpeed;
    if (bullet.y > canvas.height) {
      alienBullets.splice(index, 1);
    }
  });
}

function drawAliens() {
  const alienFrameWidth = alienSpriteSheet.width / 6;
  const alienFrameHeight = alienSpriteSheet.height;
  const frameIndex = Math.floor((Date.now() / 300) % 6);

  aliens.forEach((alien) => {
    if (alien.alive) {
      ctx.drawImage(
        alienSpriteSheet,
        frameIndex * alienFrameWidth,
        0,
        alienFrameWidth,
        alienFrameHeight,
        alien.x,
        alien.y,
        alienWidth,
        alienHeight
      );
    }
  });
}

function movePlayer() {
  if (rightPressed && playerX < canvas.width - playerWidth) playerX += 5;
  if (leftPressed && playerX > 0) playerX -= 5;
}

function moveAliens() {
  if (alienMoveInterval) clearInterval(alienMoveInterval); // Garante que não há múltiplos intervalos
  alienMoveInterval = setInterval(() => {
    if (gameOver) return;
    aliens.forEach((alien) => {
      if (alien.alive) alien.x += alienSpeed * alienDirection;
    });
    const aliensAtBorder = aliens.some(
      (alien) => alien.x <= 0 || alien.x + alienWidth >= canvas.width
    );
    if (aliensAtBorder) {
      alienDirection *= -1;
      aliens.forEach((alien) => (alien.y += 20));
    }
    checkAlienCollisions();
    if (aliens.some((alien) => alien.y + alienHeight >= canvas.height)) {
      endGame("Aliens chegaram ao chão!");
    }
  }, 100);
}

function startAlienShooting() {
  alienShootInterval = setInterval(() => {
    let aliveAliens = aliens.filter((alien) => alien.alive);
    if (aliveAliens.length > 0) {
      let randomAlien =
        aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
      alienBullets.push({
        x: randomAlien.x + alienWidth / 2 - alienBulletWidth / 2,
        y: randomAlien.y + alienHeight,
      });
    }
  }, 1000);
}

function checkCollisions() {
  bullets.forEach((bullet, bulletIndex) => {
    aliens.forEach((alien, alienIndex) => {
      if (
        alien.alive &&
        alien.x < bullet.x + bulletWidth &&
        alien.x + alienWidth > bullet.x &&
        alien.y < bullet.y + bulletHeight &&
        alien.y + alienHeight > bullet.y
      ) {
        alien.alive = false;
        bullets.splice(bulletIndex, 1);
      }
    });
  });
  alienBullets.forEach((bullet, index) => {
    if (
      bullet.x < playerX + playerWidth &&
      bullet.x + alienBulletWidth > playerX &&
      bullet.y < playerY + playerHeight &&
      bullet.y + alienBulletHeight > playerY
    ) {
      lives--;
      updateLifeCount();
      alienBullets.splice(index, 1);
      if (lives <= 0) {
        endGame("Você perdeu todas as vidas!");
      }
    }
  });
}

function checkAlienCollisions() {
  if (aliens.every((alien) => !alien.alive)) {
    clearInterval(alienMoveInterval);
    clearInterval(alienShootInterval);
    document.getElementById("endMessage").style.display = "block";
    SpaceInvadersTerminado = true;
  }
}

function checkPlayerAlienCollision() {
  aliens.forEach((alien) => {
    if (
      alien.alive &&
      alien.x < playerX + playerWidth &&
      alien.x + alienWidth > playerX &&
      alien.y < playerY + playerHeight &&
      alien.y + alienHeight > playerY
    ) {
      endGame("Um alienígena colidiu com o jogador!");
    }
  });
}

function endGame(message) {
  clearInterval(alienMoveInterval);
  clearInterval(alienShootInterval);
  gameOver = true;
  document.getElementById("message").textContent = message;
  document.getElementById("message").style.display = "block";
}

function autoFireAndDodge() {
  if (cheatEnabled) {
    // Disparos automáticos
    if (bullets.length === 0) {
      bullets.push({
        x: playerX + playerWidth / 2 - bulletWidth / 2,
        y: playerY,
      });
    }

    // Seguir os aliens
    const aliveAliens = aliens.filter((alien) => alien.alive);
    if (aliveAliens.length > 0) {
      const closestAlien = aliveAliens.reduce((prev, curr) =>
        Math.abs(curr.x - playerX) < Math.abs(prev.x - playerX) ? curr : prev
      );
      if (closestAlien.x + alienWidth / 2 > playerX + playerWidth / 2) {
        playerX += 5;
      } else if (closestAlien.x + alienWidth / 2 < playerX + playerWidth / 2) {
        playerX -= 5;
      }
    }

    // Desviar das balas dos aliens
    alienBullets.forEach((bullet) => {
      if (
        bullet.y + alienBulletHeight >= playerY && // Bala na altura do jogador
        bullet.x < playerX + playerWidth && // Bala à esquerda do jogador
        bullet.x + alienBulletWidth > playerX // Bala à direita do jogador
      ) {
        if (bullet.x < playerX + playerWidth / 2) {
          playerX += 10; // Desvia para a direita
        } else {
          playerX -= 10; // Desvia para a esquerda
        }
      }
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawBullets();
  drawAlienBullets();
  drawAliens();
  movePlayer();
  fireBullet();
  autoFireAndDodge(); // Lógica do cheat
  checkCollisions();
  checkPlayerAlienCollision(); // Verifica colisão entre alienígenas e jogador
  if (!gameOver) requestAnimationFrame(draw);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
