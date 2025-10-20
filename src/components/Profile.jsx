import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin,Download } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Profile = () => {
  const { language } = useLanguage();

  const profile = {
    name: 'Hakan Burak DEMİR',
    title: {
      tr: "Jr. Full Stack Geliştirici",
      en: "Jr. Full Stack Developer",
    },
    email: "burakd279@gmail.com",
  };

    const resumeLink = language === 'tr'
      ? '/assets/HakanBurakDemir_cv.pdf' 
      : '/assets/HakanBurakDemir_cvEn.pdf';

  return (
    <div className="w-full lg:w-80 order-1 lg:order-2 flex-shrink-0">
      <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-6 h-full border border-yellow-400/20 shadow-2xl">
        
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 p-1">
            <img 
              src="../../public/images/ben2.jpg"
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            {profile.name}
          </h1>
          <p className="text-yellow-400 font-medium">
            {profile.title[language]}
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center text-gray-300 hover:text-white transition-colors">
            <Mail className="w-5 h-5 mr-3 text-yellow-400" />
            <span className="text-sm">{profile.email}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center space-y-6 mt-6">
      <div className="flex space-x-4">
        <a
          href="https://github.com/hburakdemir"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-gray-700/50 rounded-full hover:bg-yellow-500 hover:text-gray-900 transition-colors"
        >
          <Github className="w-5 h-5 text-white" />
        </a>
        <a
          href="https://linkedin.com/in/hburakdmr"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-gray-700/50 rounded-full hover:bg-yellow-500 hover:text-gray-900 transition-colors"
        >
          <Linkedin className="w-5 h-5 text-white" />
        </a>
      </div>
      <a
        href={resumeLink}
        download
        className="flex items-center space-x-2 px-5 py-2 bg-yellow-500 text-gray-900 font-semibold rounded-full shadow-md hover:shadow-yellow-400/40 hover:bg-yellow-400 transition-all"
      >
        <Download className="w-4 h-4" />
        <span>{language === 'tr' ? 'CV İndir' : 'Download Resume'}</span>
      </a>
    </div>
      </div>
    </div>
  );
};

export default Profile;
