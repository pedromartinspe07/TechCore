let running = false, lastTime = 0, frames = 0, fps = 0;
function drawBall(ctx, x) {
  ctx.clearRect(0,0,340,60);
  ctx.beginPath();
  ctx.arc(x,30,18,0,2*Math.PI);
  ctx.fillStyle = '#00ff41';
  ctx.shadowColor = '#00ff41';
  ctx.shadowBlur = 16;
  ctx.fill();
  ctx.shadowBlur = 0;
}
function animateBall() {
  if (!running) return;
  const ctx = document.getElementById('fpsCanvas').getContext('2d');
  const now = performance.now();
  if (lastTime) frames++;
  if (now - lastTime > 1000) {
    fps = frames;
    document.getElementById('fpsResult').textContent = `Seu monitor está exibindo aproximadamente ${fps} FPS.`;
    frames = 0;
    lastTime = now;
  }
  const t = (now/8)%340;
  drawBall(ctx, t);
  requestAnimationFrame(animateBall);
}
function startFPSTest() {
  running = true; lastTime = 0; frames = 0; fps = 0;
  document.getElementById('fpsResult').textContent = 'Testando...';
  animateBall();
  setTimeout(() => { running = false; }, 3500);
}