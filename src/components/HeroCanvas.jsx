import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initHeroParticles } from '../three/heroParticles';
import useReducedMotion from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

// Mounts/tears down the vanilla-Three.js particle field and drives its
// scroll-linked "settle" progress from a ScrollTrigger that *pins* the hero
// ("kaydırınca yazı tamamlanana kadar sayfa sabit kalsın") for a fixed
// 1400px of scroll. Progress is remapped so assembly finishes at 1000px in
// (0 = scattered, 1 = settled into HBD) and then *holds* fully formed for
// the remaining 400px before the section un-pins — "hbd yazısı biraz daha
// uzun kalmalı": without a hold, the instant assembly hit 1.0 the section
// was already unpinning, so the fully-formed mark was only ever on screen
// for a single frame. Pinning at all is what fixes "kaydırınca ekranda hbd
// yazısını göremiyorsun" — scrubbing the same progress against a
// *non-pinned* section meant the page (and the mark's fixed position in it)
// scrolled away at the same time assembly was finishing, so by the time it
// was fully formed it had also scrolled mostly off screen. All state is
// created inside this one effect and fully torn down in its cleanup, so
// React 19 StrictMode's dev mount->unmount->mount just runs two independent,
// fully-cleaned instances (the cancelToken is what makes the *first*,
// discarded one actually stop instead of leaking a whole second WebGL scene
// — see heroParticles.js).
const PIN_DISTANCE = 1400;
const ASSEMBLE_DISTANCE = 1000;
export default function HeroCanvas({ className = '', xOffset = 0 }) {
  const containerRef = useRef(null);
  const apiRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !containerRef.current) return undefined;

    const cancelToken = { cancelled: false };
    const container = containerRef.current;

    // Created synchronously, *before* the async WebGL/font work below, and
    // from useLayoutEffect (not useEffect) so its pin-spacer exists before
    // any later-mounted section's own ScrollTrigger (e.g. RoadJourney's)
    // ever measures the page. Creating this pin only after that async work
    // resolved used to mean every downstream trigger's start/end got
    // computed against a page still short by PIN_DISTANCE (this section's
    // spacer didn't exist yet) — confirmed by logging RoadJourney's actual
    // ScrollTrigger.start, which stayed wrong even after an explicit
    // ScrollTrigger.refresh() called right after this pin was (belatedly)
    // created; GSAP doesn't reliably re-measure an already-pinned trigger's
    // cached start for a function-based `end` on a plain refresh(). onUpdate
    // just no-ops via apiRef until the particle system is ready.
    const trigger = ScrollTrigger.create({
      trigger: '#hero',
      start: 'top top',
      end: `+=${PIN_DISTANCE}`,
      pin: true,
      scrub: true,
      onUpdate(self) {
        apiRef.current?.setAssemble(Math.min(1, self.progress * (PIN_DISTANCE / ASSEMBLE_DISTANCE)));
      },
    });

    initHeroParticles(container, { theme: 'light', xOffset, cancelToken }).then((result) => {
      if (cancelToken.cancelled || !result) return;
      apiRef.current = result;
      // Catch up on whatever scroll progress happened while particles were
      // still loading, instead of snapping straight to it on the next tick.
      result.setAssemble(Math.min(1, trigger.progress * (PIN_DISTANCE / ASSEMBLE_DISTANCE)));
    });

    return () => {
      cancelToken.cancelled = true;
      trigger.kill();
      apiRef.current?.dispose();
      apiRef.current = null;
    };
  }, [reducedMotion, xOffset]);

  return <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`} />;
}
