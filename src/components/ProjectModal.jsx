import React from "react";
import { X } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const ProjectModal = ({ selectedProject, setSelectedProject }) => {
  const { language } = useLanguage();

  if (!selectedProject) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 max-w-2xl w-full border border-yellow-400/20 shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-white">
            {selectedProject.title[language]}
          </h2>
          <button
            onClick={() => setSelectedProject(null)}
            className="p-2 bg-gray-700/50 rounded-full hover:bg-yellow-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <img
          src={selectedProject.image}
          alt={selectedProject.title[language]}
          className="w-full h-64 object-cover rounded-2xl mb-6"
        />

        <div className="space-y-4">
          <p className="text-yellow-400 font-medium">
            {selectedProject.category[language]}
          </p>
          <p className="text-gray-300 leading-relaxed">
            {selectedProject.description[language]}
          </p>
        {selectedProject.link && (
  <p className="text-yellow-400 text-xs md:text-sm mb-2 md:mb-3">
    <a
      href={`https://${selectedProject.link.replace(/^https?:\/\//, '')}`} // https ekliyoruz
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:text-yellow-300 transition-colors"
    >
      {selectedProject.link.replace(/^https?:\/\//, '')} {/* sadece site adı göster */}
    </a>
  </p>
)}

          <div className="space-y-2">
            <h3 className="text-white font-medium">
              {language === "tr"
                ? "Kullanılan Teknolojiler:"
                : "Technologies Used:"}
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedProject.tech.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-yellow-500/20 text-yellow-300 text-sm rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
