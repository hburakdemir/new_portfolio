import React, { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Navigation from './components/Navigation';
import AboutSection from './pages/AboutPage';
import ExperiencePage from './pages/ExperiencePage';
import EducationPage from './pages/EducationPage';
import PortfolioPage from './pages/PortfolioPage';
import SkillsPage from './pages/SkillsPage';
import ProfileSidebar from './components/ProfileSidebar';
import ProjectModal from './components/ProjectModal';
import LanguageToggle from './components/LanguageToggle';

const PortfolioWebsite = () => {
  const [activeSection, setActiveSection] = useState('about');
  const [currentExperience, setCurrentExperience] = useState(0);
  const [portfolioPage, setPortfolioPage] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const sectionsMap = {
  about: AboutSection,
  experience: ExperiencePage,
  education: EducationPage,
  portfolio: PortfolioPage,
};

  const renderActiveSection = () => {
  const Component = sectionsMap[activeSection] || AboutSection;

  // Eğer component props alıyorsa koşula göre geç
  if (activeSection === 'experience') {
    return (
      <Component
        currentExperience={currentExperience}
        setCurrentExperience={setCurrentExperience}
      />
    );
  } else if (activeSection === 'portfolio') {
    return (
      <Component
        portfolioPage={portfolioPage}
        setPortfolioPage={setPortfolioPage}
        setSelectedProject={setSelectedProject}
      />
    );
  } else {
    return <Component />;
  }
};

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-900 p-5 md:px-10 md:py-5">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Language Toggle - Fixed Position */}
          <div className="fixed top-6 right-6 z-40">
            <LanguageToggle />
          </div>

          {/* Main Content Area */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content Section */}
            <div className="flex-1 order-2 lg:order-1">
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 h-full border border-yellow-400/20 shadow-2xl">
                <Navigation
                  activeSection={activeSection}
                  setActiveSection={setActiveSection}
                />
               
                <div className="h-full">
                  {renderActiveSection()}
                </div>
              </div>
            </div>

            {/* Profile Sidebar */}
            <ProfileSidebar />
          </div>

          {/* Skills Section - Full width below main content */}
          <SkillsPage />
        </div>

        {/* Project Modal */}
        <ProjectModal
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
        />

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-in-out;
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </LanguageProvider>
  );
};

export default PortfolioWebsite;