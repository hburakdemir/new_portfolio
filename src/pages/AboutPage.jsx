import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6 animate-fadeIn">
      <h2 className="text-3xl font-bold text-white mb-6">{t('about.title')}</h2>
      <div className="text-gray-300 space-y-4 leading-relaxed">
        <p>{t('about.text1')}</p>
        <p>{t('about.text2')}</p>
        <p>{t('about.text3')}</p>
      </div>
    </div>
  );
};

export default AboutPage;