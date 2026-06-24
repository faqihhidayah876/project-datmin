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
  BarChart3,
  UploadCloud,
  Radio,
  Loader2,
  Sparkles
} from 'lucide-react';
import { useAudioAnalysis } from '../hooks/useAudioAnalysis';
import UploadZone from '../components/upload/UploadZone';
import AudioPreview from '../components/upload/AudioPreview';
import VoiceRecorder from '../components/upload/VoiceRecorder';
import LoadingSpinner from '../components/common/LoadingSpinner';
import GlassCard from '../components/common/GlassCard';
import FatigueGauge from '../components/results/FatigueGauge';
import ClassificationBadge from '../components/results/ClassificationBadge';
import ProbabilityChart from '../components/results/ProbabilityChart';
import FeatureImportance from '../components/results/FeatureImportance';
import { LOGO_URL } from '../utils/constants';

const SpectrogramDisplay = React.lazy(() => 
  import('../components/results/SpectrogramDisplay')
);

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
  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [localError, setLocalError] = useState(null);

  const { results, history, loading, error, connected, progress, analyzeAudio, checkApiConnection, clearHistory } = useAudioAnalysis();

  const displayError = localError || error;

  const handleFileSelect = useCallback((selectedFile, duration) => {
    console.log('File selected:', selectedFile?.name, 'Duration:', duration);
    setFile(selectedFile);
    setAudioUrl(URL.createObjectURL(selectedFile));
    setLocalError(null);
  }, []);

  const handleRecordingComplete = useCallback((recordedFile, recordedUrl) => {
    console.log('Recording complete:', recordedFile?.name);
    setFile(recordedFile);
    setAudioUrl(recordedUrl);
    setLocalError(null);
  }, []);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setLocalError(null);
  }, [audioUrl]);

  const handleAnalyze = async () => {
    if (!file) {
      setLocalError('No file selected. Please upload or record audio first.');
      return;
    }
    setLocalError(null);
    try {
      await analyzeAudio(file);
    } catch (err) {
      setLocalError(err.message || 'Analysis failed.');
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear all analysis history?')) clearHistory();
  };

  const handleExportResults = () => {
    if (!results) return;
    const blob = new Blob([JSON.stringify(results.raw, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fatigue-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
      {/* Header dengan Logo */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl overflow-hidden ring-2 ring-primary/40 glow-purple">
          <img src={LOGO_URL} alt="Explainable AI" className="w-full h-full object-cover" />
        </div>
        <h1 className="font-space text-3xl md:text-4xl font-bold gradient-text-purple text-glow">
          Explainable AI
        </h1>
        <p className="text-white/40 text-sm mt-2">Emotional Fatigue Classification</p>
      </motion.div>

      {/* Connection Status */}
      <div className="flex justify-end mb-4">
        <button
          onClick={checkApiConnection}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs border backdrop-blur-sm transition-all ${
            connected === null
              ? 'bg-white/5 border-white/10 text-white/50'
              : connected
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-accent/10 border-accent/30 text-accent'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : connected === false ? 'bg-accent' : 'bg-white/50'}`} />
          {connected === null ? 'Check Connection' : connected ? 'HF Connected' : 'HF Offline'}
        </button>
      </div>

      {/* Upload / Record Section */}
      <section className="mb-8">
        <GlassCard className="relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-space text-2xl font-semibold">Audio Input</h2>
              <p className="text-white/40 text-sm">Upload or record audio for fatigue analysis</p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1 bg-black/30 rounded-xl mb-6 backdrop-blur-sm">
            {[
              { id: 'upload', icon: <UploadCloud className="w-4 h-4" />, label: 'Upload File' },
              { id: 'record', icon: <Radio className="w-4 h-4" />, label: 'Record Voice' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-primary/20 text-primary-light border border-primary/30 shadow-lg shadow-primary/10'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'upload' ? (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
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
                      className="btn-primary w-full mt-6 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
                      ) : (
                        <><Sparkles className="w-5 h-5" /> Analyze Fatigue</>
                      )}
                    </motion.button>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="record"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {!file ? (
                  <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
                ) : (
                  <>
                    <AudioPreview file={file} audioUrl={audioUrl} onRemove={handleRemoveFile} />
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={handleAnalyze}
                      disabled={loading}
                      className="btn-primary w-full mt-6 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
                      ) : (
                        <><Sparkles className="w-5 h-5" /> Analyze Fatigue</>
                      )}
                    </motion.button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </section>

      {/* Loading */}
      <AnimatePresence>
        {loading && (
          <LoadingSpinner 
            text="Analyzing Audio"
            subtext="Processing audio features with Explainable AI"
            progress={progress}
          />
        )}
      </AnimatePresence>

      {/* Error */}
      {displayError && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-accent mt-0.5" />
            <div>
              <p className="font-medium text-accent">Analysis Error</p>
              <p className="text-sm text-white/60 mt-1">{displayError}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
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
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-space text-2xl font-semibold">Analysis Results</h2>
                  <p className="text-white/40 text-sm">Explainable AI fatigue classification</p>
                </div>
              </div>
              <button
                onClick={handleExportResults}
                className="flex items-center gap-2 px-4 py-2 bg-glass border border-glass-border rounded-xl text-sm text-white/60 hover:text-white hover:border-primary-light/50 transition-all"
              >
                <Download className="w-4 h-4" /> Export JSON
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <GlassCard className="relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-accent to-orange-400 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Fatigue Level</h3>
                    <span className="text-xs text-white/40">Classification Result</span>
                  </div>
                </div>
                <FatigueGauge score={results.gaugeScore} predictedClass={results.predictedClass} confidence={results.confidence} />
                <ClassificationBadge predictedClass={results.predictedClass} confidence={results.confidence} />
              </GlassCard>

              <GlassCard className="relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary to-primary-light" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-secondary to-cyan-400 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Probability Distribution</h3>
                    <span className="text-xs text-white/40">Per Class Confidence</span>
                  </div>
                </div>
                <ProbabilityChart probabilities={results.probabilities} />
              </GlassCard>

              <GlassCard className="md:col-span-2 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Audio Spectrogram</h3>
                    <span className="text-xs text-white/40">Frequency-Time Visualization</span>
                  </div>
                </div>
                <Suspense fallback={<SpectrogramFallback />}>
                  <SpectrogramDisplay audioUrl={audioUrl} />
                </Suspense>
                <FeatureImportance featureValues={results.features} />
              </GlassCard>
            </div>

            <GlassCard className="mt-6">
              <div className="flex items-center gap-2 mb-4 text-sm text-white/40">
                <Code className="w-4 h-4" /> API Response (JSON)
              </div>
              <div className="bg-black/30 rounded-xl p-4 overflow-x-auto border border-white/5">
                <pre className="text-xs text-white/50 font-mono whitespace-pre-wrap">
                  {JSON.stringify(results.raw, null, 2)}
                </pre>
              </div>
            </GlassCard>
          </motion.section>
        )}
      </AnimatePresence>

      {/* History */}
      {history.length > 0 && (
        <section className="mt-8">
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-space text-2xl font-semibold">History</h2>
                  <p className="text-white/40 text-sm">Previous analysis results</p>
                </div>
              </div>
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-xl text-sm text-accent hover:bg-accent/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Clear
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-glass-border">
                    {['Time', 'File', 'Prediction', 'Confidence'].map(h => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-white/40 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="border-b border-glass-border/30 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-sm text-white/60">{new Date(item.timestamp).toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-white/60">{item.fileName}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          item.predictedClass === 'low' ? 'bg-green-500/15 text-green-400' :
                          item.predictedClass === 'medium' ? 'bg-yellow-500/15 text-yellow-400' :
                          'bg-red-500/15 text-red-400'
                        }`}>
                          {item.predictedClass.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-white/60">{item.confidence.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </section>
      )}
    </div>
  );
};

export default PredictPage;