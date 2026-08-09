import { useRef } from 'react';
import gsap from 'gsap';
import portfolioProjects from '../data/projectData';
import { useLanguage } from '../contexts/LanguageContext';
import useGsapContext from '../hooks/useGsapContext';
import useReducedMotion from '../hooks/useReducedMotion';
import useMediaQuery from '../hooks/useMediaQuery';
import RoadJourney from '../components/RoadJourney';

const eyebrow = { tr: 'Projeler', en: 'Projects' };
const heading = { tr: 'Seçili Çalışmalar', en: 'Selected Work' };

const PortfolioPage = ({ setSelectedProject }) => {
  const { language } = useLanguage();
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const showRoad = isDesktop && !reducedMotion;

  useGsapContext(sectionRef, () => {
    if (showRoad) return;

    gsap.utils.toArray('.bento-card').forEach((card, i) => {
      gsap.from(card, {
        y: 24,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        delay: (i % 4) * 0.05,
        scrollTrigger: { trigger: card, start: 'top 85%', once: true },
      });
    });

    const pointerFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!pointerFine) return;

    gsap.utils.toArray('.bento-card').forEach((card) => {
      const rotY = gsap.quickTo(card, 'rotationY', { duration: 0.4, ease: 'power3' });
      const rotX = gsap.quickTo(card, 'rotationX', { duration: 0.4, ease: 'power3' });
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        rotY((((e.clientX - r.left) / r.width) - 0.5) * 6);
        rotX((((e.clientY - r.top) / r.height) - 0.5) * -6);
      });
      card.addEventListener('mouseleave', () => {
        rotY(0);
        rotX(0);
      });
    });
  }, [showRoad]);

  const onGridMouseMove = (e) => {
    const card = e.target.closest('.spot-card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <section id="projects" ref={sectionRef} className="section-light">
      <div className={showRoad ? '' : 'px-6 py-28 md:px-10 md:py-36'}>
        <div className={showRoad ? 'mx-auto max-w-6xl px-6 pt-28 md:px-10 md:pt-36' : 'mx-auto max-w-6xl'}>
          <p className="text-sm font-medium text-muted">{eyebrow[language]}</p>
          <h2 className="mt-3 font-sans text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-5xl">
            {heading[language]}
          </h2>
        </div>

        {showRoad ? (
          <RoadJourney projects={portfolioProjects} language={language} onSelect={setSelectedProject} />
        ) : (
          <div className="mx-auto max-w-6xl">
            <div
              onMouseMove={onGridMouseMove}
              className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 md:gap-6"
              style={{ perspective: '1000px' }}
            >
              {portfolioProjects.map((project) => (
                <button
                  type="button"
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="bento-card spot-card group relative aspect-square overflow-hidden rounded-[28px] border border-black/[0.06] bg-white text-left shadow-[0_20px_50px_-25px_rgba(0,0,0,0.25)] transition-all hover:border-black/20 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)]"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <img
                    src={project.image}
                    alt={project.title[language]}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 border-t border-white/40 bg-white/70 p-5 backdrop-blur-xl">
                    <p className="text-[0.65rem] font-medium uppercase tracking-[0.12em] text-accent">
                      {project.category[language]}
                    </p>
                    <h3 className="mt-1 font-sans text-base font-semibold text-ink md:text-lg">
                      {project.title[language]}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioPage;
