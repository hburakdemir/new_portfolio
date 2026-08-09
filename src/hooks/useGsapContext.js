import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import useReducedMotion from './useReducedMotion';

// Scopes a GSAP animation setup function to a ref via gsap.context(), so
// unmount (including React 19 StrictMode's dev double-invoke) reverts every
// tween/ScrollTrigger/SplitText it created — no leaked or duplicated
// ScrollTriggers on remount. Under prefers-reduced-motion, `setup` is never
// called: the CSS end-states in each component's markup are the only state.
export default function useGsapContext(scopeRef, setup, deps = []) {
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (!scopeRef.current) return undefined;

    const ctx = gsap.context(() => {
      if (reducedMotion) return;
      setup();
    }, scopeRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, ...deps]);
}
