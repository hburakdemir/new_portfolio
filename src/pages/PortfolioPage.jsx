import { useRef } from 'react';
import gsap from 'gsap';
import portfolioProjects from '../data/projectData';
import { useLanguage } from '../contexts/LanguageContext';
import useGsapContext from '../hooks/useGsapContext';
import useReducedMotion from '../hooks/useReducedMotion';
import useMediaQuery from '../hooks/useMediaQuery';
import RoadJourney from '../components/RoadJourney';
import ProjectCarCarousel from '../components/ProjectCarCarousel';

const eyebrow = { tr: 'Projeler', en: 'Projects' };
const heading = { tr: 'Seçili Çalışmalar', en: 'Selected Work' };

const PortfolioPage = ({ setSelectedProject }) => {
  const { language } = useLanguage();
  const sectionRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const showRoad = isDesktop && !reducedMotion;

  useGsapContext(sectionRef, () => {
    gsap.from('.projects-heading', {
      y: 24,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
    });
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="section-light px-6 py-28 md:px-10 md:py-36">
      <div className="projects-heading mx-auto max-w-6xl">
        <p className="text-sm font-medium text-muted">{eyebrow[language]}</p>
        <h2 className="mt-3 font-sans text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-5xl">
          {heading[language]}
        </h2>
      </div>

      {showRoad ? (
        <div className="-mx-6 mt-14 md:-mx-10">
          <RoadJourney projects={portfolioProjects} language={language} onSelect={setSelectedProject} />
        </div>
      ) : (
        <div className="mx-auto mt-14 max-w-6xl">
          <ProjectCarCarousel projects={portfolioProjects} language={language} onSelect={setSelectedProject} />
        </div>
      )}
    </section>
  );
};

export default PortfolioPage;
