import { useRef } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { Github, Linkedin } from 'lucide-react';
import HeroCanvas from '../components/HeroCanvas';
import useGsapContext from '../hooks/useGsapContext';
import useMediaQuery from '../hooks/useMediaQuery';
import { useLanguage } from '../contexts/LanguageContext';
import { getResumeLink } from '../lib/resume';
import { scrollToHash } from '../lib/scroll';

gsap.registerPlugin(SplitText);

const copy = {
  role: { tr: 'Full-Stack JS Geliştirici', en: 'Full-Stack JS Developer' },
  tagline: {
    tr: 'React, Node.js, MongoDB ve PostgreSQL ile uçtan uca ürünler geliştiriyor; Git ile versiyonluyor, deploy ediyorum.',
    en: 'Building end-to-end products with React, Node.js, MongoDB, and PostgreSQL — versioned with Git and deployed end to end.',
  },
  ctaContact: { tr: 'İletişime Geç', en: 'Get in Touch' },
  ctaResume: { tr: 'CV İndir', en: 'Download CV' },
};

export default function HeroPage() {
  const { language } = useLanguage();
  const sectionRef = useRef(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useGsapContext(sectionRef, () => {
    const split = new SplitText('.hero-h1-line', { type: 'words', mask: 'words', wordsClass: 'st-word' });
    const tl = gsap.timeline({
      onComplete() {
        split.revert();
      },
    });

    tl.from(split.words, { yPercent: 110, duration: 0.9, ease: 'power3.out', stagger: 0.05 }, 0)
      .from('.hero-badge', { opacity: 0, y: 10, duration: 0.5, ease: 'power2.out' }, 0.15)
      .from('.hero-sub', { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out' }, 0.35)
      .from('.hero-ctas', { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out' }, 0.5)
      .from('.hero-socials', { opacity: 0, y: 12, duration: 0.6, ease: 'power2.out' }, 0.6)
      .from('.hero-visual', { opacity: 0, duration: 1.1, ease: 'power2.out' }, 0.4);
  }, []);

  const introTop = (
    <div className="text-center md:text-left">
      <div className="hero-badge flex items-center justify-center gap-4 md:justify-start">
        <img
          src="/images/ben2.jpg"
          alt="Hakan Burak Demir"
          className="h-20 w-20 rounded-full border border-black/10 object-cover object-top md:h-24 md:w-24"
        />
        <span className="text-sm font-medium text-ink/70 md:text-base">{copy.role[language]}</span>
      </div>

      <h1 className="mt-8 font-sans text-5xl font-bold leading-[1.02] tracking-[-0.03em] text-ink sm:text-6xl md:text-7xl">
        <span className="hero-h1-line block">Hakan Burak</span>
        <span className="hero-h1-line block">Demir</span>
      </h1>

      <p className="hero-sub mx-auto mt-5 max-w-md text-lg leading-relaxed text-muted md:mx-0">
        {copy.tagline[language]}
      </p>

      <div className="hero-ctas mt-8 flex flex-wrap items-center justify-center gap-6 md:justify-start">
        <button
          type="button"
          onClick={() => scrollToHash('#contact')}
          className="rounded-full bg-accent px-7 py-3 text-base font-medium text-white transition hover:bg-accent-dark"
        >
          {copy.ctaContact[language]}
        </button>
        <a
          href={getResumeLink(language)}
          download
          className="text-base font-medium text-accent transition hover:opacity-80"
        >
          {copy.ctaResume[language]} <span aria-hidden="true">&gt;</span>
        </a>
      </div>
    </div>
  );

  const socials = (
    <div className="hero-socials flex items-center justify-center gap-5 md:justify-start">
      <a
        href="https://github.com/hburakdemir"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className="flex items-center gap-2 text-ink/60 transition hover:text-ink"
      >
        <Github className="h-5 w-5" />
        <span className="text-sm">GitHub</span>
      </a>
      <a
        href="https://linkedin.com/in/hburakdmr"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="flex items-center gap-2 text-ink/60 transition hover:text-ink"
      >
        <Linkedin className="h-5 w-5" />
        <span className="text-sm">LinkedIn</span>
      </a>
    </div>
  );

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="section-light relative flex min-h-[100svh] w-full flex-col overflow-hidden"
    >
      {isDesktop && (
        <div className="hero-visual pointer-events-none absolute inset-0">
          <HeroCanvas xOffset={1.7} />
        </div>
      )}

      {isDesktop ? (
        <div className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-stretch gap-10 px-6 pb-16 pt-32 md:grid-cols-2 md:px-10 md:pt-40">
          <div className="flex flex-col justify-between">
            {introTop}
            <div className="mt-10">{socials}</div>
          </div>
          <div aria-hidden="true" />
        </div>
      ) : (
        // Mobile: a genuine stack, not a shared background — "hbd yazısı diğer
        // yazıların arkasında ya da üstünde kalmasın": the intro content gets
        // its own space up top, the mark gets its own dedicated space below,
        // with zero overlap between the two.
        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 pb-6 pt-24">
          {introTop}
          {socials}
          <div className="hero-visual relative min-h-[220px] flex-1">
            <HeroCanvas xOffset={0} />
          </div>
        </div>
      )}
    </section>
  );
}
