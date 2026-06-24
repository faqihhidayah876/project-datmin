import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, Save, TestTube, AlertCircle, CheckCircle, Globe, Server, Mic } from 'lucide-react';
import GlassCard from '../common/GlassCard';

const ApiConfig = () => {
  const navigate = useNavigate();

  const [config, setConfig] = useState({
    huggingfaceUrl: '',
    predictEndpoint: '/predict',
  });

  const [testStatus, setTestStatus] = useState(null);
  const [testMessage, setTestMessage] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('api_config');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Migrate old config format (remove ngrok fields)
        setConfig({
          huggingfaceUrl: parsed.huggingfaceUrl || '',
          predictEndpoint: parsed.predictEndpoint || '/predict',
        });
      } catch (e) {
        console.error('Error parsing config:', e);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value.trim() }));
    setSaved(false);
  };

  const saveConfig = () => {
    // Validate URL
    let url = config.huggingfaceUrl.trim();

    // Remove trailing slash
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }

    // Validate format
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      setTestStatus('error');
      setTestMessage('URL must start with https:// or http://');
      return;
    }

    const cleanConfig = {
      huggingfaceUrl: url,
      predictEndpoint: config.predictEndpoint || '/predict',
    };

    localStorage.setItem('api_config', JSON.stringify(cleanConfig));
    setConfig(cleanConfig);
    setSaved(true);
    setTestStatus(null);
    setTimeout(() => setSaved(false), 3000);
  };

  const testConnection = async () => {
    if (!config.huggingfaceUrl) {
      setTestStatus('error');
      setTestMessage('Please enter Hugging Face URL first');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Testing connection...');

    try {
      // Try to fetch root endpoint with no-cors
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${config.huggingfaceUrl}/`, {
        method: 'GET',
        mode: 'no-cors',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // With no-cors, we can't read response, but if no error, it's reachable
      setTestStatus('success');
      setTestMessage('Server is reachable! (CORS may block detailed check)');

    } catch (error) {
      setTestStatus('error');
      setTestMessage(`Connection failed: ${error.name === 'AbortError' ? 'Request timeout' : error.message}`);
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-glass border border-glass-border rounded-full text-sm text-primary-light mb-4">
            <Settings className="w-4 h-4" />
            API Configuration
          </div>
          <h1 className="font-space text-4xl font-bold gradient-text mb-2">
            Configure Backend
          </h1>
          <p className="text-white/50">
            Connect to your Hugging Face Space backend
          </p>
        </div>

        {/* Hugging Face Configuration */}
        <GlassCard className="mb-6">
          <h2 className="font-space text-xl font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-accent" />
            Hugging Face Space
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">
                Hugging Face Space URL <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                name="huggingfaceUrl"
                value={config.huggingfaceUrl}
                onChange={handleChange}
                placeholder="https://your-username-project.hf.space"
                className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors"
              />
              <p className="text-xs text-white/40 mt-1">
                Example: https://qeehh-fatigue-audio-classifier.hf.space
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Endpoint Settings */}
        <GlassCard className="mb-6">
          <h2 className="font-space text-xl font-semibold mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-secondary" />
            Endpoint Settings
          </h2>

          <div>
            <label className="block text-sm text-white/70 mb-2">
              Predict Endpoint
            </label>
            <input
              type="text"
              name="predictEndpoint"
              value={config.predictEndpoint}
              onChange={handleChange}
              placeholder="/predict"
              className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors"
            />
            <p className="text-xs text-white/40 mt-1">
              Default: /predict (change if your backend uses different endpoint)
            </p>
          </div>
        </GlassCard>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={saveConfig}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {saved ? 'Saved!' : 'Save Configuration'}
          </button>

          <button
            onClick={testConnection}
            disabled={testStatus === 'testing'}
            className="px-6 py-3 bg-glass border border-glass-border rounded-xl text-white font-medium hover:border-secondary transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <TestTube className="w-5 h-5" />
            {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
          </button>

          <button
            onClick={() => navigate('/predict')}
            className="px-6 py-3 bg-glass border border-glass-border rounded-xl text-white font-medium hover:border-primary transition-colors"
          >
            Go to Predict →
          </button>
        </div>

        {/* Test Status */}
        {testStatus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-xl flex items-center gap-3 ${
              testStatus === 'success'
                ? 'bg-secondary/10 border border-secondary/30 text-secondary'
                : testStatus === 'error'
                ? 'bg-accent/10 border border-accent/30 text-accent'
                : 'bg-primary/10 border border-primary/30 text-primary-light'
            }`}
          >
            {testStatus === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : testStatus === 'error' ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <TestTube className="w-5 h-5 animate-spin" />
            )}
            {testMessage}
          </motion.div>
        )}

        {/* Current Config Summary */}
        <GlassCard className="mt-6">
          <h3 className="font-semibold mb-3">Current Active Configuration</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/50">Backend:</span>
              <span className="font-medium">Hugging Face Spaces</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Space URL:</span>
              <span className="font-medium text-primary-light truncate max-w-xs">
                {config.huggingfaceUrl || 'Not configured'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Predict URL:</span>
              <span className="font-medium text-primary-light truncate max-w-xs">
                {config.huggingfaceUrl ? `${config.huggingfaceUrl}${config.predictEndpoint}` : 'Not configured'}
              </span>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default ApiConfig;