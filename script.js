// Define html elements
const board = document.getElementById("game-board");

// Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();

function draw() {
  board.innerHTML = "";

  drawSnake();
  drawFood();
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

function drawFood() {
  const foodElement = createGameElement("div", "food");
  setPosition(foodElement, food);
  board.appendChild(foodElement);
}

function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Testing draw function
draw();
