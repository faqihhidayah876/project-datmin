import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  Clock
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
import { LOGO_URL } from '../utils/constants';
import { useAudioAnalysis } from '../hooks/useAudioAnalysis';

// Flowchart steps
const flowchartSteps = [
  {
    id: 1,
    title: 'Dataset Engineering',
    subtitle: 'Data Collection & Preprocessing',
    icon: <Database className="w-6 h-6" />,
    details: [
      'Collect Audio Dataset from Responden',
      'Data Understanding & EDA',
      'Data Preprocessing',
      'Feature Extraction (MFCC, Spectrogram)'
    ],
    color: '#7C3AED',
  },
  {
    id: 2,
    title: 'Deep Learning Model',
    subtitle: 'CNN + Transfer Learning',
    icon: <Brain className="w-6 h-6" />,
    details: [
      'YAMNet Feature Extraction',
      'CNN Architecture Design',
      'Model Training & Validation',
      'Hyperparameter Tuning'
    ],
    color: '#8B5CF6',
  },
  {
    id: 3,
    title: 'Backend System',
    subtitle: 'API & Model Serving',
    icon: <Server className="w-6 h-6" />,
    details: [
      'Flask REST API Development',
      'Model Integration & Inference',
      'Audio Processing Pipeline',
      'Error Handling & Logging'
    ],
    color: '#EC4899',
  },
  {
    id: 4,
    title: 'Frontend System',
    subtitle: 'React Dashboard',
    icon: <Monitor className="w-6 h-6" />,
    details: [
      'Interactive Dashboard Design',
      'Audio Upload & Recording',
      'Real-time Visualization',
      'Responsive UI/UX'
    ],
    color: '#F59E0B',
  },
  {
    id: 5,
    title: 'Deployment',
    subtitle: 'Cloud Production',
    icon: <Cloud className="w-6 h-6" />,
    details: [
      'Hugging Face Spaces Deployment',
      'CI/CD Pipeline',
      'Performance Monitoring',
      'Scalability Testing'
    ],
    color: '#10B981',
  },
];

const HomePage = () => {
  const { history } = useAudioAnalysis();
  const [stats, setStats] = useState({
    totalAnalyzed: 0,
    lowCount: 0,
    mediumCount: 0,
    highCount: 0,
    avgConfidence: 0,
  });

  // Calculate stats from history
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

  // Mock data for trend chart
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

  // Pie chart data
  const pieData = [
    { name: 'Low Fatigue', value: stats.lowCount || 1, color: '#00D4AA' },
    { name: 'Medium Fatigue', value: stats.mediumCount || 1, color: '#FFB347' },
    { name: 'High Fatigue', value: stats.highCount || 1, color: '#FF6B9D' },
  ];

  // Class distribution bar data
  const classData = [
    { name: 'Low', count: stats.lowCount || 0, fill: '#00D4AA' },
    { name: 'Medium', count: stats.mediumCount || 0, fill: '#FFB347' },
    { name: 'High', count: stats.highCount || 0, fill: '#FF6B9D' },
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
      </section>

      {/* Key Features Section */}
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

      {/* DASHBOARD STATS - Total Data Analyzed & Prediction Summary */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="font-space text-3xl font-bold mb-2 flex items-center gap-3">
            <LayoutDashboard className="w-7 h-7 text-primary-light" />
            Statistic Overview
          </h2>
          <p className="text-white/40 text-sm">Real-time statistic and prediction summary</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { 
              label: 'Total Analyzed', 
              value: stats.totalAnalyzed, 
              icon: <FileAudio className="w-5 h-5" />,
              color: 'text-primary-light',
              bg: 'bg-primary/10',
            },
            { 
              label: 'Avg Confidence', 
              value: `${stats.avgConfidence.toFixed(1)}%`, 
              icon: <Activity className="w-5 h-5" />,
              color: 'text-secondary-light',
              bg: 'bg-secondary/10',
            },
            { 
              label: 'Low Fatigue', 
              value: stats.lowCount, 
              icon: <TrendingUp className="w-5 h-5" />,
              color: 'text-green-400',
              bg: 'bg-green-500/10',
            },
            { 
              label: 'High Fatigue', 
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
                <div className="font-space text-3xl font-bold text-white">{stat.value}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Prediction Summary Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <GlassCard>
            <h3 className="font-space text-lg font-semibold mb-4 text-white/80">Confidence Trend</h3>
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
            <h3 className="font-space text-lg font-semibold mb-4 text-white/80">Class Distribution</h3>
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
          <h3 className="font-space text-lg font-semibold mb-4 text-white/80">Prediction Count by Class</h3>
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

      {/* FLOWCHART / DIAGRAM ALUR */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="font-space text-3xl font-bold mb-2 flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-primary-light" />
            System Architecture Flow
          </h2>
          <p className="text-white/40 text-sm">End-to-end pipeline from dataset to deployment</p>
        </motion.div>

        <div className="relative">
          {/* Connecting Line - Desktop only */}
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
                  {/* Step Number */}
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white mb-3"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.id}
                  </div>
                  
                  {/* Icon */}
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${step.color}30` }}
                  >
                    <span style={{ color: step.color }}>{step.icon}</span>
                  </div>

                  <h3 className="font-space text-sm font-bold text-white mb-1">{step.title}</h3>
                  <p className="text-xs text-white/40 mb-3">{step.subtitle}</p>

                  {/* Details */}
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