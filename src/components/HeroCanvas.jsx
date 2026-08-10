import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initHeroParticles } from '../three/heroParticles';
import useReducedMotion from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

// Mounts/tears down the vanilla-Three.js particle field and drives its
// scroll-linked "settle" progress from a ScrollTrigger that *pins* the hero
// ("kaydırınca yazı tamamlanana kadar sayfa sabit kalsın") for a fixed
// 1000px of scroll: 0 progress = scattered, 1 = settled into HBD, section un-pins
// and normal scroll resumes right after. Pinning is what actually fixes
// "kaydırınca ekranda hbd yazısını göremiyorsun" — scrubbing the same
// progress against a *non-pinned* section meant the page (and the mark's
// fixed position in it) scrolled away at the same time assembly was
// finishing, so by the time it was fully formed it had also scrolled mostly
// off screen. All state is created inside this one effect and fully torn
// down in its cleanup, so React 19 StrictMode's dev mount->unmount->mount
// just runs two independent, fully-cleaned instances (the cancelToken is
// what makes the *first*, discarded one actually stop instead of leaking a
// whole second WebGL scene — see heroParticles.js).
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
        end: '+=1000',
        pin: true,
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
