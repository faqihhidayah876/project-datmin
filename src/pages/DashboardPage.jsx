import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Mic, 
  BarChart3, 
  TrendingUp, 
  Database, 
  Brain, 
  Server, 
  Monitor, 
  Cloud, 
  ArrowRight,
  Activity,
  PieChart,
  Clock,
  FileAudio
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import { LOGO_URL } from '../utils/constants';
import { useAudioAnalysis } from '../hooks/useAudioAnalysis';

// Recharts untuk trend analytics
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

// Flowchart steps
const flowchartSteps = [
  {
    id: 1,
    title: 'Dataset Engineering',
    subtitle: 'Data Collection & Preprocessing',
    icon: <Database className="w-6 h-6" />,
    details: [
      'Mengumpulkan Dataset Audio',
      'Data Understanding & EDA',
      'Data Preprocessing (Resampling, Normalization)',
      'Feature Extraction (MFCC, Spectrogram, RMS)'
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

const DashboardPage = () => {
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

  // Mock data for trend chart (gunakan real data jika ada)
  const trendData = history.length > 0 
    ? history.slice(0, 10).map((h, i) => ({
        name: `Analysis ${i + 1}`,
        confidence: h.confidence,
        class: h.predictedClass,
      })).reverse()
    : [
        { name: 'Analysis 1', confidence: 75.2, class: 'medium' },
        { name: 'Analysis 2', confidence: 82.1, class: 'low' },
        { name: 'Analysis 3', confidence: 91.5, class: 'high' },
        { name: 'Analysis 4', confidence: 78.3, class: 'medium' },
        { name: 'Analysis 5', confidence: 85.7, class: 'low' },
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
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="flex items-center gap-4 mb-2">
          <LayoutDashboard className="w-8 h-8 text-primary-light" />
          <h1 className="font-space text-3xl md:text-4xl font-bold gradient-text-purple">
            Dashboard
          </h1>
        </div>
        <p className="text-white/40 text-sm ml-12">
          Real-time monitoring and analytics for fatigue classification system
        </p>
      </motion.div>

      {/* A. DASHBOARD UTAMA - Stats Cards */}
      <section className="mb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              animate={{ opacity: 1, y: 0 }}
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
      </section>

      {/* B. FLOWCHART / DIAGRAM ALUR */}
      <section className="mb-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="font-space text-2xl font-bold mb-2 flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-primary-light" />
            System Architecture Flow
          </h2>
          <p className="text-white/40 text-sm">End-to-end pipeline from dataset to deployment</p>
        </motion.div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
            {flowchartSteps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <GlassCard className="h-full group hover:border-primary/40 transition-all duration-500">
                  {/* Step Number */}
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white mb-3"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.id}
                  </div>
                  
                  {/* Icon */}
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-white"
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

                  {/* Arrow (hidden on last item) */}
                  {i < flowchartSteps.length - 1 && (
                    <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-20">
                      <ArrowRight className="w-4 h-4 text-white/20" />
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* E. HISTORY ANALYTICS - Charts */}
      <section className="mb-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="font-space text-2xl font-bold mb-2 flex items-center gap-3">
            <PieChart className="w-6 h-6 text-primary-light" />
            History Analytics
          </h2>
          <p className="text-white/40 text-sm">Prediction trends and class distribution</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Trend Line Chart */}
          <GlassCard className="md:col-span-2">
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

          {/* Pie Chart */}
          <GlassCard>
            <h3 className="font-space text-lg font-semibold mb-4 text-white/80">Class Distribution</h3>
            <div className="h-48">
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

        {/* Bar Chart - Class Count */}
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

      {/* Quick Actions */}
      <section>
        <GlassCard>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-space text-xl font-bold text-white mb-2">Ready to Classify?</h3>
              <p className="text-white/40 text-sm">Upload audio or record your voice for instant fatigue analysis.</p>
            </div>
            <Link 
              to="/predict" 
              className="btn-primary inline-flex items-center gap-2 whitespace-nowrap"
            >
              <Mic className="w-5 h-5" />
              Start Classification
            </Link>
          </div>
        </GlassCard>
      </section>
    </div>
  );
};

export default DashboardPage;