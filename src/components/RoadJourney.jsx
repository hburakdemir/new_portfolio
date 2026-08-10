import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToHash, scrollToY, setScrollY } from '../lib/scroll';
import CarIcon from './CarIcon';

gsap.registerPlugin(ScrollTrigger);

// One hill per project: a closed-form cosine wave (not a hand-drawn path) so
// the car's position, elevation and slope are all cheap pure functions of
// its progress along the road — no path-length sampling needed.
const SEGMENT = 520; // world px per hill
const AMPLITUDE = 130; // peak height above the valley baseline
const BASE_Y = 260; // valley y (SVG coords, y grows downward)
const SCENE_H = 420;
const CAR_W = 76;
const CAR_H = 42;
const TILT_DAMPING = 0.55; // keeps the car's uphill/downhill lean subtle
const MAX_TILT = 24;

const roadY = (x) => BASE_Y - (AMPLITUDE / 2) * (1 - Math.cos((2 * Math.PI * x) / SEGMENT));
const roadSlope = (x) => (AMPLITUDE / 2) * ((2 * Math.PI) / SEGMENT) * Math.sin((2 * Math.PI * x) / SEGMENT);
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

function buildPaths(totalWidth) {
  const samplesPerSegment = 28;
  const steps = Math.max(1, Math.round((totalWidth / SEGMENT) * samplesPerSegment));
  let road = `M0,${roadY(0).toFixed(1)}`;
  for (let i = 1; i <= steps; i++) {
    const x = (i / steps) * totalWidth;
    road += ` L${x.toFixed(1)},${roadY(x).toFixed(1)}`;
  }
  const ground = `${road} L${totalWidth},${SCENE_H} L0,${SCENE_H} Z`;
  return { road, ground };
}

export default function RoadJourney({ projects, language, onSelect }) {
  const N = projects.length;
  const totalWidth = N * SEGMENT;

  const outerRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const carOuterRef = useRef(null);
  const carInnerRef = useRef(null);
  const panelRef = useRef(null);
  const viewportWidthRef = useRef(0);
  const stRef = useRef(null);
  const prevProgressRef = useRef(0);
  const flippedRef = useRef(false);
  const activeIndexRef = useRef(0);
  const dragRef = useRef({ dragging: false, startX: 0, startP: 0 });

  const [activeIndex, setActiveIndex] = useState(0);
  const [listOpen, setListOpen] = useState(false);
  const [paths] = useState(() => buildPaths(totalWidth));

  useLayoutEffect(() => {
    if (!outerRef.current || !pinRef.current) return undefined;

    const ro = new ResizeObserver(() => {
      viewportWidthRef.current = pinRef.current.clientWidth;
    });
    ro.observe(pinRef.current);
    viewportWidthRef.current = pinRef.current.clientWidth;

    const update = (p) => {
      const vw = viewportWidthRef.current;
      const trackX = -clamp(p * (totalWidth - vw), 0, Math.max(0, totalWidth - vw));
      gsap.set(trackRef.current, { x: trackX });

      const carWorldX = p * totalWidth;
      const carScreenX = clamp(p * vw, 0, vw) - CAR_W / 2;
      const carY = roadY(carWorldX) - CAR_H + 10;
      gsap.set(carOuterRef.current, { x: carScreenX, y: carY });

      const delta = p - prevProgressRef.current;
      if (delta > 0.0008) flippedRef.current = false;
      else if (delta < -0.0008) flippedRef.current = true;
      prevProgressRef.current = p;

      const tilt = clamp(Math.atan(roadSlope(carWorldX)) * (180 / Math.PI) * TILT_DAMPING, -MAX_TILT, MAX_TILT);
      gsap.set(carInnerRef.current, { rotate: tilt, scaleX: flippedRef.current ? -1 : 1 });

      const idx = clamp(Math.round(p * N - 0.5), 0, N - 1);
      activeIndexRef.current = idx;
      setActiveIndex((current) => (current === idx ? current : idx));
    };

    // Pinned via GSAP's own pin (fixed-position + spacer), not CSS
    // `position: sticky` — the site's `html,body { overflow-x: hidden }`
    // (index.css) forces overflow-y to compute as 'auto' on both (a spec
    // quirk: setting only one axis force-computes the other from 'visible'
    // to 'auto'), which makes them count as scroll containers and breaks
    // sticky for every descendant: pinRef just scrolled off normally
    // instead of sticking, leaving a large empty gap below the scene for
    // however far you'd scrolled into the section. GSAP's pin sidesteps
    // that entirely (same mechanism already used for the hero's pin).
    const st = ScrollTrigger.create({
      trigger: outerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: pinRef.current,
      scrub: true,
      onUpdate: (self) => update(self.progress),
      onRefreshInit: () => update(0),
    });
    stRef.current = st;
    update(0);

    return () => {
      ro.disconnect();
      st.kill();
      stRef.current = null;
    };
  }, [N, totalWidth]);

  useEffect(() => {
    if (!panelRef.current) return;
    gsap.fromTo(panelRef.current, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
  }, [activeIndex]);

  const jumpTo = (i) => {
    const st = stRef.current;
    if (!st) return;
    const p = (i + 0.5) / N;
    scrollToY(st.start + p * (st.end - st.start));
  };

  const onCarPointerDown = (e) => {
    const st = stRef.current;
    if (!st) return;
    dragRef.current = { dragging: true, startX: e.clientX, startP: st.progress };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onCarPointerMove = (e) => {
    const d = dragRef.current;
    if (!d.dragging) return;
    const st = stRef.current;
    const vw = viewportWidthRef.current || 1;
    const p = clamp(d.startP + (e.clientX - d.startX) / vw, 0, 1);
    setScrollY(st.start + p * (st.end - st.start));
  };

  const onCarPointerUp = () => {
    if (!dragRef.current.dragging) return;
    dragRef.current.dragging = false;
    jumpTo(activeIndexRef.current);
  };

  const active = projects[activeIndex];

  return (
    <div ref={outerRef} style={{ height: `${N * 45}vh` }} className="relative">
      <div ref={pinRef} className="h-screen w-full overflow-hidden bg-paper">
        <div
          ref={trackRef}
          className="absolute left-0 top-1/2"
          style={{ width: totalWidth, height: SCENE_H, marginTop: -SCENE_H / 2 }}
        >
          <svg width={totalWidth} height={SCENE_H} viewBox={`0 0 ${totalWidth} ${SCENE_H}`}>
            <path d={paths.ground} fill="rgba(0,113,227,0.06)" />
            <path d={paths.road} fill="none" stroke="rgba(29,29,31,0.16)" strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
            <path
              d={paths.road}
              fill="none"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth={2}
              strokeDasharray="14 16"
              strokeLinecap="round"
            />
          </svg>

          {projects.map((project, i) => {
            const peakX = SEGMENT * (i + 0.5);
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => jumpTo(i)}
                className="absolute -translate-x-1/2 whitespace-nowrap rounded-full border border-black/10 bg-white/75 px-3 py-1.5 text-xs font-medium text-ink shadow-sm backdrop-blur-md transition hover:border-accent/40 hover:text-accent"
                style={{ left: peakX, top: SCENE_H - 40 }}
              >
                {project.title[language]}
              </button>
            );
          })}
        </div>

        <div
          className="pointer-events-none absolute left-0 top-1/2 w-full"
          style={{ height: SCENE_H, marginTop: -SCENE_H / 2 }}
        >
          <div
            ref={carOuterRef}
            className="pointer-events-auto absolute left-0 top-0 cursor-grab touch-none active:cursor-grabbing"
            style={{ width: CAR_W, height: CAR_H }}
            onPointerDown={onCarPointerDown}
            onPointerMove={onCarPointerMove}
            onPointerUp={onCarPointerUp}
            onPointerLeave={onCarPointerUp}
          >
            <CarIcon innerRef={carInnerRef} width={CAR_W} height={CAR_H} />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setListOpen(true)}
          className="absolute left-1/2 top-6 z-20 -translate-x-1/2 rounded-full border border-black/10 bg-white/80 px-5 py-2.5 text-sm font-medium text-ink shadow-md backdrop-blur-xl transition hover:border-black/25 md:top-8"
        >
          {language === 'tr' ? 'Hepsini Listele' : 'View All'}
        </button>

        <div
          ref={panelRef}
          className="absolute left-6 top-24 max-w-xs cursor-pointer rounded-[24px] border border-black/10 bg-white/75 p-5 shadow-lg backdrop-blur-xl md:left-10 md:top-28"
          onClick={() => onSelect(active)}
        >
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.12em] text-accent">
            {active.category[language]}
          </p>
          <h3 className="mt-1 font-sans text-lg font-semibold text-ink">{active.title[language]}</h3>
          <span className="mt-3 inline-block text-sm font-medium text-accent">
            {language === 'tr' ? 'İncele' : 'View'} <span aria-hidden="true">&gt;</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => scrollToHash('#education', { duration: 2.2 })}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-black/10 bg-white/80 px-5 py-2.5 text-sm font-medium text-ink shadow-md backdrop-blur-xl transition hover:border-black/25"
        >
          {language === 'tr' ? 'Geç' : 'Skip'} <span aria-hidden="true">&gt;&gt;</span>
        </button>

        {listOpen && (
          <div
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/30 backdrop-blur-sm"
            onClick={() => setListOpen(false)}
          >
            <div
              className="max-h-[70vh] w-full max-w-sm overflow-y-auto rounded-[24px] border border-black/10 bg-white/95 p-3 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {projects.map((project, i) => (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => {
                    setListOpen(false);
                    onSelect(project);
                  }}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition hover:bg-black/[0.04]"
                >
                  <span>
                    <span className="block text-[0.65rem] font-medium uppercase tracking-[0.1em] text-accent">
                      {project.category[language]}
                    </span>
                    <span className="mt-0.5 block text-sm font-medium text-ink">{project.title[language]}</span>
                  </span>
                  <span className={`h-2 w-2 shrink-0 rounded-full ${i === activeIndex ? 'bg-accent' : 'bg-black/15'}`} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
