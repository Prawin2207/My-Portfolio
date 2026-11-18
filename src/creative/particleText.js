// PIXI.js interactive particle typography.
// Text is rasterised to an offscreen canvas, sampled into points, and each point
// becomes a sprite that springs home and is repelled by the pointer.
import 'pixi.js/unsafe-eval'; // CSP-safe: avoids new Function() in PIXI's shader system
import { Application, Container, Graphics, Sprite } from 'pixi.js';

const BONE = 0xede8df;
const LIME = 0xc6ff3d;

function sampleText(lines, width, height, fontFamily) {
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  const g = c.getContext('2d', { willReadFrequently: true });
  // measure at 100px, then scale so the widest line fills 90% of the width
  g.font = `800 100px ${fontFamily}`;
  const widest = Math.max(...lines.map((t) => g.measureText(t).width));
  const size = Math.min((100 * width * 0.9) / widest, height / (lines.length * 0.95));
  g.fillStyle = '#fff';
  g.textBaseline = 'middle';
  g.font = `800 ${size}px ${fontFamily}`;
  const lh = size * 0.92;
  const top = height / 2 - ((lines.length - 1) * lh) / 2;
  lines.forEach((t, i) => {
    const w = g.measureText(t).width;
    g.fillText(t, (width - w) / 2, top + i * lh);
  });
  const gap = width > 1000 ? 6 : width > 600 ? 5 : 4;
  const data = g.getImageData(0, 0, width, height).data;
  const pts = [];
  for (let y = 0; y < height; y += gap) {
    for (let x = 0; x < width; x += gap) {
      if (data[(y * width + x) * 4 + 3] > 140) pts.push([x, y]);
    }
  }
  return { pts, gap };
}

export async function createParticleText(host, { lines = ["LET'S", 'BUILD.'], fontFamily = 'Syne' } = {}) {
  try { await document.fonts.load(`800 120px ${fontFamily}`); } catch { /* use fallback font */ }

  const app = new Application();
  await app.init({
    resizeTo: host,
    backgroundAlpha: 0,
    antialias: true,
    autoDensity: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    preference: 'webgl'
  });
  app.canvas.setAttribute('aria-hidden', 'true');
  app.canvas.style.display = 'block';
  host.appendChild(app.canvas);

  const dot = new Graphics().circle(0, 0, 4).fill(0xffffff);
  const texture = app.renderer.generateTexture(dot);
  const layer = new Container();
  app.stage.addChild(layer);

  let particles = [];
  const pointer = { x: -9999, y: -9999, down: false };

  const build = () => {
    layer.removeChildren().forEach((s) => s.destroy());
    const w = Math.floor(host.clientWidth);
    const h = Math.floor(host.clientHeight);
    if (!w || !h) return;
    const { pts, gap } = sampleText(lines, w, h, fontFamily);
    const scale = (gap * 0.42) / 4;
    particles = pts.map(([x, y]) => {
      const s = new Sprite(texture);
      s.anchor.set(0.5);
      s.scale.set(scale);
      s.tint = BONE;
      // start scattered; springs pull them into the letters
      s.x = Math.random() * w;
      s.y = Math.random() * h;
      layer.addChild(s);
      return { s, hx: x, hy: y, vx: 0, vy: 0 };
    });
  };
  build();

  // Touch screens have no hover, so when nobody is touching, a "ghost" probe
  // sweeps a figure-8 through the letters and keeps the signal alive.
  const touchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  let lastInput = -Infinity;
  let t = 0;
  const radius = () => Math.max(70, host.clientWidth * 0.08);
  app.ticker.add((ticker) => {
    t += ticker.deltaMS / 1000;
    let px = pointer.x;
    let py = pointer.y;
    let R = radius() * (pointer.down ? 1.8 : 1);
    if (touchDevice && performance.now() - lastInput > 1400) {
      px = host.clientWidth * (0.5 + 0.44 * Math.sin(t * 0.7));
      py = host.clientHeight * (0.5 + 0.32 * Math.sin(t * 1.4));
      R = Math.max(42, host.clientWidth * 0.12);
    }
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const s = p.s;
      const dx = s.x - px;
      const dy = s.y - py;
      const d2 = dx * dx + dy * dy;
      if (d2 < R * R) {
        const d = Math.sqrt(d2) || 1;
        const f = (R - d) / R;
        p.vx += (dx / d) * f * 5;
        p.vy += (dy / d) * f * 5;
      }
      p.vx += (p.hx - s.x) * 0.055;
      p.vy += (p.hy - s.y) * 0.055;
      p.vx *= 0.82;
      p.vy *= 0.82;
      s.x += p.vx;
      s.y += p.vy;
      const off = Math.abs(p.hx - s.x) + Math.abs(p.hy - s.y);
      s.tint = off > 6 ? LIME : BONE;
    }
  });

  const local = (e) => {
    const r = host.getBoundingClientRect();
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
    lastInput = performance.now();
  };
  const onMove = (e) => { if (e.pointerType !== 'touch') local(e); };
  const onLeave = (e) => { if (e.pointerType !== 'touch') { pointer.x = pointer.y = -9999; pointer.down = false; } };
  const onDown = (e) => { if (e.pointerType !== 'touch') { local(e); pointer.down = true; } };
  const onUp = () => { pointer.down = false; };
  // Touch: pointer events get cancelled as soon as the page starts scrolling,
  // but touchmove keeps firing, so the finger disturbs the dots even mid-scroll.
  const onTouch = (e) => { const tp = e.touches[0]; if (tp) local(tp); };
  const onTouchEnd = () => { pointer.x = pointer.y = -9999; lastInput = performance.now(); };
  host.addEventListener('pointermove', onMove, { passive: true });
  host.addEventListener('pointerleave', onLeave);
  host.addEventListener('pointerdown', onDown, { passive: true });
  window.addEventListener('pointerup', onUp);
  host.addEventListener('touchstart', onTouch, { passive: true });
  host.addEventListener('touchmove', onTouch, { passive: true });
  host.addEventListener('touchend', onTouchEnd);
  host.addEventListener('touchcancel', onTouchEnd);

  let resizeTimer = 0;
  const ro = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(build, 200);
  });
  ro.observe(host);

  return {
    start: () => app.ticker.start(),
    stop: () => app.ticker.stop(),
    scatter: () => particles.forEach((p) => { p.vx += (Math.random() - 0.5) * 60; p.vy += (Math.random() - 0.5) * 60; }),
    // fling every dot to a random spot so the words visibly re-form
    assemble: () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      particles.forEach((p) => { p.s.x = Math.random() * w; p.s.y = Math.random() * h; p.vx = p.vy = 0; });
    },
    destroy() {
      ro.disconnect();
      clearTimeout(resizeTimer);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      host.removeEventListener('touchstart', onTouch);
      host.removeEventListener('touchmove', onTouch);
      host.removeEventListener('touchend', onTouchEnd);
      host.removeEventListener('touchcancel', onTouchEnd);
      texture.destroy(true);
      app.destroy(true, { children: true });
    }
  };
}
