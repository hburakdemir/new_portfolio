import React, { useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import portfolioProjects from "../data/projectData";
import { useLanguage } from "../contexts/LanguageContext";

const PortfolioPage = ({
  portfolioPage,
  setPortfolioPage,
  setSelectedProject,
}) => {
  const { language } = useLanguage();
  const projectsPerPage = 3;
  const totalPages = Math.ceil(portfolioProjects.length / projectsPerPage);

  // portfolioPage'in geçerli aralıkta olduğundan emin ol
  useEffect(() => {
    if (portfolioPage >= totalPages) {
      setPortfolioPage(0);
    }
    if (portfolioPage < 0) {
      setPortfolioPage(0);
    }
  }, [portfolioPage, totalPages, setPortfolioPage]);

  // useMemo ile currentProjects'i hesapla
  const currentProjects = useMemo(() => {
    const startIndex = portfolioPage * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    return portfolioProjects.slice(startIndex, endIndex);
  }, [portfolioPage, projectsPerPage]);

  const goToNextPage = () => {
    if (portfolioPage < totalPages - 1) {
      setPortfolioPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (portfolioPage > 0) {
      setPortfolioPage((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">
        {language === "tr" ? "Portfolio" : "Portfolio"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {currentProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="bg-gray-800/30 rounded-xl md:rounded-2xl overflow-hidden border border-yellow-400/20 hover:bg-gray-700/30 transition-all cursor-pointer group"
          >
            <img
              src={project.image}
              alt={project.title[language]}
              className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform"
              loading="lazy"
            />
            <div className="p-3 md:p-4">
              <h3 className="text-base md:text-lg font-bold text-white mb-2">
                {project.title[language]}
              </h3>
              <p className="text-yellow-400 text-xs md:text-sm mb-2 md:mb-3">
                {project.category[language]}
              </p>
              <p className="text-yellow-400 text-xs md:text-sm mb-2 md:mb-3">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-yellow-300 transition-colors"
                >
                  {project.link}
                </a>
              </p>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col items-center space-y-4 mt-6 md:mt-8">
          {/* Page Info */}
          <div className="text-gray-400 text-sm">
            {language === "tr"
              ? `Sayfa ${portfolioPage + 1} / ${totalPages}`
              : `Page ${portfolioPage + 1} of ${totalPages}`}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center space-x-4">
            {/* Previous Button */}
            <button
              onClick={goToPrevPage}
              disabled={portfolioPage === 0}
              className={`p-2 rounded-lg transition-all ${
                portfolioPage === 0
                  ? "bg-gray-700/30 text-gray-500 cursor-not-allowed"
                  : "bg-gray-700/50 text-white hover:bg-yellow-500 hover:text-gray-900"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Current Page */}
            <div className="bg-yellow-400 text-gray-900 w-10 h-10 rounded-lg flex items-center justify-center font-bold">
              {portfolioPage + 1}
            </div>

            {/* Next Button */}
            <button
              onClick={goToNextPage}
              disabled={portfolioPage === totalPages - 1}
              className={`p-2 rounded-lg transition-all ${
                portfolioPage === totalPages - 1
                  ? "bg-gray-700/30 text-gray-500 cursor-not-allowed"
                  : "bg-gray-700/50 text-white hover:bg-yellow-500 hover:text-gray-900"
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
