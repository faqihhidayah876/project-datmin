import { motion } from 'framer-motion';
import { Server, Code, Layers, Brain, BookOpen, Sparkles, Github, GraduationCap, User, ExternalLink } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import { LOGO_URL } from '../utils/constants';
import { useApp } from '../context/AppContext';

const AboutPage = () => {
  const { t } = useApp();

  const developers = [
    {
      name: 'Faqih Hidayah',
      nim: '2 SI-B',
      jurusan: 'Information System',
      kampus: 'Politeknik Caltex Riau',
      photo: 'https://i.ibb.co.com/mrPVYWdT/Whats-App-Image-2026-06-20-at-21-29-58.jpg',
      role: 'Frontend, Backend, Train Model & Configuration System',
    },
    {
      name: 'Muhammad Dzakwan Syafiq',
      nim: '2 SI-B',
      jurusan: 'Information System',
      kampus: 'Politeknik Caltex Riau',
      photo: 'https://i.ibb.co.com/VhdS84F/IMG-20250601-WA0018.jpg',
      role: 'Report, Analysis & colect dataset',
    },
  ];

  const techStack = [
    { icon: <Server className="w-4 h-4" />, label: t('about_backend'), value: 'Flask + Hugging Face Spaces', color: 'text-primary-light' },
    { icon: <Code className="w-4 h-4" />, label: t('about_framework'), value: 'TensorFlow/Keras', color: 'text-secondary-light' },
    { icon: <Layers className="w-4 h-4" />, label: t('about_model'), value: 'YAMNet + MLP', color: 'text-accent' },
    { icon: <Brain className="w-4 h-4" />, label: t('about_frontend'), value: 'React.js + Tailwind CSS', color: 'text-accent-2' },
  ];

  const modelArchItems = [
    'YAMNet Embedding (1024-dim) + Acoustic Features (37-dim)',
    'Dense Layer 256 (ReLU + L2 + BatchNorm + Dropout 0.5)',
    'Dense Layer 128 (ReLU + L2 + BatchNorm + Dropout 0.4)',
    'Dense Layer 64 (ReLU + L2 + BatchNorm + Dropout 0.3)',
    'Output Softmax (3 classes: low, medium, high)',
  ];

  const audioFeatureItems = [
    'RMS Energy (Mean, Std, Max)',
    'Fundamental Frequency F0 (Mean, Std, Range)',
    'Zero Crossing Rate & Spectral Centroid',
    '13 MFCC Coefficients + Mel Spectrogram Stats',
    'Tempo, Silence Ratio, and Jitter',
  ];

  return (
    <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl overflow-hidden ring-4 ring-primary/30 glow-purple">
          <img src={LOGO_URL} alt="Explainable AI Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="font-space text-4xl md:text-5xl font-bold mb-4 gradient-text-purple text-glow">
          {t('about_title')}
        </h1>
        <p className="text-white/40">{t('about_subtitle')}</p>
      </motion.div>

      <GlassCard className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-space text-2xl font-semibold">{t('system_info')}</h2>
            <p className="text-white/40 text-sm">{t('system_info_desc')}</p>
          </div>
        </div>

        <div className="space-y-4 text-white/60 leading-relaxed">
          <p>
            <strong className="text-white">{t('about_system_name')}</strong> {t('about_system_desc')}
          </p>

          <p>
            {t('about_model_desc')}
          </p>

          <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-glass-border">
            {techStack.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                <span className={item.color}>{item.icon}</span>
                <strong className="text-white/70">{item.label}:</strong>
                <span className="text-white/50">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <GlassCard>
          <h3 className="font-space text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary-light" />
            {t('model_arch')}
          </h3>
          <ul className="space-y-3 text-sm text-white/60">
            {modelArchItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard>
          <h3 className="font-space text-xl font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-secondary-light" />
            {t('audio_features')}
          </h3>
          <ul className="space-y-3 text-sm text-white/60">
            {audioFeatureItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>

      {/* Developers Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <div className="text-center mb-8">
          <h2 className="font-space text-3xl font-bold gradient-text-purple mb-2">{t('meet_devs')}</h2>
          <p className="text-white/40 text-sm">{t('devs_subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {developers.map((dev, index) => (
            <motion.div
              key={dev.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <GlassCard className="group hover:border-primary/40 transition-all duration-500">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-32 h-32 mb-5 rounded-2xl overflow-hidden ring-2 ring-primary/30 group-hover:ring-primary-light transition-all duration-500">
                    {dev.photo ? (
                      <img 
                        src={dev.photo} 
                        alt={dev.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.querySelector('.fallback').style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`${dev.photo ? 'hidden' : 'flex'} fallback absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 items-center justify-center`}>
                      <User className="w-12 h-12 text-primary-light/50" />
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs text-primary-light font-medium mb-3">
                    <Code className="w-3 h-3" />
                    {dev.role}
                  </span>

                  <h3 className="font-space text-xl font-bold text-white mb-1 group-hover:text-primary-light transition-colors">
                    {dev.name}
                  </h3>

                  <div className="space-y-1.5 mt-3">
                    <div className="flex items-center justify-center gap-2 text-sm text-white/50">
                      <GraduationCap className="w-4 h-4 text-secondary-light" />
                      <span>{dev.nim}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-white/50">
                      <BookOpen className="w-4 h-4 text-accent" />
                      <span>{dev.jurusan}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-white/50">
                      <Sparkles className="w-4 h-4 text-accent-2" />
                      <span>{dev.kampus}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* GitHub Repository Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <GlassCard className="text-center">
          <div className="py-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <Github className="w-8 h-8 text-white" />
            </div>

            <h3 className="font-space text-2xl font-bold mb-2 gradient-text-purple">
              {t('source_code')}
            </h3>
            <p className="text-white/40 text-sm mb-6 max-w-md mx-auto">
              {t('source_desc')}
            </p>

            <a
              href="https://github.com/faqihhidayah876/project-datmin.git"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/40 group"
            >
              <Github className="w-5 h-5" />
              {t('view_github')}
              <ExternalLink className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </a>

            <p className="mt-4 text-xs text-white/30 font-mono">
              github.com/faqihhidayah876/project-datmin.git
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default AboutPage;