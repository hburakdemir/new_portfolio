import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CarIcon from './CarIcon';
import useReducedMotion from '../hooks/useReducedMotion';

const MAX_FACE_WIDTH = 300;
const FACE_ASPECT = 1.05;
const VIEWPORT_MARGIN = 120;

function useFaceWidth() {
  const getWidth = () =>
    typeof window === 'undefined'
      ? MAX_FACE_WIDTH
      : Math.max(200, Math.min(MAX_FACE_WIDTH, window.innerWidth - VIEWPORT_MARGIN));

  const [width, setWidth] = useState(getWidth);

  useEffect(() => {
    const onResize = () => setWidth(getWidth());
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return width;
}

const wrap = (i, n) => ((i % n) + n) % n;

// Mobile answer to the desktop road scene: no pinned scroll, no elevation —
// everything fits in one screen. The car sits fixed at the top and just
// "steers" toward whichever way you're dragging; the actual navigation is
// the same one-physical-face-per-item turntable the Experience cube uses
// (proven: drag-to-rotate, settle-to-nearest, animatingRef guarding against
// the rapid-click glitch), just with N=project-count faces instead of 6.
export default function ProjectCarCarousel({ projects, language, onSelect }) {
  const N = projects.length;
  const SEGMENT = 360 / N;
  const FACE_WIDTH = useFaceWidth();
  const FACE_HEIGHT = Math.round(FACE_WIDTH * FACE_ASPECT);
  // No extra gap multiplier here (unlike the Experience cube) — at N=8 the
  // perspective foreshortening on the front face (scale ≈ perspective /
  // (perspective - RADIUS)) was already enough to visibly balloon it past
  // its own box and over the car strip above; a wider gap would only make
  // that worse.
  const RADIUS = Math.round(FACE_WIDTH / 2 / Math.tan(Math.PI / N));

  const reducedMotion = useReducedMotion();
  const stageRef = useRef(null);
  const carRef = useRef(null);
  const [frontIndex, setFrontIndex] = useState(0);

  const angleRef = useRef(0);
  const animatingRef = useRef(false);
  const dragRef = useRef({ dragging: false, startX: 0, startAngle: 0, moved: false });

  const settleCar = (duration) => {
    gsap.to(carRef.current, { x: 0, rotate: 0, duration, ease: 'elastic.out(1, 0.6)' });
  };

  const settleTo = (targetAngle, duration) => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    gsap.to(stageRef.current, {
      rotateY: targetAngle,
      duration,
      ease: 'power2.inOut',
      onComplete() {
        angleRef.current = targetAngle;
        setFrontIndex(wrap(Math.round(-targetAngle / SEGMENT), N));
        animatingRef.current = false;
      },
    });
    settleCar(reducedMotion ? 0.001 : 0.5);
  };

  const turn = (direction) => {
    if (animatingRef.current) return;
    settleTo(angleRef.current - direction * SEGMENT, reducedMotion ? 0.001 : 0.5);
  };

  const onPointerDown = (e) => {
    if (animatingRef.current) return;
    dragRef.current = { dragging: true, startX: e.clientX, startAngle: angleRef.current, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d.dragging) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 3) d.moved = true;
    gsap.set(stageRef.current, { rotateY: d.startAngle + dx * 0.4 });
    // A wide, clearly-left-right slide is the point here — the earlier
    // ±16px/±8° version read as the car tilting/bobbing in place rather
    // than sliding, since the rotation was visually more obvious than the
    // small lateral shift.
    const nudge = Math.max(-60, Math.min(60, dx * 0.4));
    gsap.set(carRef.current, { x: nudge, rotate: nudge * 0.12 });
  };

  const onPointerUp = () => {
    const d = dragRef.current;
    if (!d.dragging) return;
    d.dragging = false;
    if (!d.moved) {
      settleCar(reducedMotion ? 0.001 : 0.4);
      return;
    }
    const current = gsap.getProperty(stageRef.current, 'rotateY');
    const nearest = Math.round(current / SEGMENT) * SEGMENT;
    settleTo(nearest, reducedMotion ? 0.001 : 0.35);
  };

  return (
    <div className="select-none">
      <div
        className="relative mx-auto mb-12 h-14 max-w-[220px] touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div className="absolute inset-x-6 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-black/10" />
        <div className="absolute inset-x-6 top-1/2 flex -translate-y-1/2 justify-between">
          <span className="h-1.5 w-1.5 rounded-full bg-black/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-black/15" />
        </div>
        <div
          ref={carRef}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
        >
          <CarIcon width={60} height={33} />
        </div>
      </div>

      <div
        className="relative mx-auto touch-pan-y overflow-hidden rounded-[24px]"
        style={{ width: FACE_WIDTH, height: FACE_HEIGHT, perspective: '3600px' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div ref={stageRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" style={{ transformStyle: 'preserve-3d' }}>
          {projects.map((project, i) => (
            <button
              type="button"
              key={project.id}
              onClick={() => {
                if (i === frontIndex) onSelect(project);
              }}
              className="absolute inset-0 overflow-hidden rounded-[24px] border border-black/[0.06] bg-white text-left shadow-[0_20px_50px_-25px_rgba(0,0,0,0.3)]"
              style={{ transform: `rotateY(${i * SEGMENT}deg) translateZ(${RADIUS}px)`, backfaceVisibility: 'hidden' }}
            >
              <img
                src={project.image}
                alt={project.title[language]}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 border-t border-white/40 bg-white/95 p-4">
                <p className="text-[0.6rem] font-medium uppercase tracking-[0.1em] text-accent">
                  {project.category[language]}
                </p>
                <h3 className="mt-0.5 font-sans text-sm font-semibold text-ink">{project.title[language]}</h3>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-16 flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={() => turn(-1)}
          className="rounded-full border border-black/10 bg-white p-3 text-ink/60 shadow-md transition hover:border-black/20 hover:text-ink"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-1.5">
          {projects.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${i === frontIndex ? 'bg-accent' : 'bg-black/15'}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => turn(1)}
          className="rounded-full border border-black/10 bg-white p-3 text-ink/60 shadow-md transition hover:border-black/20 hover:text-ink"
          aria-label="Next"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
