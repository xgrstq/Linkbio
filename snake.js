// snake.js
export let isPlaying = false;
let snake, food, dx, dy, score, gameInterval, onExitCallback;

const canvasSize = 160;
const grid = 10;

export function initSnake(exitCb) {
    isPlaying = true;
    onExitCallback = exitCb;
    snake = [{x: 80, y: 80}]; 
    dx = grid; dy = 0; score = 0;
    
    const screen = document.getElementById("screen");
    screen.innerHTML = `
        <div style="text-align:center">SNAKE<br>Score: <span id="score">0</span></div>
        <canvas id="snakeCanvas" width="160" height="140"></canvas>
        <div style="font-size:7px;margin-top:5px">B = EXIT</div>
    `;
    
    spawnFood();
    gameInterval = setInterval(update, 150);
}

export function handleSnakeInput(dir) {
    if (dir === 'up' && dy === 0) { dx = 0; dy = -grid; }
    if (dir === 'down' && dy === 0) { dx = 0; dy = grid; }
    if (dir === 'left' && dx === 0) { dx = -grid; dy = 0; }
    if (dir === 'right' && dx === 0) { dx = grid; dy = 0; }
}

function spawnFood() {
    food = { 
        x: Math.floor(Math.random() * (canvasSize/grid)) * grid, 
        y: Math.floor(Math.random() * (140/grid)) * grid 
    };
}

function update() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    // Collision check
    if (head.x < 0 || head.x >= 160 || head.y < 0 || head.y >= 140 || snake.some(s => s.x === head.x && s.y === head.y)) {
        stopGame();
        alert("GAME OVER! Score: " + score);
        onExitCallback(); // Balik ke menu utama
        return;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById("score").innerText = score;
        spawnFood();
    } else {
        snake.pop();
    }
    draw();
}

function draw() {
    const canvas = document.getElementById("snakeCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, 160, 140);
    ctx.fillStyle = "#0f380f"; // Warna Ular
    snake.forEach(s => ctx.fillRect(s.x, s.y, grid-1, grid-1));
    ctx.fillStyle = "#306230"; // Warna Makanan
    ctx.fillRect(food.x, food.y, grid-1, grid-1);
}

export function stopGame() {
    isPlaying = false;
    clearInterval(gameInterval);
}