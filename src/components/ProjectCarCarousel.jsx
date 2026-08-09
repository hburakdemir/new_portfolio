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
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

// The road strip is a fixed max-w-[220px] box with inset-x-6 (24px) margins
// on each side for the line/points — independent of FACE_WIDTH, which is
// the *card's* responsive size, not the strip's.
const POINT_SPAN = 220 - 24 * 2;

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
  // One random hue per project, generated once — "her nokta farklı renkte
  // olmalı rastgele."
  const [pointColors] = useState(() => projects.map(() => `hsl(${Math.floor(Math.random() * 360)} 70% 55%)`));

  const angleRef = useRef(0);
  const animatingRef = useRef(false);
  const dragRef = useRef({ dragging: false, startX: 0, startAngle: 0, moved: false });

  // The car's road position is derived from the stage's own rotation angle
  // (clamped to the 0..N-1 project range, since the strip is a straight
  // line — it can't represent the turntable wrapping all the way around)
  // rather than tracked separately, so it can never drift out of sync with
  // which project is actually in front — that was the "araba ve yolun
  // konumu eş değil" bug: the car used to just spring back to dead-center
  // on release regardless of which project you'd landed on.
  const progressToX = (p) => (p / (N - 1) - 0.5) * POINT_SPAN;
  const angleToProgress = (angle) => clamp(-angle / SEGMENT, 0, N - 1);

  const updateCar = () => {
    const angle = gsap.getProperty(stageRef.current, 'rotateY') || 0;
    gsap.set(carRef.current, { x: progressToX(angleToProgress(angle)) });
  };

  useEffect(() => {
    updateCar();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once, to set the car's initial position
  }, []);

  const settleTo = (targetAngle, duration) => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    gsap.to(stageRef.current, {
      rotateY: targetAngle,
      duration,
      ease: 'power2.inOut',
      onUpdate: updateCar,
      onComplete() {
        angleRef.current = targetAngle;
        setFrontIndex(wrap(Math.round(-targetAngle / SEGMENT), N));
        animatingRef.current = false;
      },
    });
    gsap.to(carRef.current, { rotate: 0, duration: reducedMotion ? 0.001 : 0.5, ease: 'elastic.out(1, 0.6)' });
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
    const liveAngle = d.startAngle + dx * 0.4;
    gsap.set(stageRef.current, { rotateY: liveAngle });
    // The car's base x already tracks the drag via the angle above; layer a
    // small extra tilt on top purely for tactile "steering" feedback.
    gsap.set(carRef.current, { x: progressToX(angleToProgress(liveAngle)), rotate: clamp(dx * 0.05, -6, 6) });
  };

  const onPointerUp = () => {
    const d = dragRef.current;
    if (!d.dragging) return;
    d.dragging = false;
    if (!d.moved) {
      gsap.to(carRef.current, { rotate: 0, duration: reducedMotion ? 0.001 : 0.3, ease: 'power2.out' });
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
        {projects.map((project, i) => (
          <span
            key={project.id}
            className={`absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform ${
              i === frontIndex ? 'scale-150' : ''
            }`}
            style={{ left: `calc(50% + ${progressToX(i)}px)`, backgroundColor: pointColors[i] }}
          />
        ))}
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
