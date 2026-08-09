import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initHeroParticles } from '../three/heroParticles';
import useReducedMotion from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

// Mounts/tears down the vanilla-Three.js particle field and drives its
// scroll-linked "settle" progress from a ScrollTrigger spanning a *fixed*
// 280px of scroll from the hero's top (0 = scattered, 1 = settled into
// HBD) — "mevcut bulunduğu konumda birleşsin": the mark sits at its usual
// spot in the hero, which doesn't itself move as you scroll, so the trigger
// range has to stay short enough that assembly finishes while that spot is
// still comfortably on screen. A range tied to the section's own height
// (e.g. half the hero) was long enough that by the time assembly finished,
// the scroll needed to get there had *also* carried the mark's fixed
// position most of the way off the top of the screen. All state is created
// inside this one effect and fully torn down in its cleanup, so React 19 StrictMode's dev
// mount->unmount->mount just runs two independent, fully-cleaned instances
// (the cancelToken is what makes the *first*, discarded one actually stop
// instead of leaking a whole second WebGL scene — see heroParticles.js).
export default function HeroCanvas({ className = '', xOffset = 0 }) {
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return undefined;

    const cancelToken = { cancelled: false };
    let api = null;
    let trigger = null;
    const container = containerRef.current;

    initHeroParticles(container, { theme: 'light', xOffset, cancelToken }).then((result) => {
      if (cancelToken.cancelled || !result) return;
      api = result;
      trigger = ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: '+=280',
        scrub: true,
        onUpdate(self) {
          api.setAssemble(self.progress);
        },
      });
    });

    return () => {
      cancelToken.cancelled = true;
      trigger?.kill();
      api?.dispose();
    };
  }, [reducedMotion, xOffset]);

  return <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`} />;
}
