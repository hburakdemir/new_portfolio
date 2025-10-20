import React from 'react';
import { User, Briefcase, GraduationCap, FolderOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Navigation = ({ activeSection, setActiveSection }) => {
  const {language} = useLanguage();

  const navigationItems = [
    { key: 'about', label: {tr:'Hakkımda',en:'About'}, icon: User },
    { key: 'experience',  label: {tr: 'Deneyim', en: 'Experience'}, icon: Briefcase },
    { key: 'education', label: {tr: 'Eğitim', en: 'Education'}, icon: GraduationCap },
    { key: 'portfolio',  label: {tr: 'Portfolyo', en: 'Portfolio'}, icon: FolderOpen }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.key;
        return (
          <button
            key={item.key}
            onClick={() => setActiveSection(item.key)}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              isActive
                ? 'bg-yellow-500 text-gray-900 shadow-lg font-semibold'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4 mr-2" />
            {item.label[language]}
          </button>
        );
      })}
    </div>
  );
};

export default Navigation;