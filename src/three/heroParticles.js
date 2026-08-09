// Hero "signal constellation" — particles assemble into the HBD monogram on
// load and stay in constant restless motion (never a perfectly static
// shape) from then on. No scroll linkage: forms once, stays formed.
import * as THREE from 'three';
import gsap from 'gsap';
import { tokens } from '../lib/tokens.js';

const MONOGRAM = 'HBD';
const FONT = '"Inter Variable", -apple-system, sans-serif';

function sampleMonogramPixels({ isMobile }) {
  const fontSize = isMobile ? 150 : 220;

  const measureCanvas = document.createElement('canvas');
  const measureCtx = measureCanvas.getContext('2d');
  measureCtx.font = `800 ${fontSize}px ${FONT}`;
  const textWidthPx = measureCtx.measureText(MONOGRAM).width;

  const padX = fontSize * 0.25;
  const padY = fontSize * 0.3;
  const width = Math.ceil(textWidthPx + padX * 2);
  const height = Math.ceil(fontSize + padY * 2);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  ctx.fillStyle = '#fff';
  ctx.font = `800 ${fontSize}px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(MONOGRAM, width / 2, height / 2 + fontSize * 0.06);

  const { data } = ctx.getImageData(0, 0, width, height);
  const candidates = [];
  const stride = 2; // skip pixels for a lighter scan; density is resolved at sample time
  for (let y = 0; y < height; y += stride) {
    for (let x = 0; x < width; x += stride) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 128) candidates.push(x, y);
    }
  }
  return { candidates: shufflePairs(candidates), width, height, textWidthPx };
}

// Fisher-Yates over (x,y) pairs. Ink pixels come out of getImageData in
// raster order (top row first), and there are usually far more candidate
// pixels than particles (COUNT) — without shuffling, taking a `% length`
// prefix of an unshuffled array would only ever sample the first letter's
// rows, never reaching the ones stacked below it.
function shufflePairs(arr) {
  const pairCount = arr.length / 2;
  for (let i = pairCount - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const xi = arr[i * 2];
    const yi = arr[i * 2 + 1];
    arr[i * 2] = arr[j * 2];
    arr[i * 2 + 1] = arr[j * 2 + 1];
    arr[j * 2] = xi;
    arr[j * 2 + 1] = yi;
  }
  return arr;
}

function makeSprite() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.7)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// One accent hue total (per the skill's restraint rule) — only the mix
// ratio and blend mode change between light/dark hosting sections, mirroring
// the same light/dark palette-swap technique the reference implementation
// (calio-site's three-hero.js) uses: additive + bright tints on dark,
// normal blending + darker solid tones on light so the mark stays legible.
const PALETTES = {
  dark: [
    [new THREE.Color(tokens.accentDark), 0.55],
    [new THREE.Color(tokens.accent), 0.25],
    [new THREE.Color('#ffffff'), 0.2],
  ],
  light: [
    [new THREE.Color(tokens.accent), 0.6],
    [new THREE.Color(tokens.accentDark), 0.25],
    [new THREE.Color(tokens.ink), 0.15],
  ],
};

function pickColor(palette) {
  let r = Math.random();
  for (const [color, weight] of palette) {
    if (r < weight) return color;
    r -= weight;
  }
  return palette[0][0];
}

// Procedural fallback target (two overlapping rings) used only if the
// offscreen text sample somehow comes back empty (font truly failed to load).
function fallbackCandidates(count) {
  const candidates = [];
  for (let i = 0; i < count; i++) {
    const theta = (i / count) * Math.PI * 2;
    const cx = i % 2 === 0 ? -0.6 : 0.6;
    candidates.push(cx + Math.cos(theta) * 0.9, Math.sin(theta) * 0.9);
  }
  return { candidates, width: 2, height: 2, isFallback: true };
}

export async function initHeroParticles(container, { theme = 'dark', xOffset = 0 } = {}) {
  if (!container) return null;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
  } catch {
    return null;
  }

  const isMobile = window.matchMedia('(max-width: 767px)').matches;
  const COUNT = isMobile ? 1800 : 4000;
  const palette = PALETTES[theme] || PALETTES.dark;

  // Rasterizing the monogram before the self-hosted Inter file is ready
  // would sample a fallback system font's shape instead of the real glyphs.
  try {
    await Promise.all([
      document.fonts.load(`800 32px "Inter Variable"`),
      document.fonts.ready,
    ]);
  } catch {
    /* proceed with whatever font is available */
  }

  let sample = sampleMonogramPixels({ isMobile });
  if (sample.candidates.length === 0) sample = fallbackCandidates(COUNT);
  const { candidates, width, height, textWidthPx } = sample;
  const pixelCount = candidates.length / 2;

  // World units per canvas px, derived from the measured text WIDTH (the
  // inline "HBD" mark's defining dimension) so the whole word fits inside
  // the camera frustum width instead of only a fragment of it.
  const SCALE = (isMobile ? 2.6 : 3.8) / (textWidthPx || width);
  const toWorld = (px, py) => [(px - width / 2) * SCALE, -(py - height / 2) * SCALE];

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.inset = '0';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / Math.max(1, container.clientHeight),
    0.1,
    100
  );
  camera.position.z = 6;

  const targets = new Float32Array(COUNT * 3);
  const scatters = new Float32Array(COUNT * 3);
  const phases = new Float32Array(COUNT);
  const phases2 = new Float32Array(COUNT);
  const colors = new Float32Array(COUNT * 3);
  const positions = new Float32Array(COUNT * 3);
  const dispX = new Float32Array(COUNT);
  const dispY = new Float32Array(COUNT);
  const normX = new Float32Array(COUNT);
  const normY = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    const ci = (i % pixelCount) * 2;
    const jitter = () => (Math.random() - 0.5) * 1.4;
    const [wx, wy] = toWorld(candidates[ci] + jitter(), candidates[ci + 1] + jitter());
    const wz = (Math.random() * 2 - 1) * 0.18;

    // xOffset shifts the *settled* mark sideways (e.g. off-center in a
    // full-bleed hero canvas) — normX/normY below are derived from the
    // un-shifted wx,wy, so the idle breathing motion stays centered on the
    // mark's own shape regardless of where xOffset places it on screen.
    targets[i * 3] = wx + xOffset;
    targets[i * 3 + 1] = wy;
    targets[i * 3 + 2] = wz;

    const dir = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
    const rad = 5 * Math.cbrt(Math.random());
    scatters[i * 3] = dir.x * rad;
    scatters[i * 3 + 1] = dir.y * rad;
    scatters[i * 3 + 2] = dir.z * rad * 0.6;

    phases[i] = Math.random();
    phases2[i] = Math.random();

    const mag = Math.hypot(wx, wy) || 1;
    normX[i] = wx / mag;
    normY[i] = wy / mag;

    const col = pickColor(palette);
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;

    positions[i * 3] = scatters[i * 3];
    positions[i * 3 + 1] = scatters[i * 3 + 1];
    positions[i * 3 + 2] = scatters[i * 3 + 2];
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const baseOpacity = theme === 'light' ? 1 : 0.92;
  const mat = new THREE.PointsMaterial({
    size: 0.045,
    map: makeSprite(),
    vertexColors: true,
    transparent: true,
    opacity: baseOpacity,
    depthWrite: false,
    blending: theme === 'light' ? THREE.NormalBlending : THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const state = { assemble: 0 };
  let cursor = null;
  let visible = true;
  let pageVisible = !document.hidden;
  let disposed = false;

  gsap.to(state, { assemble: 1, duration: 2.2, ease: 'power3.inOut' });

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const ndc = new THREE.Vector2();
  const proj = new THREE.Vector3();
  const onPointerMove = (e) => {
    const rect = renderer.domElement.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
      cursor = null;
      return;
    }
    ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
    proj.set(ndc.x, ndc.y, 0.5).unproject(camera);
    const dir = proj.sub(camera.position).normalize();
    if (Math.abs(dir.z) < 1e-5) {
      cursor = null;
      return;
    }
    const t0 = -camera.position.z / dir.z;
    cursor = { x: camera.position.x + dir.x * t0, y: camera.position.y + dir.y * t0 };
  };
  if (finePointer) window.addEventListener('pointermove', onPointerMove, { passive: true });

  const posAttr = geo.getAttribute('position');
  let elapsed = 0;

  const render = (_time, deltaMS) => {
    if (disposed || !visible || !pageVisible) return;
    const dt = deltaMS / 1000;
    elapsed += dt;
    const t = elapsed;

    const p = state.assemble;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      // Restless idle motion: two overlapping sine waves per particle so the
      // mark (formed or not) never sits perfectly still.
      const breathe =
        0.055 * Math.sin(t * 0.9 + phases[i] * 6.283) + 0.03 * Math.sin(t * 2.3 + phases2[i] * 6.283);
      const x = scatters[i3] + (targets[i3] - scatters[i3]) * p + normX[i] * breathe;
      const y = scatters[i3 + 1] + (targets[i3 + 1] - scatters[i3 + 1]) * p + normY[i] * breathe;
      const z = scatters[i3 + 2] + (targets[i3 + 2] - scatters[i3 + 2]) * p + breathe * 0.6;

      let px = 0;
      let py = 0;
      if (cursor) {
        const dx = x - cursor.x;
        const dy = y - cursor.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 0.8 && dist > 1e-4) {
          const force = (1 - dist / 0.8) * 0.35;
          px = (dx / dist) * force;
          py = (dy / dist) * force;
        }
      }
      dispX[i] += (px - dispX[i]) * 0.08;
      dispY[i] += (py - dispY[i]) * 0.08;

      positions[i3] = x + dispX[i];
      positions[i3 + 1] = y + dispY[i];
      positions[i3 + 2] = z;
    }
    posAttr.needsUpdate = true;
    points.rotation.y = Math.sin(t * (Math.PI / 14)) * 0.05;
    renderer.render(scene, camera);
  };
  gsap.ticker.add(render);

  const io = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
  });
  io.observe(container);

  const onVis = () => {
    pageVisible = !document.hidden;
  };
  document.addEventListener('visibilitychange', onVis);

  const ro = new ResizeObserver(() => {
    const w = container.clientWidth;
    const h = Math.max(1, container.clientHeight);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  ro.observe(container);

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    gsap.ticker.remove(render);
    io.disconnect();
    ro.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    if (finePointer) window.removeEventListener('pointermove', onPointerMove);
    geo.dispose();
    mat.map?.dispose();
    mat.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };

  return { dispose };
}
