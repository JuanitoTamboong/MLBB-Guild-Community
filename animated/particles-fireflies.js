// particles-fire.js – MORE FIREFLIES · ANCIENT ATMOSPHERE
(function() {
  'use strict';
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '0';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  // MORE FIREFLIES – increased count to 80
  const particles = [];
  const COUNT = 80;

  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 1.5 + Math.random() * 3.5,
      dx: (Math.random() - 0.5) * 0.4,
      dy: -0.2 - Math.random() * 0.5,
      life: 0.3 + Math.random() * 0.7,
      maxLife: 0.8 + Math.random() * 1.2,
      hue: 28 + Math.random() * 22,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.04,
      twinkleOffset: Math.random() * 100,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (const p of particles) {
      // movement with slight drift
      p.x += p.dx + Math.sin(p.pulse) * 0.08;
      p.y += p.dy + Math.cos(p.pulse * 0.7) * 0.05;
      p.life -= 0.0025;
      p.pulse += p.pulseSpeed;

      // respawn
      if (p.life <= 0 || p.y < -20 || p.x < -20 || p.x > w + 20) {
        p.x = Math.random() * w;
        p.y = h + 10 + Math.random() * 40;
        p.life = 0.5 + Math.random() * 0.8;
        p.maxLife = p.life;
        p.r = 1.5 + Math.random() * 3.5;
        p.dx = (Math.random() - 0.5) * 0.35;
        p.dy = -0.2 - Math.random() * 0.5;
        p.hue = 28 + Math.random() * 22;
      }

      // twinkling effect
      const twinkle = 0.6 + 0.4 * Math.sin(p.pulse * 1.5 + p.twinkleOffset);
      const alpha = Math.min(1, (p.life / p.maxLife) * 1.3) * twinkle;
      const rad = p.r * (0.5 + 0.5 * (p.life / p.maxLife)) * (0.7 + 0.3 * twinkle);

      // glow ring
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad * 3);
      gradient.addColorStop(0, `hsla(${p.hue}, 100%, 80%, ${alpha * 0.9})`);
      gradient.addColorStop(0.2, `hsla(${p.hue + 10}, 90%, 70%, ${alpha * 0.6})`);
      gradient.addColorStop(0.5, `hsla(${p.hue + 20}, 80%, 50%, ${alpha * 0.3})`);
      gradient.addColorStop(1, `hsla(${p.hue + 30}, 70%, 40%, 0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, rad * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // core glow
      ctx.shadowColor = `hsla(${p.hue}, 100%, 80%, ${alpha * 0.8})`;
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 100%, 85%, ${alpha * 0.7})`;
      ctx.fill();

      // bright center
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x - 0.5, p.y - 0.5, rad * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(50, 100%, 95%, ${alpha * 0.6})`;
      ctx.fill();

      // trail effect (subtle)
      ctx.shadowBlur = 0;
      for (let t = 0; t < 3; t++) {
        const trailX = p.x - p.dx * (t + 1) * 4;
        const trailY = p.y - p.dy * (t + 1) * 4 - 2;
        const trailAlpha = alpha * (0.15 - t * 0.04);
        ctx.beginPath();
        ctx.arc(trailX, trailY, rad * (0.5 - t * 0.1), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue + 10}, 80%, 60%, ${trailAlpha})`;
        ctx.fill();
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
})();