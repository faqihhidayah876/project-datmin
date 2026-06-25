import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, Layers, Brain, ArrowRight, Shield } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import { LOGO_URL } from '../utils/constants';

const HomePage = () => {
  const stats = [
    { value: '83.72%', label: 'Model Accuracy' },
    { value: '3', label: 'Fatigue Classes' },
    { value: 'CNN', label: 'Deep Learning' },
  ];

  const features = [
    {
      icon: <Brain className="w-7 h-7" />,
      title: 'AI-Powered Analysis',
      description: 'Utilizes YAMNet transfer learning combined with custom acoustic features for precise fatigue detection.',
    },
    {
      icon: <Activity className="w-7 h-7" />,
      title: 'Real-time Processing',
      description: 'Get instant results with our optimized deep learning pipeline running on Hugging Face Spaces.',
    },
    {
      icon: <Layers className="w-7 h-7" />,
      title: 'XAI Visualization',
      description: 'Understand model decisions through spectrograms and feature importance visualizations.',
    },
  ];

  return (
    <div className="pt-20 pb-12">
      {/* Hero Section */}
      <section className="text-center py-20 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-20 w-64 h-64 bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 mb-8"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl overflow-hidden ring-4 ring-primary/30 glow-purple">
            <img src={LOGO_URL} alt="Explainable AI Logo" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary-light mb-8 backdrop-blur-sm"
        >
          CNN-based Emotional Fatigue Classification System
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="font-space text-5xl md:text-7xl font-bold mb-6 leading-tight"
        >
          <span className="gradient-text-purple text-glow">Explainable AI</span>
          <br />
          <span className="text-white/90">Fatigue Detection</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Advanced classification system to detect human emotional fatigue levels 
          through audio analysis using Deep Learning based on CNN architecture with 
          explainable AI transparency.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/predict" className="btn-primary inline-flex items-center gap-2 text-lg px-10">
            Start Analysis <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/about" className="px-8 py-4 rounded-2xl border border-glass-border text-white/70 hover:text-white hover:border-primary-light/50 transition-all duration-300">
            Learn More
          </Link>
        </motion.div>

        {/* Stats - Tanpa ikon */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16 mt-20"
        >
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label} 
              className="text-center p-6 rounded-2xl bg-glass border border-glass-border hover:border-primary/30 transition-all duration-500"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="font-space text-4xl md:text-5xl font-bold text-primary-light mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-white/50">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section - Card tanpa garis warna atas */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-space text-3xl md:text-4xl font-bold mb-4 gradient-text-purple">Key Features</h2>
          <p className="text-white/40 max-w-lg mx-auto">Powered by cutting-edge deep learning technology</p>
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
            <h2 className="font-space text-3xl font-bold mb-4">Ready to Analyze?</h2>
            <p className="text-white/50 mb-8 max-w-md mx-auto">
              Upload your audio or record your voice to get instant fatigue classification results.
            </p>
            <Link to="/predict" className="btn-primary inline-flex items-center gap-2">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;