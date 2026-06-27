import { Github, BookOpen, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LOGO_URL } from '../../utils/constants';

// Hugging Face Icon Component
const HuggingFaceIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
    <circle cx="9" cy="10" r="1.5"/>
    <circle cx="15" cy="10" r="1.5"/>
    <path d="M12 16c-2.21 0-4-1.34-4-3h1.5c0 1.1 1.12 2 2.5 2s2.5-.9 2.5-2H16c0 1.66-1.79 3-4 3z"/>
  </svg>
);

const Footer = () => {
  const { t } = useApp();

  return (
    <footer className="mt-16 py-8 border-t border-glass-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden ring-1 ring-primary/30">
              <img src={LOGO_URL} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-white/70 text-sm font-space font-semibold">Explainable AI</p>
              <p className="text-white/40 text-xs">{t('footer_desc')}</p>
            </div>
          </div>

          <div className="flex justify-center gap-6 flex-wrap">
            <a 
              href="https://github.com/faqihhidayah876/project-datmin.git" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/40 hover:text-primary-light transition-colors flex items-center gap-2 text-sm"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a 
              href="https://huggingface.co/spaces/qeehh/fatigue-audio-classifier" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/40 hover:text-primary-light transition-colors flex items-center gap-2 text-sm"
            >
              <HuggingFaceIcon className="w-4 h-4" /> Hugging Face
            </a>
            <a href="#" className="text-white/40 hover:text-primary-light transition-colors flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4" /> Documentation
            </a>
            <a href="#" className="text-white/40 hover:text-primary-light transition-colors flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4" /> Contact
            </a>
          </div>

          <p className="text-white/30 text-xs">
            &copy; 2026 Explainable AI. {t('footer_rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;