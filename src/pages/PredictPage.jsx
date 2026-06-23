import React, { useState, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic,
  PieChart,      
  Eye, 
  Code, 
  CheckCircle2,
  AlertCircle,
  Trash2,
  Download,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAudioAnalysis } from '../hooks/useAudioAnalysis';
import { isConfigValid } from '../utils/constants';
import UploadZone from '../components/upload/UploadZone';
import AudioPreview from '../components/upload/AudioPreview';
import LoadingSpinner from '../components/common/LoadingSpinner';
import GlassCard from '../components/common/GlassCard';
import FatigueGauge from '../components/results/FatigueGauge';
import ClassificationBadge from '../components/results/ClassificationBadge';
import ProbabilityChart from '../components/results/ProbabilityChart';
import FeatureImportance from '../components/results/FeatureImportance';

// Lazy load Spectrogram dengan fallback
const SpectrogramDisplay = React.lazy(() => 
  import('../components/results/SpectrogramDisplay')
);

// Fallback component jika Spectrogram gagal load
const SpectrogramFallback = () => (
  <div className="h-60 flex flex-col items-center justify-center bg-black/20 rounded-xl border border-glass-border">
    <motion.div
      className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
    <span className="mt-3 text-sm text-white/50">Loading spectrogram...</span>
  </div>
);

const PredictPage = () => {
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const { results, history, loading, error, connected, progress, analyzeAudio, checkApiConnection, clearHistory } = useAudioAnalysis();

  const handleFileSelect = useCallback((selectedFile) => {
    setFile(selectedFile);
    setAudioUrl(URL.createObjectURL(selectedFile));
  }, []);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
  }, [audioUrl]);

  const handleAnalyze = async () => {
    if (!file) return;
    try {
      await analyzeAudio(file);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all analysis history?')) {
      clearHistory();
    }
  };

  const handleExportResults = () => {
    if (!results) return;
    const dataStr = JSON.stringify(results.raw, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fatigue-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
      {/* API Not Configured Warning */}
      {!isConfigValid() && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-xl"
        >
          <div className="flex items-center gap-3 text-accent">
            <AlertCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">API Not Configured</p>
              <p className="text-sm text-white/70">
                Please{' '}
                <Link to="/configure" className="underline hover:text-white">
                  configure your backend API
                </Link>{' '}
                first before analyzing audio.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Connection Status */}
      <div className="flex justify-end mb-4">
        <button
          onClick={checkApiConnection}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs border ${
            connected === null
              ? 'bg-white/5 border-white/10 text-white/50'
              : connected
              ? 'bg-secondary/15 border-secondary/30 text-secondary'
              : 'bg-accent/15 border-accent/30 text-accent'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-secondary animate-pulse' : connected === false ? 'bg-accent' : 'bg-white/50'}`} />
          {connected === null ? 'Checking...' : connected ? 'Connected' : 'Offline - Check Backend'}
        </button>
      </div>

      {/* Upload Section */}
      <section className="mb-8">
        <GlassCard>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-space text-2xl font-semibold">Upload Audio</h2>
              <p className="text-white/50 text-sm">Upload audio file for emotional fatigue analysis</p>
            </div>
          </div>

          {!file ? (
            <UploadZone onFileSelect={handleFileSelect} />
          ) : (
            <>
              <AudioPreview file={file} audioUrl={audioUrl} onRemove={handleRemoveFile} />
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleAnalyze}
                disabled={loading}
                className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Analyze Fatigue'}
              </motion.button>
            </>
          )}
        </GlassCard>
      </section>

      {/* Loading with Progress */}
      <AnimatePresence>
        {loading && (
          <LoadingSpinner 
            text="Analyzing Audio"
            subtext="Processing audio features and generating prediction"
            progress={progress}
          />
        )}
      </AnimatePresence>

      {/* Results Section */}
      <AnimatePresence>
        {results && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-space text-2xl font-semibold">Analysis Results</h2>
                  <p className="text-white/50 text-sm">Emotional fatigue classification results</p>
                </div>
              </div>
              <button
                onClick={handleExportResults}
                className="flex items-center gap-2 px-4 py-2 bg-glass border border-glass-border rounded-xl text-sm text-white/70 hover:text-white hover:border-primary transition-colors"
              >
                <Download className="w-4 h-4" />
                Export JSON
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Fatigue Level Card */}
              <GlassCard className="relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent to-orange-400 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Emotional Fatigue Level</h3>
                    <span className="text-xs text-white/50">Fatigue Classification</span>
                  </div>
                </div>

                <FatigueGauge
                  score={results.gaugeScore}
                  predictedClass={results.predictedClass}
                  confidence={results.confidence}
                />
                <ClassificationBadge
                  predictedClass={results.predictedClass}
                  confidence={results.confidence}
                />
              </GlassCard>

              {/* Probability Card */}
              <GlassCard className="relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-cyan-400" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary to-cyan-400 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Probability per Class</h3>
                    <span className="text-xs text-white/50">Probability Distribution</span>
                  </div>
                </div>
                <ProbabilityChart probabilities={results.probabilities} />
              </GlassCard>

              {/* Spectrogram Card */}
              <GlassCard className="md:col-span-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-light" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Audio Spectrogram</h3>
                    <span className="text-xs text-white/50">Frequency-Time Analysis</span>
                  </div>
                </div>

                <Suspense fallback={<SpectrogramFallback />}>
                  <SpectrogramDisplay audioUrl={audioUrl} />
                </Suspense>

                <FeatureImportance featureValues={results.features} />
              </GlassCard>
            </div>

            {/* Raw Response */}
            <GlassCard className="mt-6">
              <div className="flex items-center gap-2 mb-4 text-sm text-white/50">
                <Code className="w-4 h-4" />
                API Response (JSON)
              </div>
              <div className="bg-black/30 rounded-xl p-4 overflow-x-auto">
                <pre className="text-xs text-white/60 font-mono whitespace-pre-wrap">
                  {JSON.stringify(results.raw, null, 2)}
                </pre>
              </div>
            </GlassCard>
          </motion.section>
        )}
      </AnimatePresence>

      {/* History Section */}
      {history.length > 0 && (
        <section className="mt-8">
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-space text-2xl font-semibold">Analysis History</h2>
                  <p className="text-white/50 text-sm">Previous audio analysis results</p>
                </div>
              </div>
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-xl text-sm text-accent hover:bg-accent/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-glass-border">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Time</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-white/50 uppercase tracking-wider">File</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Prediction</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-white/50 uppercase tracking-wider">Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="border-b border-glass-border/50 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-sm text-white/70">
                        {new Date(item.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-white/70">{item.fileName}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          item.predictedClass === 'low'
                            ? 'bg-secondary/15 text-secondary'
                            : item.predictedClass === 'medium'
                            ? 'bg-accent-2/15 text-accent-2'
                            : 'bg-accent/15 text-accent'
                        }`}>
                          {item.predictedClass.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-white/70">{item.confidence.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </section>
      )}

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-xl text-accent text-sm"
        >
          <strong>Error:</strong> {error}
          <p className="mt-2 text-white/50">
            Please ensure:
            <br />1. Backend is running (Ngrok or Hugging Face)
            <br />2. API URL in Configure page is correct
            <br />3. CORS is enabled on the backend
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PredictPage;