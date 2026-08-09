import React, { useEffect, useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Navigation from './components/Navigation';
import HeroPage from './pages/HeroPage';
import AboutPage from './pages/AboutPage';
import ExperiencePage from './pages/ExperiencePage';
import PortfolioPage from './pages/PortfolioPage';
import EducationPage from './pages/EducationPage';
import ContactPage from './pages/ContactPage';
import ProjectModal from './components/ProjectModal';
import CursorTrail from './components/CursorTrail';
import useReducedMotion from './hooks/useReducedMotion';
import { createLenis } from './lib/scroll';

const PortfolioWebsite = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const destroy = createLenis({ reducedMotion });
    return () => destroy?.();
  }, [reducedMotion]);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-paper">
        <Navigation />

        <main>
          <HeroPage />
          <AboutPage />
          <ExperiencePage />
          <PortfolioPage setSelectedProject={setSelectedProject} />
          <EducationPage />
          <ContactPage />
        </main>

        <ProjectModal selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
        <CursorTrail />
      </div>
    </LanguageProvider>
  );
};

export default PortfolioWebsite;
