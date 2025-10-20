import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
// import education from "../data/educationData";

const EducationPage = () => {
  const { language } = useLanguage();

  const education = {
  
    degree: { tr: "Bachelor's Degree - Computer and Educational Technologies Education", en: "Computer Engineering" },
    school: { tr: "Hacettepe University", en: "Technical University" },
    period: "09/2020-03/2025",
    grade: "2.7/4.0"
  

  
  };

  return (
    <div className="space-y-6 animate-fadeIn">
       <h2 className="text-3xl font-bold text-white mb-6 ">{language === "tr" ? "Eğitim" : "Education"}
    </h2>

        <div
          className="bg-gray-800/30 rounded-2xl p-6 border border-yellow-400/20 hover:bg-gray-700/30 transition-colors"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">

            <h3 className="text-xl font-bold text-white">
              {education.degree[language]}
            </h3>
            <span className="text-yellow-400 font-medium">{education.period}</span>
          </div>
          <p className="text-gray-300 mb-2">{education.school[language]}</p>
          {education.grade && (
            <p className="text-gray-400 text-sm">GPA: {education.grade}</p>
          )}
          {education.certificate && (
            <p className="text-yellow-400 text-sm font-medium">
              {education.certificate[language]}
            </p>
          )}
        </div>

    </div>
  );
};

export default EducationPage;
