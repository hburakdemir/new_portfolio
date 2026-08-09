import { useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import useReducedMotion from '../hooks/useReducedMotion';
import useMediaQuery from '../hooks/useMediaQuery';

const MIN_SPAWN_DIST = 14;
const DUST_COLOR = '#61dafb'; // React's own cyan — "iconun renginde toz"

// Global custom cursor: a React logo that trails the pointer with a light
// lerp, dropping small glowing "dust" particles as it moves. Fully skipped
// (component renders nothing, native cursor stays) under reduced motion or
// on touch/coarse-pointer devices, where there's no real cursor to replace.
export default function CursorTrail() {
  const reducedMotion = useReducedMotion();
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)');
  const active = !reducedMotion && finePointer;

  const iconRef = useRef(null);
  const dustLayerRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;

    document.documentElement.classList.add('custom-cursor-active');
    const dustLayer = dustLayerRef.current;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const rendered = { x: target.x, y: target.y, scale: 1 };
    let lastSpawn = { x: target.x, y: target.y };
    let hovering = false;
    let raf;

    const spawnDust = (x, y) => {
      const el = document.createElement('span');
      el.className = 'cursor-dust';
      const size = 4 + Math.random() * 5;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.setProperty('--dx', `${(Math.random() - 0.5) * 26}px`);
      dustLayer?.appendChild(el);
      window.setTimeout(() => el.remove(), 750);
    };

    const tick = () => {
      rendered.x += (target.x - rendered.x) * 0.35;
      rendered.y += (target.y - rendered.y) * 0.35;
      rendered.scale += ((hovering ? 1.3 : 1) - rendered.scale) * 0.2;
      if (iconRef.current) {
        iconRef.current.style.transform =
          `translate3d(${rendered.x}px, ${rendered.y}px, 0) translate(-50%, -50%) scale(${rendered.scale})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      hovering = !!e.target.closest('a, button, [role="button"]');
      const dist = Math.hypot(e.clientX - lastSpawn.x, e.clientY - lastSpawn.y);
      if (dist > MIN_SPAWN_DIST) {
        spawnDust(e.clientX, e.clientY);
        lastSpawn = { x: e.clientX, y: e.clientY };
      }
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.classList.remove('custom-cursor-active');
      dustLayer?.replaceChildren();
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div ref={dustLayerRef} className="pointer-events-none fixed inset-0 z-[9998]" aria-hidden="true" />
      <div ref={iconRef} className="pointer-events-none fixed left-0 top-0 z-[9999]" aria-hidden="true">
        <Icon
          icon="logos:react"
          width={30}
          height={30}
          style={{ filter: `drop-shadow(0 0 6px ${DUST_COLOR}d9) drop-shadow(0 0 14px ${DUST_COLOR}80)` }}
        />
      </div>
    </>
  );
}
