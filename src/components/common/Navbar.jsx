import { Link, useLocation } from 'react-router-dom';
import { Brain, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { LOGO_URL } from '../../utils/constants';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/predict', label: 'Classification' },
    { path: '/about', label: 'About' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-3 bg-bg-dark/80 backdrop-blur-2xl border-b border-glass-border">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 font-space font-bold text-xl group">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-primary/50 group-hover:ring-primary-light transition-all duration-500">
            <img 
              src={LOGO_URL} 
              alt="Explainable AI Logo" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden absolute inset-0 bg-gradient-to-br from-primary to-secondary items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="gradient-text-purple text-glow">Explainable AI</span>
        </Link>

        {/* Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-primary-light font-medium">
            HF Connected
          </span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`relative text-sm font-medium transition-all duration-300 px-3 py-2 rounded-lg ${
                  location.pathname === link.path
                    ? 'text-white bg-primary/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-light rounded-full" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-bg-dark/95 backdrop-blur-2xl border-b border-glass-border p-4">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`flex items-center gap-2 py-3 px-4 rounded-xl transition-all ${
                    location.pathname === link.path
                      ? 'text-white bg-primary/20 border border-primary/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;