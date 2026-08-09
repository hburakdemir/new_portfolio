import { useRef } from 'react';
import gsap from 'gsap';
import { useLanguage } from '../contexts/LanguageContext';
import useGsapContext from '../hooks/useGsapContext';
import SkillsMarquee from '../components/SkillsMarquee';

const stats = [
  { value: '1-2', label: { tr: 'Yıl Deneyim', en: 'Years Experience' } },
  { value: '15+', label: { tr: 'Tamamlanan Proje', en: 'Shipped Projects' } },
  { value: '10+', label: { tr: 'Teknoloji', en: 'Technologies' } },
  { value: 'Ankara', label: { tr: 'Konum', en: 'Location' } },
];

const eyebrow = { tr: 'Hakkımda', en: 'About' };
const skillsEyebrow = { tr: 'Teknoloji & Yetenekler', en: 'Technology & Skills' };
const skillsHeading = { tr: 'Kullandığım Araçlar', en: 'Tools I Use' };

const AboutPage = () => {
  const { t, language } = useLanguage();
  const sectionRef = useRef(null);

  useGsapContext(sectionRef, () => {
    gsap.from('.about-reveal', {
      y: 24,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', once: true },
    });
  }, []);

  return (
    <section id="about" ref={sectionRef} className="section-light px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-5xl">
        <p className="about-reveal text-sm font-medium text-muted">{eyebrow[language]}</p>
        <h2 className="about-reveal mt-3 max-w-2xl font-sans text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-5xl">
          {t('about.title')}
        </h2>
        <div className="about-reveal mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-ink/70">
          <p>{t('about.text1')}</p>
          <p>{t('about.text2')}</p>
          <p>{t('about.text3')}</p>
        </div>

        <div className="about-reveal mt-20 grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label.en}>
              <div className="font-sans text-5xl font-bold tracking-[-0.02em] text-ink md:text-6xl">{stat.value}</div>
              <div className="mt-2 text-sm text-muted">{stat.label[language]}</div>
            </div>
          ))}
        </div>

        <div id="skills" className="about-reveal mt-24 border-t border-black/10 pt-16">
          <p className="text-sm font-medium text-muted">{skillsEyebrow[language]}</p>
          <h3 className="mt-3 font-sans text-2xl font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-3xl">
            {skillsHeading[language]}
          </h3>
          <div className="mt-10">
            <SkillsMarquee />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
