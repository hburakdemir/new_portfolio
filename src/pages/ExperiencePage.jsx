import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import experiences from '../data/experiencesData';
import { useLanguage } from '../contexts/LanguageContext';

const ExperienceSection = ({ currentExperience, setCurrentExperience }) => {
  const { language } = useLanguage();
  
  const nextExperience = () => {
    setCurrentExperience((prev) => (prev + 1) % experiences.length);
  };
  
  const prevExperience = () => {
    setCurrentExperience((prev) => (prev - 1 + experiences.length) % experiences.length);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">
        {language === 'tr' ? 'Deneyimler' : 'Experience'}
      </h2>
     
      <div className="relative">
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentExperience * 100}%)`,
            }}
          >
            {experiences.map((exp, index) => (
              <div
                key={index}
                className="w-full flex-shrink-0 px-2 md:px-4"
              >
                <div className="bg-gradient-to-br from-yellow-400/10 to-gray-700/20 backdrop-blur rounded-xl md:rounded-2xl p-4 md:p-6 border border-yellow-400/30 shadow-xl h-64 md:h-80 flex flex-col justify-center">
                  <div className="text-center space-y-3 md:space-y-4">
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      {exp.title[language]}
                    </h3>
                    <p className="text-yellow-400 font-medium text-sm md:text-base">
                      {exp.company[language]}
                    </p>
                    <p className="text-gray-400 text-xs md:text-sm">
                      {exp.period[language]}
                    </p>
                    <p className="text-gray-300 text-xs md:text-sm leading-relaxed line-clamp-6">
                      {exp.description[language]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={prevExperience}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-gray-700/80 backdrop-blur rounded-full hover:bg-yellow-500 hover:text-gray-900 transition-all duration-300 z-10"
        >
          <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-white" />
        </button>
        
        <button
          onClick={nextExperience}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-gray-700/80 backdrop-blur rounded-full hover:bg-yellow-500 hover:text-gray-900 transition-all duration-300 z-10"
        >
          <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-white" />
        </button>
      </div>

      <div className="flex justify-center space-x-2 pt-4">
        {experiences.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentExperience(index)}
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
              currentExperience === index 
                ? 'bg-yellow-400 scale-125' 
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>
     
      <style jsx>{`
        .line-clamp-6 {
          display: -webkit-box;
          -webkit-line-clamp: 6;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ExperienceSection;