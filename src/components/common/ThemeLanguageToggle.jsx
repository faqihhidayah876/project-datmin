import { useApp } from '../../context/AppContext';
import { Sun, Moon, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeLanguageToggle = () => {
  const { language, theme, toggleLanguage, toggleTheme, t } = useApp();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleTheme}
        className="relative p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
        title={theme === 'dark' ? t('theme_light') : t('theme_dark')}
      >
        <motion.div
          initial={false}
          animate={{ rotate: theme === 'dark' ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-primary-light" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </motion.div>
      </button>

      <button
        onClick={toggleLanguage}
        className="relative px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-medium text-white/70 hover:text-white flex items-center gap-1.5"
        title={language === 'en' ? 'Switch to Bahasa Indonesia' : 'Switch to English'}
      >
        <Globe className="w-3.5 h-3.5" />
        <span className="uppercase">{language}</span>
      </button>
    </div>
  );
};

export default ThemeLanguageToggle;