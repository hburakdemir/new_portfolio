import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import experiences from '../data/experiencesData';
import { useLanguage } from '../contexts/LanguageContext';
import useGsapContext from '../hooks/useGsapContext';
import useReducedMotion from '../hooks/useReducedMotion';

const eyebrow = { tr: 'Deneyim', en: 'Experience' };
const heading = { tr: 'İş Deneyimlerim', en: 'Where I’ve Worked' };

const N = experiences.length;
const SEGMENT = 360 / N;
const wrap = (i) => ((i % N) + N) % N;

const MAX_FACE_WIDTH = 340;
const FACE_ASPECT = 380 / 340;
const VIEWPORT_MARGIN = 96; // room either side for the peeking neighbor faces, not just the front one

// Fixed pixel sizing (translateZ needs real px, not %) — but the fixed
// 340px face used to simply overflow anything narrower than that (most
// phones), clipping or forcing page-level horizontal scroll. Recomputed on
// resize so the cube always fits, peeking neighbors included.
function useFaceSize() {
  const getWidth = () =>
    typeof window === 'undefined'
      ? MAX_FACE_WIDTH
      : Math.max(220, Math.min(MAX_FACE_WIDTH, window.innerWidth - VIEWPORT_MARGIN));

  const [width, setWidth] = useState(getWidth);

  useEffect(() => {
    const onResize = () => setWidth(getWidth());
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return { width, height: Math.round(width * FACE_ASPECT) };
}

function Face({ exp, language }) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-sans text-lg font-semibold text-ink">{exp.title[language]}</h3>
        <span className="text-xs font-medium text-muted">{exp.period}</span>
      </div>
      <p className="mt-1 text-sm text-accent">{exp.company[language]}</p>
      <p className="mt-4 line-clamp-5 whitespace-pre-line text-sm leading-relaxed text-ink/60">
        {exp.description[language]}
      </p>
    </>
  );
}

const ExperiencePage = () => {
  const { language } = useLanguage();
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const [frontIndex, setFrontIndex] = useState(0);
  const { width: FACE_WIDTH, height: FACE_HEIGHT } = useFaceSize();
  // One physical face per experience (no content recycling needed) — at
  // N=6, 60° apart, neighbors sit at a real angle rather than edge-on, so
  // they stay a little visible at rest instead of vanishing, per request.
  // The 1.2x multiplier pushes faces past the exact edge-to-edge hexagon
  // radius, opening a visible gap between the front face and its peeking
  // neighbors. Recomputed from the responsive FACE_WIDTH on every resize.
  const RADIUS = Math.round((FACE_WIDTH / 2 / Math.tan(Math.PI / N)) * 1.2);

  // The stage angle accumulates freely (never reset) since each face is a
  // permanent, individually-addressable element — turning is just moving to
  // the next multiple of SEGMENT.
  const angleRef = useRef(0);
  const animatingRef = useRef(false);
  const dragRef = useRef({ dragging: false, startX: 0, startAngle: 0, moved: false });
  const faceRefs = useRef([]);

  // Per-face brightness by its *effective* angle to the camera (own offset +
  // however far the stage has turned) — without this every face looked
  // equally bright regardless of rotation, reading as flat fanned-out cards
  // instead of a lit, rotating solid. Runs on every drag/settle tick, not
  // just on stop, so the shading turns smoothly with the cube.
  const updateShading = () => {
    const current = gsap.getProperty(stageRef.current, 'rotateY') || 0;
    faceRefs.current.forEach((el, i) => {
      if (!el) return;
      const angleRad = ((i * SEGMENT + current) * Math.PI) / 180;
      const facing = Math.cos(angleRad); // 1 = facing camera, -1 = facing away
      const brightness = 0.6 + 0.4 * Math.max(0, facing);
      el.style.filter = `brightness(${brightness})`;
    });
  };

  useEffect(() => {
    updateShading();
  }, []);

  useGsapContext(sectionRef, () => {
    gsap.from('.exp-heading', {
      y: 24,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
    });
  }, []);

  // Guarded by animatingRef so rapid clicks/drags can't start a second tween
  // on top of one still in flight — that was the source of the "yazılar
  // ortaya tekte geliyor" glitch (two competing rotateY tweens fighting over
  // the same element, leaving the stage stuck at an unsettled in-between
  // angle where several faces are partially, messily visible at once).
  const settleTo = (targetAngle, duration) => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    gsap.to(stageRef.current, {
      rotateY: targetAngle,
      duration,
      ease: 'power2.inOut',
      onUpdate: updateShading,
      onComplete() {
        angleRef.current = targetAngle;
        setFrontIndex(wrap(Math.round(-targetAngle / SEGMENT)));
        animatingRef.current = false;
      },
    });
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
    updateShading();
  };

  const onPointerUp = () => {
    const d = dragRef.current;
    if (!d.dragging) return;
    d.dragging = false;
    if (!d.moved) return;

    const current = gsap.getProperty(stageRef.current, 'rotateY');
    const nearest = Math.round(current / SEGMENT) * SEGMENT;
    settleTo(nearest, reducedMotion ? 0.001 : 0.35);
  };

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="section-light flex min-h-screen flex-col justify-center overflow-x-hidden px-6 py-20 md:px-10"
    >
      <div className="exp-heading mx-auto w-full max-w-5xl text-center md:text-left">
        <p className="text-sm font-medium text-muted">{eyebrow[language]}</p>
        <h2 className="mt-3 font-sans text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-5xl">
          {heading[language]}
        </h2>
      </div>

      <div className="mx-auto mt-14 w-full max-w-5xl select-none px-4 sm:px-10 md:px-16">
        <div
          className="relative mx-auto touch-pan-y"
          style={{ width: FACE_WIDTH, height: FACE_HEIGHT, perspective: '1400px' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <div
            ref={stageRef}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {experiences.map((exp, i) => (
              <div
                key={`${exp.company.en}-${i}`}
                ref={(el) => {
                  faceRefs.current[i] = el;
                }}
                className="absolute inset-0 flex flex-col justify-center overflow-hidden rounded-[28px] border border-black/[0.06] bg-white/90 bg-[radial-gradient(120%_120%_at_10%_0%,rgba(0,113,227,0.10),transparent_55%),radial-gradient(120%_120%_at_100%_100%,rgba(41,151,255,0.08),transparent_55%)] p-7 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.25)] backdrop-blur-2xl"
                style={{
                  transform: `rotateY(${i * SEGMENT}deg) translateZ(${RADIUS}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                <Face exp={exp} language={language} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 flex w-full max-w-5xl items-center justify-center gap-8">
        <button
          type="button"
          onClick={() => turn(-1)}
          className="rounded-full border border-black/10 bg-white p-3 text-ink/60 shadow-md transition hover:border-black/20 hover:text-ink"
          aria-label="Previous"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          {experiences.map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${i === frontIndex ? 'bg-accent' : 'bg-black/15'}`}
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
    </section>
  );
};

export default ExperiencePage;
