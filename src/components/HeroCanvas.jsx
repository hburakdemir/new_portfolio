import { useEffect, useRef } from 'react';
import { initHeroParticles } from '../three/heroParticles';
import useReducedMotion from '../hooks/useReducedMotion';

// Mounts/tears down the vanilla-Three.js particle field, which assembles
// itself into the HBD monogram on load and stays formed (no scroll
// linkage). All state is created inside this one effect and fully torn
// down in its cleanup, so React 19 StrictMode's dev mount->unmount->mount
// just runs two independent, fully-cleaned instances.
export default function HeroCanvas({ className = '', xOffset = 0 }) {
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return undefined;

    let cancelled = false;
    let api = null;
    const container = containerRef.current;

    initHeroParticles(container, { theme: 'light', xOffset }).then((result) => {
      if (cancelled || !result) return;
      api = result;
    });

    return () => {
      cancelled = true;
      api?.dispose();
    };
  }, [reducedMotion, xOffset]);

  return <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`} />;
}
