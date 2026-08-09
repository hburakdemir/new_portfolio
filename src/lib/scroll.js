import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export let lenis = null;

// Creates the smooth-scroll instance and wires it into the shared GSAP
// ticker so Lenis and every ScrollTrigger tween stay on the same clock.
// Returns a teardown function; safe to call create/destroy twice in a row
// (React 19 StrictMode double-invokes effects in dev).
export function createLenis({ reducedMotion } = {}) {
  if (reducedMotion) return null;

  lenis = new Lenis({ lerp: 0.1 });
  document.documentElement.classList.add('lenis');
  lenis.on('scroll', ScrollTrigger.update);

  const tick = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenis = null;
    document.documentElement.classList.remove('lenis');
  };
}

export function scrollToHash(hash, { offset = -80, duration } = {}) {
  const target = document.querySelector(hash);
  if (!target) return;
  if (lenis) {
    lenis.scrollTo(target, { offset, force: true, ...(duration != null ? { duration } : {}) });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

// Jumps to a raw page-Y (e.g. a computed scroll position inside a pinned
// scrubbed scene), routed through Lenis when it's running so the jump stays
// smooth instead of fighting Lenis's own scroll loop.
export function scrollToY(y, { duration = 1 } = {}) {
  if (lenis) {
    lenis.scrollTo(y, { duration, force: true });
  } else {
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

// Sets scroll position immediately, no easing — used while the user is
// actively dragging something (e.g. the road-journey car) so the page
// tracks the pointer 1:1 instead of chasing it with Lenis's eased scrollTo.
export function setScrollY(y) {
  if (lenis) {
    lenis.scrollTo(y, { immediate: true, force: true });
  } else {
    window.scrollTo(0, y);
  }
}
