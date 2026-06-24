import { Github, BookOpen, Mail } from 'lucide-react';
import { LOGO_URL } from '../../utils/constants';

const Footer = () => {
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
              <p className="text-white/40 text-xs">Emotional Fatigue Classification System</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-6">
            <a href="#" className="text-white/40 hover:text-primary-light transition-colors flex items-center gap-2 text-sm">
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a href="#" className="text-white/40 hover:text-primary-light transition-colors flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4" /> Documentation
            </a>
            <a href="#" className="text-white/40 hover:text-primary-light transition-colors flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4" /> Contact
            </a>
          </div>
          
          <p className="text-white/30 text-xs">
            &copy; 2026 Explainable AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;