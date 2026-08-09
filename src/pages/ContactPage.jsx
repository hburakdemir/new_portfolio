import { Mail, Github, Linkedin, Download } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getResumeLink } from '../lib/resume';

const eyebrow = { tr: 'İletişim', en: 'Contact' };
const heading = { tr: 'Birlikte Çalışalım', en: "Let's Build Something" };
const sub = {
  tr: 'Yeni bir proje, iş fırsatı ya da sadece merhaba demek için bana ulaşabilirsin.',
  en: 'Reach out for a new project, an opportunity, or just to say hi.',
};
const cvLabel = { tr: 'CV İndir', en: 'Download CV' };

const email = 'burakd279@gmail.com';

const ContactPage = () => {
  const { language } = useLanguage();

  return (
    <section id="contact" className="section-light px-6 py-32 text-center md:px-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium text-muted">{eyebrow[language]}</p>
        <h2 className="mt-3 font-sans text-4xl font-bold leading-[1.1] tracking-[-0.02em] text-ink md:text-6xl">
          {heading[language]}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-ink/60">{sub[language]}</p>

        <a
          href={`mailto:${email}`}
          className="mt-10 flex items-center justify-center gap-3 break-all font-sans text-2xl font-semibold text-ink transition-colors hover:text-accent md:text-4xl"
        >
          <Mail className="h-7 w-7 shrink-0 text-accent" />
          {email}
        </a>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://github.com/hburakdemir"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-black/10 px-5 py-2.5 text-ink/70 transition hover:border-black/25 hover:text-ink"
          >
            <Github className="h-4 w-4" /> GitHub
          </a>
          <a
            href="https://linkedin.com/in/hburakdmr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-black/10 px-5 py-2.5 text-ink/70 transition hover:border-black/25 hover:text-ink"
          >
            <Linkedin className="h-4 w-4" /> LinkedIn
          </a>
          <a
            href={getResumeLink(language)}
            download
            className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent-dark"
          >
            <Download className="h-4 w-4" /> {cvLabel[language]}
          </a>
        </div>

        <footer className="mt-24 border-t border-black/10 pt-8 text-xs text-muted">
          © {new Date().getFullYear()} Hakan Burak Demir
        </footer>
      </div>
    </section>
  );
};

export default ContactPage;
