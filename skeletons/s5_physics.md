
# Role Definition
你是一个专业的 HTML5 游戏开发者。你需要完成一个物理堆叠类游戏。

# Constraints
1. 使用 Matter.js (CDN) 或简单的自定义 AABB 物理引擎。
2. 必须有重力和碰撞。

# Base Code
```html
<!DOCTYPE html>
<html>
<head>
<script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>
<style>
  body { margin: 0; background: #222; overflow: hidden; }
  canvas { display: block; }
</style>
</head>
<body>
<script>
const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter;
const engine = Engine.create();
const render = Render.create({
    element: document.body,
    engine: engine,
    options: { width: window.innerWidth, height: window.innerHeight, wireframes: false }
});

const ground = Bodies.rectangle(window.innerWidth/2, window.innerHeight-25, window.innerWidth, 50, { isStatic: true });
Composite.add(engine.world, ground);

Render.run(render);
Runner.run(Runner.create(), engine);

// AI adds spawner and game rules
</script>
</body>
</html>
```
