import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, Layers, Brain, ArrowRight } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';

const HomePage = () => {
  const stats = [
    { value: '83.72%', label: 'Model Accuracy', color: 'text-secondary' },
    { value: '3', label: 'Classification Variables', color: 'text-accent-2' },
    { value: 'CNN', label: 'Deep Learning', color: 'text-accent' },
  ];

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI-Powered Analysis',
      description: 'Utilizes YAMNet transfer learning combined with custom acoustic features for precise fatigue detection.',
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: 'Real-time Processing',
      description: 'Get instant results with our optimized deep learning pipeline running on Hugging Face Spaces.',
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: 'XAI Visualization',
      description: 'Understand model decisions through spectrograms and feature importance visualizations.',
    },
  ];

  return (
    <div className="pt-24 pb-12">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-glass border border-glass-border rounded-full text-sm text-secondary mb-6"
        >
          <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
          CNN-based Emotional Fatigue Classification System
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-space text-5xl md:text-6xl font-bold mb-6 gradient-text"
        >
          Emotional Fatigue Detection<br />from Voice
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-white/70 max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Advanced classification system to detect human emotional fatigue levels 
          through audio analysis using Deep Learning based on CNN architecture.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/predict" className="btn-primary inline-flex items-center gap-2">
            Start Analysis <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className={`font-space text-3xl md:text-4xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-space text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            >
              <GlassCard className="h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-space text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;