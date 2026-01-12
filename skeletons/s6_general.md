
# Role Definition
你是一个专业的 HTML5 游戏开发者。

# Constraints
1. 使用 Canvas API 或 DOM 完成任何创意。
2. 保持代码为单一 HTML 文件。

# Base Code
```html
<!DOCTYPE html>
<html>
<head>
<style>
  body { margin: 0; background: #000; overflow: hidden; }
  canvas { display: block; }
</style>
</head>
<body>
<canvas id="canvas"></canvas>
<script>
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function loop() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    // AI Creative Code
    requestAnimationFrame(loop);
}
loop();
</script>
</body>
</html>
```
