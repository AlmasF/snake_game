// Define html elements
const board = document.getElementById("game-board");
const instructionText = document.getElementById("instruction-text");
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScore = localStorage.getItem('highScore') || 0;
const highScoreDisplay = document.getElementById('highScore');
highScoreDisplay.textContent = highScore.toString().padStart(3, '0');

// Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let direction = 'RIGHT';
let gameInterval;
let gameSpeedDelay = 200; // Initial speed
let gameStarted = false;

function draw() {
  board.innerHTML = "";

  drawSnake();
  drawFood();
  updateScore();
}

// Draw the snake on the board
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// create a snake or food cube
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Set position of a snake or food cube
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
  board.appendChild(element);
}

// Draw the food on the board
function drawFood() {
  if (!gameStarted) return;

  const foodElement = createGameElement("div", "food");
  setPosition(foodElement, food);
  board.appendChild(foodElement);
}

// Generate random food position
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Moving the snake
function move() {
  const head = { ...snake[0] };

  switch(direction) {
    case 'RIGHT':
      head.x += 1
      break;
    case 'LEFT':
      head.x -= 1
      break;
    case 'DOWN':
      head.y += 1
      break;
    case 'UP':
      head.y -= 1
      break;
    default:
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
    clearInterval(gameInterval); // Clear any existing intervals
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay); // Restart interval with new speed
  } else {
    snake.pop();
  }
}

function startGame() {
  gameStarted = true; // Keep track of a running game
  instructionText.style.display = 'none';
  logo.style.display = 'none';
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
}

function handleKeyPress(event) {
  console.log(event.key, event.code);
  if (
    (!gameStarted && event.code === 'Space') 
    || (!gameStarted && event.key === ' ')
  ) {
    startGame();
    return;
  }

  switch(event.key) {
    case 'ArrowUp':
      if (direction !== 'DOWN') direction = 'UP';
      break;
    case 'ArrowDown':
      if (direction !== 'UP') direction = 'DOWN';
      break;
    case 'ArrowLeft':
      if (direction !== 'RIGHT') direction = 'LEFT';
      break;
    case 'ArrowRight':
      if (direction !== 'LEFT') direction = 'RIGHT';
      break;
    default:
      break;
  }

  event.preventDefault();
}


function increaseSpeed() {
  console.log(gameSpeedDelay)
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5; // Increase speed by reducing delay
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3; // Increase speed by reducing delay
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 1; // Increase speed by reducing delay
  } else {
    gameSpeedDelay = 50; // Cap the speed increase
  }
}

function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{x: 10, y: 10}];
  food = generateFood();
  direction = 'RIGHT';
  gameSpeedDelay = 200;
  updateScore();
}

function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, '0');
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = 'block';
  logo.style.display = 'block';
}

function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    localStorage.setItem('highScore', currentScore);
    highScoreDisplay.textContent = currentScore.toString().padStart(3, '0');
    alert(`New High Score: ${currentScore}`);
  }
  score.textContent = '000';
}

document.addEventListener('keydown', handleKeyPress);