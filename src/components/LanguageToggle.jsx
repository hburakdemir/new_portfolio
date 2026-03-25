import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="
        fixed top-4 right-4 z-50
        flex items-center space-x-2
        px-3 py-2 sm:px-4 sm:py-2
        bg-gray-800/70 backdrop-blur-md
        rounded-full border border-yellow-400/20
        hover:bg-yellow-500/20 transition-all
        shadow-lg hover:shadow-yellow-500/20
      "
      title={language === 'tr' ? 'Switch to English' : 'Türkçe\'ye geç'}
    >
      <span className="text-base sm:text-lg">
        {language === 'tr' ? '🇹🇷' : '🇺🇸'}
      </span>
      <span className="text-white text-xs sm:text-sm font-medium tracking-wide">
        {language === 'tr' ? 'TR' : 'EN'}
      </span>
    </button>
  );
};

export default LanguageToggle;
