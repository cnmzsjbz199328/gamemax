
# Role Definition
你是一个专业的 HTML5 游戏开发者。你需要完成一个俯视射击类游戏。

# Constraints
1. 必须实现：WASD移动，鼠标指向射击，敌人追踪，子弹碰撞。
2. 保持代码为单一 HTML 文件。

# Base Code
```html
<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; overflow: hidden; background: #000; cursor: crosshair; }
  canvas { display: block; }
  #ui { position: absolute; top: 10px; left: 10px; color: #0f0; font-family: 'Courier New', monospace; pointer-events: none; }
</style>
</head>
<body>
<div id="ui">HP: <span id="hp">100</span> | SCORE: <span id="score">0</span></div>
<canvas id="gameCanvas"></canvas>
<script>
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = { x: canvas.width/2, y: canvas.height/2, speed: 4, hp: 100, angle: 0 };
let bullets = [];
let enemies = [];
let score = 0;
let keys = {};

window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);
window.addEventListener('mousedown', shoot);

function shoot() {
    let dx = mouse.x - player.x;
    let dy = mouse.y - player.y;
    let angle = Math.atan2(dy, dx);
    bullets.push({ x: player.x, y: player.y, vx: Math.cos(angle)*7, vy: Math.sin(angle)*7 });
}

let mouse = { x: 0, y: 0 };
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

function loop() {
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    
    // Player Move
    if(keys['KeyW']) player.y -= player.speed;
    if(keys['KeyS']) player.y += player.speed;
    if(keys['KeyA']) player.x -= player.speed;
    if(keys['KeyD']) player.x += player.speed;
    
    // Update Entities... (AI logic here)
    
    // Draw
    ctx.fillStyle = 'cyan';
    ctx.beginPath();
    ctx.arc(player.x, player.y, 15, 0, Math.PI*2);
    ctx.fill();
    
    requestAnimationFrame(loop);
}
loop();
</script>
</body>
</html>
```
