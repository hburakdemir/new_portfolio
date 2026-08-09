import { useRef } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../contexts/LanguageContext';
import useGsapContext from '../hooks/useGsapContext';

const eyebrow = { tr: 'Eğitim', en: 'Education' };
const heading = { tr: 'Eğitim Geçmişim', en: 'Education' };

const EducationPage = () => {
  const { language } = useLanguage();
  const sectionRef = useRef(null);

  const education = {
    degree: {
      tr: 'Lisans Derecesi - Bilgisayar ve Öğretim Teknolojileri Eğitimi',
      en: "Bachelor's Degree - Computer and Educational Technologies Education",
    },
    school: { tr: 'Hacettepe Üniversitesi', en: 'Hacettepe University' },
    period: '09/2020 – 03/2025',
    grade: '2.7/4.0',
  };

  useGsapContext(sectionRef, () => {
    gsap.from('.education-card', {
      y: 24,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
    });
  }, []);

  return (
    <section id="education" ref={sectionRef} className="section-light px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-medium text-muted">{eyebrow[language]}</p>
        <h2 className="mt-3 font-sans text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-5xl">
          {heading[language]}
        </h2>

        <div className="education-card mt-10 flex gap-5 rounded-[28px] border border-black/[0.06] bg-white p-7 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.25)] md:p-9">
          <img
            src="/images/hacettepe-logo.svg"
            alt="Hacettepe Üniversitesi"
            className="h-14 w-14 shrink-0 object-contain md:h-16 md:w-16"
          />
          <div className="min-w-0">
            <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
              <h3 className="font-sans text-lg font-semibold text-ink md:text-xl">{education.degree[language]}</h3>
              <span className="text-xs font-medium text-muted">{education.period}</span>
            </div>
            <p className="mt-2 text-sm text-accent">{education.school[language]}</p>
            {education.grade && <p className="mt-3 text-sm text-muted">GPA: {education.grade}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationPage;
