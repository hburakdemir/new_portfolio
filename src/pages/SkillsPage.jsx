import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import skills from '../data/skillsData';
import { useLanguage } from '../contexts/LanguageContext';

const SkillsPage = () => {
  const { language } = useLanguage();

  // Animasyon hızı (saniye cinsinden)
  const [scrollSpeed, setScrollSpeed] = useState(30); // default 30s

  return (
    <div className="mt-6">
      <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 border border-yellow-400/20 shadow-2xl overflow-hidden">
        <h3 className="text-xl font-bold text-white text-center mb-4">
          {language === 'tr' ? 'Teknolojiler & Yetenekler' : 'Tech & Skills'}
        </h3>

        {/* Opsiyonel: Hız kontrol slider */}
        <div className="flex justify-center mb-4 space-x-2 text-white text-sm">
          <span>{language === 'tr'? 'Hız': 'Speed'}</span>
          <input
            type="range"
            min="5"
            max="100"
            value={scrollSpeed}
            onChange={(e) => setScrollSpeed(Number(e.target.value))}
            className="w-40"
          />
          <span>{scrollSpeed}s</span>
        </div>

        <div className="relative overflow-hidden">
  <div
    className="flex space-x-8 w-max"
    style={{
      animation: `scroll ${scrollSpeed}s linear infinite`
    }}
  >
    {[...skills, ...skills].map((skill, index) => (
      <div
        key={index}
        className="flex items-center space-x-3 bg-gray-800/30 px-4 py-2 rounded-full border border-yellow-400/20 whitespace-nowrap"
      >
        <Icon icon={skill.icon} className={`w-5 h-5 ${skill.color}`} />
        <span className="text-white font-medium">{skill.name}</span>
      </div>
    ))}
  </div>
</div>

       <style jsx>{`
  @keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); } /* Bu -50% yerine -100% yaparsak tam tur döner */
  }

  .flex.w-max {
    display: flex;
    width: max-content; /* İçeriğin genişliği kadar container */
  }
`}</style>
      </div>
    </div>
  );
};

export default SkillsPage;
