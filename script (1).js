const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const coconut = document.getElementById('coconut');
const apple = document.getElementById('apple');
const goldenCoconut = document.getElementById('golden-coconut');
const basket = document.getElementById('basket');
const scoreOutput = document.getElementById('score-output');
const highScoreOutput = document.getElementById('high-score-output');
const timerOutput = document.getElementById('timer-output');
const gameOverMsg = document.getElementById('game-over');

// Variables to keep track of game info
let score = 0;
let highScore = localStorage.getItem('highScore') || 0; // Save best score in browser storage
let coconutY = 0, appleY = -100, goldenY = -200; // Positions for falling objects
let coconutSpeed = 50; // How fast normal coconuts fall (smaller is faster)
let coconutInterval, appleInterval, goldenInterval, timerInterval; // Timers for moving stuff
let secondsElapsed = 0;
let coconutCount = 0;
let isGameRunning = false; // Check if game is on or off
let goldenFalling = false; // I had help from AI for this part ^^^: If golden coconut is falling or not

function updateScoreDisplays() {
  scoreOutput.textContent = 'Score: ' + score;
  highScoreOutput.textContent = 'High Score: ' + highScore;
}

function startGame() {
  if (isGameRunning) return;
  isGameRunning = true;

  score = 0;
  coconutCount = 0;
  coconutSpeed = 50;
  secondsElapsed = 0;
  coconutY = 0;
  appleY = -100;
  goldenY = -200;
  goldenFalling = false;

  updateScoreDisplays();
  timerOutput.textContent = 'Time: 0s';
  gameOverMsg.classList.add('hidden');
  startBtn.classList.add('hidden');

  resetCoconut();
  spawnCoconut();

  setTimeout(spawnApple, 3000); // Delay apple spawn 3 sec
  setTimeout(spawnGoldenCoconut, 10000); // Delay golden coconut spawn 10 sec: I had help from AI ^^^

  timerInterval = setInterval(() => {
    secondsElapsed++;
    timerOutput.textContent = `Time: ${secondsElapsed}s`;
  }, 1000);
}

function spawnCoconut() {
  clearInterval(coconutInterval);
  coconutInterval = setInterval(() => {
    coconutY += 6;
    coconut.style.top = coconutY + 'px';

    if (coconutY >= 370 && checkCatch(coconut)) {
      score++;
      coconutCount++;
      updateScoreDisplays();

      if (coconutCount % 5 === 0) {
        coconutSpeed = Math.max(10, coconutSpeed - 6); // I had help from AI: Speed up coconut falling but never too fast
        restartCoconutLoop();
      }

      resetCoconut();
    } else if (coconutY > 400) {
      endGame();
    }
  }, coconutSpeed);
}

function spawnApple() {
  apple.classList.remove('hidden');
  appleY = 0;
  apple.style.left = Math.floor(Math.random() * 260) + 'px';

  clearInterval(appleInterval);
  appleInterval = setInterval(() => {
    appleY += 5;
    apple.style.top = appleY + 'px';

    if (appleY >= 370 && checkCatch(apple)) {
      score += 2;
      updateScoreDisplays();
      resetApple();
    } else if (appleY > 400) {
      resetApple();
    }
  }, 45);
}

function spawnGoldenCoconut() {
  if (goldenFalling || !isGameRunning) return; // AI assistance: Only one golden coconut at a time and only if game running
  goldenFalling = true;

  goldenCoconut.classList.remove('hidden');
  goldenY = 0;
  goldenCoconut.style.left = Math.floor(Math.random() * 260) + 'px';

  clearInterval(goldenInterval);
  goldenInterval = setInterval(() => {
    goldenY += 9; // I had help from AI: Golden coconut falls faster than normal
    goldenCoconut.style.top = goldenY + 'px';

    if (goldenY >= 370 && checkCatch(goldenCoconut)) {
      score += 5;
      coconutSpeed += 6;
      updateScoreDisplays();
      resetGolden();
      goldenFalling = false;
      restartCoconutLoop();

      clearInterval(goldenInterval);
      // I had AI help for this part: Spawn next golden coconut randomly between 15 and 30 seconds later
      setTimeout(spawnGoldenCoconut, Math.random() * 15000 + 15000);
    } else if (goldenY > 400) {
      resetGolden();
      goldenFalling = false;
      clearInterval(goldenInterval);
      setTimeout(spawnGoldenCoconut, Math.random() * 15000 + 15000);
    }
  }, 35);
}

function resetCoconut() {
  coconutY = 0;
  coconut.style.top = '0px';
  coconut.style.left = Math.floor(Math.random() * 260) + 'px';
}

function resetApple() {
  appleY = -100;
  apple.style.top = '-100px';
  apple.style.left = Math.floor(Math.random() * 260) + 'px';
}

function resetGolden() {
  goldenY = -200;
  goldenCoconut.style.top = '-200px';
  goldenCoconut.style.left = Math.floor(Math.random() * 260) + 'px';
  goldenCoconut.classList.add('hidden');
}

function restartCoconutLoop() {
  clearInterval(coconutInterval);
  spawnCoconut();
}

function endGame() {
  clearInterval(coconutInterval);
  clearInterval(appleInterval);
  clearInterval(goldenInterval);
  clearInterval(timerInterval);
  isGameRunning = false;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
  }

  updateScoreDisplays();
  gameOverMsg.classList.remove('hidden');
}

function checkCatch(item) {
  const itemX = item.offsetLeft;
  const basketX = basket.offsetLeft;
  return Math.abs(itemX - basketX) < 30;  // Check if item is close enough to basket ^^^
}

document.addEventListener('keydown', (e) => {
  const step = 25;
  let basketX = basket.offsetLeft;

  if (e.key === 'ArrowLeft' && basketX > 0) {
    basket.style.left = (basketX - step) + 'px';
  } else if (e.key === 'ArrowRight' && basketX < 240) {
    basket.style.left = (basketX + step) + 'px';
  }
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

updateScoreDisplays();
