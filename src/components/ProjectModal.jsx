import React, { useEffect, useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const ProjectModal = ({ selectedProject, setSelectedProject }) => {
  const { language } = useLanguage();
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  useEffect(() => {
    setIsImageZoomed(false);
  }, [selectedProject]);

  if (!selectedProject) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[32px] border border-black/10 bg-white/95 p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
        <div className="mb-6 flex items-start justify-between">
          <h2 className="font-sans text-2xl font-bold text-ink">
            {selectedProject.title[language]}
          </h2>
          <button
            onClick={() => setSelectedProject(null)}
            className="rounded-full border border-black/10 p-2 transition-colors hover:border-black/25"
          >
            <X className="h-6 w-6 text-ink" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsImageZoomed(true)}
          className="group relative mb-6 block w-full cursor-zoom-in"
          aria-label={language === "tr" ? "Görseli büyüt" : "Enlarge image"}
        >
          <img
            src={selectedProject.image}
            alt={selectedProject.title[language]}
            className="h-64 w-full rounded-2xl object-cover"
          />
          <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
            <ZoomIn className="h-8 w-8 text-white drop-shadow" />
          </span>
        </button>

        {isImageZoomed && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4"
            onClick={() => setIsImageZoomed(false)}
          >
            <button
              onClick={() => setIsImageZoomed(false)}
              className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label={language === "tr" ? "Kapat" : "Close"}
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={selectedProject.image}
              alt={selectedProject.title[language]}
              className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        <div className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-accent">
            {selectedProject.category[language]}
          </p>
          <p className="whitespace-pre-line leading-relaxed text-ink/70">
            {selectedProject.description[language]}
          </p>
          {selectedProject.link && (
            <p className="text-sm">
              <a
                href={`https://${selectedProject.link.replace(/^https?:\/\//, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline transition-colors hover:text-accent-dark"
              >
                {selectedProject.link.replace(/^https?:\/\//, '')}
              </a>
            </p>
          )}

          <div className="space-y-2">
            <h3 className="text-xs font-medium uppercase tracking-[0.1em] text-muted">
              {language === "tr" ? "Kullanılan Teknolojiler:" : "Technologies Used:"}
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedProject.tech.map((tech, index) => (
                <span
                  key={index}
                  className="rounded-full bg-accent/10 px-3 py-1 text-sm text-accent"
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
