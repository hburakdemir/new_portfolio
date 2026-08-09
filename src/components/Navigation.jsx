import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { scrollToHash } from '../lib/scroll';
import LanguageToggle from './LanguageToggle';

const links = [
  { id: 'about', label: { tr: 'Hakkımda', en: 'About' } },
  { id: 'skills', label: { tr: 'Yetenekler', en: 'Skills' } },
  { id: 'experience', label: { tr: 'Deneyim', en: 'Experience' } },
  { id: 'projects', label: { tr: 'Projeler', en: 'Projects' } },
  { id: 'education', label: { tr: 'Eğitim', en: 'Education' } },
  { id: 'contact', label: { tr: 'İletişim', en: 'Contact' } },
];

const Navigation = () => {
  const { language } = useLanguage();
  const [active, setActive] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('main [id]'));
    if (!sections.length) return undefined;

    // Link highlight: whichever section crosses the vertical mid-band —
    // standard scrollspy behavior.
    const activeIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((s) => activeIo.observe(s));
    return () => activeIo.disconnect();
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    scrollToHash(`#${id}`);
    setMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-paper/75 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <a href="#hero" onClick={go('hero')} className="font-sans text-lg font-semibold tracking-tight text-ink">
          HBD<span className="text-accent">.</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={go(link.id)}
              className={`rounded-full px-3.5 py-2 text-sm transition-colors ${
                active === link.id ? 'text-ink' : 'text-ink/60 hover:text-ink'
              }`}
            >
              {link.label[language]}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <LanguageToggle isLight />
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded-full border border-black/15 p-2 text-ink transition-colors md:hidden"
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-black/10 bg-paper/95 px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={go(link.id)}
                className={`rounded-lg px-3 py-2.5 text-sm ${active === link.id ? 'text-ink' : 'text-ink/60'}`}
              >
                {link.label[language]}
              </a>
            ))}
          </nav>
          <div className="mt-4">
            <LanguageToggle isLight />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navigation;
