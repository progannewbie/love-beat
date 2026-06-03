const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let dpr = Math.min(window.devicePixelRatio || 1, 2);
let time = 0;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function heartPoint(t, scale) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);

  return {
    x: x * scale,
    y: -y * scale,
  };
}

function drawBackground() {
  const g = ctx.createRadialGradient(
    width / 2,
    height / 2,
    10,
    width / 2,
    height / 2,
    Math.max(width, height) * 0.75
  );
  g.addColorStop(0, "rgba(60, 0, 40, 0.30)");
  g.addColorStop(0.45, "rgba(20, 0, 30, 0.18)");
  g.addColorStop(1, "rgba(0, 0, 0, 1)");

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
}

function drawGlowHeart(scalePulse) {
  const cx = width / 2;
  const cy = height / 2;
  const baseScale = Math.min(width, height) * 0.015 * scalePulse;

  ctx.save();
  ctx.translate(cx, cy);

  for (let layer = 0; layer < 7; layer++) {
    const alpha = 0.06 + layer * 0.035;
    const spread = 1 + layer * 0.14;

    ctx.beginPath();
    for (let i = 0; i <= Math.PI * 2 + 0.01; i += 0.02) {
      const p = heartPoint(i, baseScale * spread);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();

    ctx.shadowBlur = 35 + layer * 14;
    ctx.shadowColor = `rgba(255, 20, 147, ${alpha})`;
    ctx.fillStyle = `rgba(255, 0, 140, ${alpha})`;
    ctx.fill();
  }

  ctx.beginPath();
  for (let i = 0; i <= Math.PI * 2 + 0.01; i += 0.02) {
    const p = heartPoint(i, baseScale);
    if (i === 0) ctx.moveTo(p.x, p.y);
    else ctx.lineTo(p.x, p.y);
  }
  ctx.closePath();

  const fillGradient = ctx.createLinearGradient(0, -140, 0, 140);
  fillGradient.addColorStop(0, "#ffb3f0");
  fillGradient.addColorStop(0.35, "#ff4ddb");
  fillGradient.addColorStop(0.7, "#ff1493");
  fillGradient.addColorStop(1, "#b0006d");

  ctx.shadowBlur = 45;
  ctx.shadowColor = "rgba(255, 20, 147, 0.95)";
  ctx.fillStyle = fillGradient;
  ctx.fill();

  ctx.lineWidth = 2.5;
  ctx.strokeStyle = "rgba(255, 230, 250, 0.95)";
  ctx.stroke();

  ctx.restore();
}

function drawParticles(scalePulse) {
  const cx = width / 2;
  const cy = height / 2;
  const baseScale = Math.min(width, height) * 0.015 * scalePulse;

  for (let i = 0; i < 220; i++) {
    const t = (i / 220) * Math.PI * 2;
    const p = heartPoint(t, baseScale * (0.88 + Math.random() * 0.28));

    const flicker = 0.5 + 0.5 * Math.sin(time * 4 + i * 0.7);
    const size = 1 + flicker * 2.4;
    const offset = Math.sin(time * 2.4 + i * 0.25) * 5;

    ctx.beginPath();
    ctx.arc(cx + p.x + offset, cy + p.y + offset, size, 0, Math.PI * 2);

    const alpha = 0.3 + flicker * 0.5;
    ctx.fillStyle = `rgba(255, ${40 + (i % 120)}, ${160 + (i % 80)}, ${alpha})`;
    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(255, 20, 147, 0.9)";
    ctx.fill();
  }
}

function drawText() {
  ctx.save();
  ctx.textAlign = "center";
  ctx.font = "16px Arial";
  ctx.fillStyle = "rgba(255, 220, 245, 0.75)";
  ctx.shadowBlur = 10;
  ctx.shadowColor = "rgba(255, 20, 147, 0.8)";
  ctx.fillText("Love Beat", width / 2, height - 30);
  ctx.restore();
}

function animate() {
  time += 0.03;

  ctx.clearRect(0, 0, width, height);

  drawBackground();

  const beat =
    1 +
    0.08 * Math.sin(time * 2.2) +
    0.05 * Math.sin(time * 4.4) +
    0.025 * Math.sin(time * 8.8);

  drawParticles(beat);
  drawGlowHeart(beat);
  drawText();

  requestAnimationFrame(animate);
}

resize();
animate();
window.addEventListener("resize", resize);
