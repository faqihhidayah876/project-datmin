import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useSpring, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Activity,
  Layers,
  Brain,
  ArrowRight,
  Shield,
  LayoutDashboard,
  Database,
  Server,
  Monitor,
  Cloud,
  FileAudio,
  TrendingUp,
  BarChart3,
  PieChart,
  Clock,
  Zap,
  ChevronRight,
  Star,
  Sparkles,
  Waves,
  Cpu,
  Target,
  Award
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import GlassCard from '../components/common/GlassCard';
import FatigueEducation from '../components/common/FatigueEducation';
import { LOGO_URL } from '../utils/constants';
import { useAudioAnalysis } from '../hooks/useAudioAnalysis';
import { useApp } from '../context/AppContext';

// ============================================
// NEW COMPONENTS
// ============================================

// 1. MARQUEE / TICKER
const Marquee = () => {
  const items = [
    { text: 'CNN + YAMNet', color: 'text-primary-light' },
    { text: 'Explainable AI', color: 'text-secondary-light' },
    { text: 'Audio Classification', color: 'text-accent' },
    { text: 'Deep Learning', color: 'text-accent-2' },
    { text: 'Fatigue Detection', color: 'text-primary-light' },
    { text: 'Spectrogram Analysis', color: 'text-secondary-light' },
    { text: 'Real-time Processing', color: 'text-accent' },
    { text: 'Hugging Face Backend', color: 'text-accent-2' },
    { text: 'Transfer Learning', color: 'text-secondary-light' },
    { text: 'MFCC Features', color: 'text-accent' },
    { text: 'Mel Spectrogram', color: 'text-accent-2' },
  ];

  const allItems = [...items, ...items, ...items, ...items];

  return (
    <div className="w-full overflow-hidden py-4 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-y border-glass-border backdrop-blur-sm relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bg-dark to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bg-dark to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: [0, -50 * items.length * 4] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 40,
            ease: 'linear',
          },
        }}
      >
        {allItems.map((item, index) => (
          <div key={index} className="flex items-center mx-6">
            <Star className="w-3 h-3 text-white/10 mr-4" />
            <span className={`text-sm font-space font-bold ${item.color} tracking-widest uppercase`}>
              {item.text}
            </span>
            <Star className="w-3 h-3 text-white/10 ml-4" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// 2. TYPEWRITER EFFECT
const TypeWriter = ({ texts, typingSpeed = 80, deletingSpeed = 40, pauseTime = 2500 }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const text = texts[currentTextIndex];

    if (isPaused) {
      const timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseTime);
      return () => clearTimeout(timeout);
    }

    if (isDeleting) {
      if (currentText === '') {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      } else {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, deletingSpeed);
        return () => clearTimeout(timeout);
      }
    } else {
      if (currentText === text) {
        setIsPaused(true);
      } else {
        const timeout = setTimeout(() => {
          setCurrentText(text.slice(0, currentText.length + 1));
        }, typingSpeed);
        return () => clearTimeout(timeout);
      }
    }
  }, [currentText, isDeleting, isPaused, currentTextIndex, texts, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className="inline-flex items-center justify-center">
      <span className="gradient-text-purple">{currentText}</span>
      <motion.span
        className="inline-block w-[3px] h-[1em] bg-primary-light ml-1"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      />
    </span>
  );
};

// 3. SCROLL PROGRESS BAR
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent z-[100] origin-left"
      style={{ scaleX }}
    />
  );
};

// 4. ANIMATED STATS COUNTER
const StatsCounter = ({ end, duration = 2, suffix = '', prefix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

// 5. BENTO GRID
const BentoGrid = () => {
  const { t } = useApp();
  
  const items = [
    {
      title: 'CNN Architecture',
      description: 'Deep Neural Network with YAMNet Transfer Learning',
      icon: <Cpu className="w-6 h-6" />,
      colSpan: 'md:col-span-2',
      gradient: 'from-primary/20 to-secondary/10',
      height: 'h-48',
    },
    {
      title: 'Real-time',
      description: 'Instant Analysis',
      icon: <Zap className="w-5 h-5" />,
      colSpan: 'md:col-span-1',
      gradient: 'from-accent/20 to-primary/10',
      height: 'h-48',
    },
    {
      title: '3 Classes',
      description: 'Low · Medium · High',
      icon: <Target className="w-5 h-5" />,
      colSpan: 'md:col-span-1',
      gradient: 'from-secondary/20 to-accent/10',
      height: 'h-48',
    },
    {
      title: 'XAI Powered',
      description: 'LIME & SHAP Explanations for Transparent AI Decisions',
      icon: <Sparkles className="w-6 h-6" />,
      colSpan: 'md:col-span-2',
      gradient: 'from-accent-2/20 to-primary/10',
      height: 'h-48',
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-space text-3xl md:text-4xl font-bold mb-4 gradient-text-purple">
          System Highlights
        </h2>
        <p className="text-white/40 max-w-lg mx-auto">
          Cutting-edge technology stack powering the fatigue detection system
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            className={`${item.colSpan} ${item.height}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <div className={`h-full glass-card group overflow-hidden relative`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary-light group-hover:scale-110 transition-transform duration-500">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-space text-lg font-bold text-white group-hover:text-primary-light transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/50 mt-1">{item.description}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// ============================================
// MAIN HOMEPAGE COMPONENT
// ============================================

const HomePage = () => {
  const { t } = useApp();
  const { history } = useAudioAnalysis();
  const [stats, setStats] = useState({
    totalAnalyzed: 0,
    lowCount: 0,
    mediumCount: 0,
    highCount: 0,
    avgConfidence: 0,
  });

  useEffect(() => {
    if (history.length > 0) {
      const low = history.filter(h => h.predictedClass === 'low').length;
      const medium = history.filter(h => h.predictedClass === 'medium').length;
      const high = history.filter(h => h.predictedClass === 'high').length;
      const avgConf = history.reduce((sum, h) => sum + h.confidence, 0) / history.length;
      setStats({
        totalAnalyzed: history.length,
        lowCount: low,
        mediumCount: medium,
        highCount: high,
        avgConfidence: avgConf,
      });
    }
  }, [history]);

  const features = [
    {
      icon: <Brain className="w-7 h-7" />,
      title: t('feature_ai_title'),
      description: t('feature_ai_desc'),
    },
    {
      icon: <Activity className="w-7 h-7" />,
      title: t('feature_realtime_title'),
      description: t('feature_realtime_desc'),
    },
    {
      icon: <Layers className="w-7 h-7" />,
      title: t('feature_xai_title'),
      description: t('feature_xai_desc'),
    },
  ];

  const trendData = history.length > 0
    ? history.slice(0, 10).map((h, i) => ({
        name: `#${i + 1}`,
        confidence: h.confidence,
      })).reverse()
    : [
        { name: '#1', confidence: 75.2 },
        { name: '#2', confidence: 82.1 },
        { name: '#3', confidence: 91.5 },
        { name: '#4', confidence: 78.3 },
        { name: '#5', confidence: 85.7 },
      ];

  const pieData = [
    { name: t('stat_low'), value: stats.lowCount || 1, color: '#00D4AA' },
    { name: t('health_medium_title').split(' ').slice(0, 2).join(' '), value: stats.mediumCount || 1, color: '#FFB347' },
    { name: t('stat_high'), value: stats.highCount || 1, color: '#FF6B9D' },
  ];

  const classData = [
    { name: t('low'), count: stats.lowCount || 0, fill: '#00D4AA' },
    { name: t('medium'), count: stats.mediumCount || 0, fill: '#FFB347' },
    { name: t('high'), count: stats.highCount || 0, fill: '#FF6B9D' },
  ];

  const flowchartSteps = [
    {
      id: 1,
      title: t('flow_dataset'),
      subtitle: t('flow_dataset_sub'),
      icon: <Database className="w-6 h-6" />,
      details: [
        t('flow_detail_collect'),
        t('flow_detail_understand'),
        t('flow_detail_preprocess'),
        t('flow_detail_extract'),
      ],
      color: '#7C3AED',
    },
    {
      id: 2,
      title: t('flow_dl'),
      subtitle: t('flow_dl_sub'),
      icon: <Brain className="w-6 h-6" />,
      details: [
        t('flow_detail_yamnet'),
        t('flow_detail_arch'),
        t('flow_detail_train'),
        t('flow_detail_hyper'),
      ],
      color: '#8B5CF6',
    },
    {
      id: 3,
      title: t('flow_backend'),
      subtitle: t('flow_backend_sub'),
      icon: <Server className="w-6 h-6" />,
      details: [
        t('flow_detail_flask'),
        t('flow_detail_integrate'),
        t('flow_detail_pipeline'),
        t('flow_detail_error'),
      ],
      color: '#EC4899',
    },
    {
      id: 4,
      title: t('flow_frontend'),
      subtitle: t('flow_frontend_sub'),
      icon: <Monitor className="w-6 h-6" />,
      details: [
        t('flow_detail_dashboard'),
        t('flow_detail_upload'),
        t('flow_detail_viz'),
        t('flow_detail_ui'),
      ],
      color: '#F59E0B',
    },
    {
      id: 5,
      title: t('flow_deploy'),
      subtitle: t('flow_deploy_sub'),
      icon: <Cloud className="w-6 h-6" />,
      details: [
        t('flow_detail_hf'),
        t('flow_detail_cicd'),
        t('flow_detail_monitor'),
        t('flow_detail_scale'),
      ],
      color: '#10B981',
    },
  ];

  return (
    <div className="pt-20 pb-12 relative">
      {/* Background Effects - hanya ScrollProgress */}
      <ScrollProgress />

      {/* Hero Section */}
      <section className="text-center py-24 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 mb-8"
        >
          <div className="w-28 h-28 mx-auto mb-8 rounded-2xl overflow-hidden ring-4 ring-primary/30 glow-purple relative">
            <img src={LOGO_URL} alt="Explainable AI Logo" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary-light mb-8 backdrop-blur-sm"
        >
          {t('badge_cnn')}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="font-space text-5xl md:text-7xl font-bold mb-4 leading-tight"
        >
          <span className="gradient-text-purple text-glow">{t('hero_title')}</span>
        </motion.h1>

        {/* TYPEWRITER EFFECT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-space text-3xl md:text-5xl font-bold mb-8 h-16"
        >
          <TypeWriter
            texts={[
              'Fatigue Detection',
              'Audio Classification',
              'Machine Learning',
              'XAI Visualization',
            ]}
            typingSpeed={100}
            deletingSpeed={50}
            pauseTime={2000}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          {t('hero_desc')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/predict" className="btn-primary inline-flex items-center gap-2 text-lg px-10">
            {t('btn_start_analysis')} <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/about" className="px-8 py-4 rounded-2xl border border-glass-border text-white/70 hover:text-white hover:border-primary-light/50 transition-all duration-300 group">
            {t('btn_learn_more')} <ChevronRight className="w-4 h-4 inline-block group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* MARQUEE - Dipindah ke bawah tombol */}
        <div className="mt-12 relative z-10 max-w-5xl mx-auto">
          <Marquee />
        </div>
      </section>

      {/* Stats Section with Animated Counters */}
      <section className="max-w-4xl mx-auto px-6 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {[
            { value: 73.85, suffix: '%', label: t('stat_accuracy'), color: 'text-secondary', icon: <Zap className="w-4 h-4" /> },
            { value: 3, suffix: '', label: t('stat_classes'), color: 'text-accent-2', icon: <Layers className="w-4 h-4" /> },
            { value: 100, suffix: '+', label: 'Audio Features', color: 'text-primary-light', icon: <Waves className="w-4 h-4" /> },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center px-8 py-5 rounded-2xl bg-glass border border-glass-border hover:border-primary/30 transition-all duration-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className={`inline-flex items-center gap-2 text-sm ${stat.color} mb-1`}>
                {stat.icon}
                <span>{stat.label}</span>
              </div>
              <div className={`font-space text-3xl md:text-4xl font-bold ${stat.color}`}>
                {stat.value === 73.85 ? (
                  <StatsCounter end={73} duration={2} suffix=".85%" />
                ) : stat.value === 100 ? (
                  <StatsCounter end={100} duration={2} suffix="+" />
                ) : (
                  <StatsCounter end={stat.value} duration={2} suffix={stat.suffix} />
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Bento Grid Showcase */}
      <BentoGrid />

      {/* Key Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-space text-3xl md:text-4xl font-bold mb-4 gradient-text-purple">{t('features_title')}</h2>
          <p className="text-white/40 max-w-lg mx-auto">{t('feature_xai_desc')}</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <GlassCard className="h-full group">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-500">
                  {feature.icon}
                </div>
                <h3 className="font-space text-xl font-semibold mb-3 group-hover:text-primary-light transition-colors">
                  {feature.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FATIGUE EDUCATION SECTION ===== */}
      <FatigueEducation />

      {/* DASHBOARD STATS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="font-space text-3xl font-bold mb-2 flex items-center gap-3">
            <LayoutDashboard className="w-7 h-7 text-primary-light" />
            {t('stat_overview')}
          </h2>
          <p className="text-white/40 text-sm">{t('stat_realtime')}</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: t('stat_total'),
              value: stats.totalAnalyzed,
              icon: <FileAudio className="w-5 h-5" />,
              color: 'text-primary-light',
              bg: 'bg-primary/10',
            },
            {
              label: t('stat_avg_conf'),
              value: `${stats.avgConfidence.toFixed(1)}%`,
              icon: <Activity className="w-5 h-5" />,
              color: 'text-secondary-light',
              bg: 'bg-secondary/10',
            },
            {
              label: t('stat_low'),
              value: stats.lowCount,
              icon: <TrendingUp className="w-5 h-5" />,
              color: 'text-green-400',
              bg: 'bg-green-500/10',
            },
            {
              label: t('stat_high'),
              value: stats.highCount,
              icon: <TrendingUp className="w-5 h-5 rotate-180" />,
              color: 'text-accent',
              bg: 'bg-accent/10',
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <span className={stat.color}>{stat.icon}</span>
                  </div>
                  <span className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</span>
                </div>
                <div className="font-space text-3xl font-bold text-white">
                  {typeof stat.value === 'number' ? (
                    <StatsCounter end={stat.value} duration={1.5} />
                  ) : (
                    stat.value
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="font-space text-lg font-semibold mb-4 text-white/80">{t('confidence_trend')}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a2e',
                      border: '1px solid rgba(124,58,237,0.3)',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="confidence"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ fill: '#8B5CF6', r: 4 }}
                    activeDot={{ r: 6, fill: '#A78BFA' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
          <GlassCard>
            <h3 className="font-space text-lg font-semibold mb-4 text-white/80">{t('class_distribution')}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a2e',
                      border: '1px solid rgba(124,58,237,0.3)',
                      borderRadius: '12px',
                      color: '#fff'
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-white/60 text-xs">{value}</span>}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
        <GlassCard className="mt-6">
          <h3 className="font-space text-lg font-semibold mb-4 text-white/80">{t('pred_count')}</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid rgba(124,58,237,0.3)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {classData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </section>

      {/* FLOWCHART */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="font-space text-3xl font-bold mb-2 flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-primary-light" />
            {t('sys_flow')}
          </h2>
          <p className="text-white/40 text-sm">{t('sys_flow_sub')}</p>
        </motion.div>
        <div className="relative">
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent z-0" />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative z-10">
            {flowchartSteps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <GlassCard className="h-full group hover:border-primary/40 transition-all duration-500 relative">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white mb-3"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.id}
                  </div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${step.color}30` }}
                  >
                    <span style={{ color: step.color }}>{step.icon}</span>
                  </div>
                  <h3 className="font-space text-sm font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-xs text-white/40 mb-3">{step.subtitle}</p>
                  <ul className="space-y-1.5">
                    {step.details.map((detail, j) => (
                      <li key={j} className="text-xs text-white/50 flex items-start gap-1.5">
                        <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: step.color }} />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative p-12 rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent border border-primary/20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%237C3AED%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
          <div className="relative z-10 text-center">
            <Shield className="w-12 h-12 text-primary-light mx-auto mb-4" />
            <h2 className="font-space text-3xl font-bold mb-4">{t('cta_ready')}</h2>
            <p className="text-white/50 mb-8 max-w-md mx-auto">
              {t('cta_ready_desc')}
            </p>
            <Link to="/predict" className="btn-primary inline-flex items-center gap-2">
              {t('cta_button_start')} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;