import { useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import skills from '../data/skillsData';
import useReducedMotion from '../hooks/useReducedMotion';

// Auto-scrolls via rAF (not a CSS keyframe animation) specifically so the
// same track can be grabbed and dragged left/right by the user — "sağa
// sola kayabilir" — pausing the autoplay while a drag is in progress.
const Row = ({ items, reverse }) => {
  const trackRef = useRef(null);
  const dragRef = useRef({ dragging: false, startX: 0, startScroll: 0 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = trackRef.current;
    if (!el || reducedMotion) return undefined;

    const speed = reverse ? -0.9 : 0.9;
    // Start each row mid-track rather than at scrollLeft 0: a *forward* row
    // starting at 0 just creeps up from the very start (imperceptibly slow
    // for the first several seconds), while a *reverse* row starting at 0
    // relied on the browser silently clamping the first negative assignment
    // back to 0 and then jumping to `half` — an accidental, one-off effect
    // that only reverse benefited from. Setting both explicitly removes
    // that asymmetry so both rows are visibly moving immediately.
    el.scrollLeft = el.scrollWidth / 2;

    let raf;
    const tick = () => {
      if (!dragRef.current.dragging) {
        const half = el.scrollWidth / 2;
        el.scrollLeft += speed;
        if (el.scrollLeft >= half) el.scrollLeft -= half;
        else if (el.scrollLeft <= 0) el.scrollLeft += half;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reverse, reducedMotion]);

  const onPointerDown = (e) => {
    dragRef.current = { dragging: true, startX: e.clientX, startScroll: trackRef.current.scrollLeft };
    trackRef.current.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current.dragging) return;
    trackRef.current.scrollLeft = dragRef.current.startScroll - (e.clientX - dragRef.current.startX);
  };
  const endDrag = () => {
    dragRef.current.dragging = false;
  };

  return (
    <div
      ref={trackRef}
      className="no-scrollbar flex cursor-grab gap-4 overflow-x-auto active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onPointerCancel={endDrag}
    >
      {[...items, ...items].map((skill, i) => (
        <div
          key={`${skill.name}-${i}`}
          className="flex select-none items-center gap-3 whitespace-nowrap rounded-full border border-black/10 bg-white px-4 py-2 shadow-sm"
        >
          <Icon icon={skill.icon} className={`h-5 w-5 ${skill.color}`} />
          <span className="text-sm font-medium text-ink">{skill.name}</span>
        </div>
      ))}
    </div>
  );
};

export default function SkillsMarquee() {
  const half = Math.ceil(skills.length / 2);
  const rowA = skills.slice(0, half);
  const rowB = skills.slice(half);

  return (
    <div className="space-y-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <Row items={rowA} />
      <Row items={rowB} reverse />
    </div>
  );
}
