import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageToggle = ({ isLight = false }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
        isLight
          ? 'border-black/15 text-ink hover:border-black/30'
          : 'border-white/15 text-white hover:border-white/30'
      }`}
      title={language === 'tr' ? 'Switch to English' : "Türkçe'ye geç"}
    >
      <span className="text-sm">{language === 'tr' ? '🇹🇷' : '🇺🇸'}</span>
      <span className="tracking-[0.08em]">{language === 'tr' ? 'TR' : 'EN'}</span>
    </button>
  );
};

export default LanguageToggle;
