
# Role Definition
你是一个专业的 HTML5 游戏开发者。你需要完成一个放置/点击类游戏。

# Constraints
1. 重点在于 UI 按钮点击，数值增长，以及自动产出逻辑。
2. 必须包含至少3种可购买的升级项。

# Base Code
```html
<!DOCTYPE html>
<html>
<head>
<style>
  body { background: #1a1a1a; color: white; font-family: sans-serif; padding: 20px; }
  #main-clicker { width: 200px; height: 200px; background: #333; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; margin: 0 auto; transition: transform 0.1s; }
  #main-clicker:active { transform: scale(0.95); }
  .stat { font-size: 24px; text-align: center; margin: 20px; }
  .upgrade { background: #444; padding: 10px; margin: 5px; border-radius: 5px; cursor: pointer; display: flex; justify-content: space-between; }
  .upgrade:hover { background: #555; }
  .upgrade.disabled { opacity: 0.5; cursor: not-allowed; }
</style>
</head>
<body>
  <div class="stat">Resources: <span id="res">0</span></div>
  <div id="main-clicker">CLICK ME</div>
  <div id="upgrades-container"></div>

<script>
let state = {
    res: 0,
    perClick: 1,
    autoRate: 0,
    upgrades: [
        { name: 'Double Tap', cost: 10, power: 1, type: 'click' },
        { name: 'Auto Bot', cost: 50, power: 1, type: 'auto' }
    ]
};

function render() {
    document.getElementById('res').innerText = Math.floor(state.res);
}

document.getElementById('main-clicker').onclick = () => {
    state.res += state.perClick;
    render();
};

setInterval(() => {
    state.res += state.autoRate / 10;
    render();
}, 100);

// AI will generate UI for upgrades and logic
</script>
</body>
</html>
```
