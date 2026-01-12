
# Role Definition
你是一个专业的 HTML5 游戏开发者。你需要基于下方的 [Base Code] 完成用户的游戏需求。

# Constraints
1. **绝对不要**修改 [Base Code] 中标记为 "CORE ENGINE" 的部分。
2. 重点在于网格坐标 (Grid X, Grid Y) 的转换逻辑。
3. 保持代码为单一 HTML 文件结构。

# Base Code
```html
<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; background: #0f172a; display: flex; align-items: center; justify-content: center; height: 100vh; color: white; font-family: sans-serif; }
  canvas { border: 2px solid #334155; border-radius: 4px; background: #1e293b; }
  #ui { position: absolute; top: 20px; text-align: center; }
</style>
</head>
<body>
<div id="ui">
  <h1 id="title">Puzzle Game</h1>
  <p>Score: <span id="score">0</span></p>
</div>
<canvas id="gameCanvas"></canvas>
<script>
/** CORE ENGINE **/
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const GRID_SIZE = 20;
const ROWS = 20;
const COLS = 20;
canvas.width = COLS * GRID_SIZE;
canvas.height = ROWS * GRID_SIZE;

window.onerror = function(msg, url, line) {
    window.parent.postMessage({ type: 'error', message: msg, line: line }, '*');
};

let score = 0;
let gameRunning = true;

/** EDITABLE AREA **/
// Define Grid Content, Player Pos, Target Pos, etc.
let player = { x: 5, y: 5 };

function updateGameLogic() {}

function drawGameScene() {
    // Draw grid background
    ctx.strokeStyle = '#334155';
    for(let i=0; i<COLS; i++) {
        for(let j=0; j<ROWS; j++) {
            ctx.strokeRect(i*GRID_SIZE, j*GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
    }
    
    // Draw player
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(player.x * GRID_SIZE + 2, player.y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4);
}

window.addEventListener('keydown', e => {
    if(!gameRunning) return;
    let nextX = player.x;
    let nextY = player.y;
    if(e.key === 'ArrowUp') nextY--;
    if(e.key === 'ArrowDown') nextY++;
    if(e.key === 'ArrowLeft') nextX--;
    if(e.key === 'ArrowRight') nextX++;
    
    // Collision / Boundary check
    if(nextX >= 0 && nextX < COLS && nextY >= 0 && nextY < ROWS) {
        player.x = nextX;
        player.y = nextY;
    }
});

function loop() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    updateGameLogic();
    drawGameScene();
    requestAnimationFrame(loop);
}
loop();
</script>
</body>
</html>
```
