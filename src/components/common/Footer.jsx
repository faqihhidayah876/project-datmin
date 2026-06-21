import { Github, BookOpen, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-16 py-8 border-t border-glass-border">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-white/50 text-sm">
          Explainable AI &copy; 2026 | Emotional Fatigue Classification System
        </p>
        <div className="flex justify-center gap-8 mt-4">
          <a href="#" className="text-white/50 hover:text-primary-light transition-colors flex items-center gap-2 text-sm">
            <Github className="w-4 h-4" /> GitHub
          </a>
          <a href="#" className="text-white/50 hover:text-primary-light transition-colors flex items-center gap-2 text-sm">
            <BookOpen className="w-4 h-4" /> Documentation
          </a>
          <a href="#" className="text-white/50 hover:text-primary-light transition-colors flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4" /> Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;