import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, Save, TestTube, AlertCircle, CheckCircle, Globe, Server } from 'lucide-react';
import GlassCard from '../common/GlassCard';

const ApiConfig = () => {
  const navigate = useNavigate();
  
  const [config, setConfig] = useState({
    mode: 'ngrok',
    ngrokToken: '',
    ngrokUrl: '',
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
        setConfig(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing config:', e);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleModeChange = (mode) => {
    setConfig(prev => ({ ...prev, mode }));
    setSaved(false);
  };

  const saveConfig = () => {
    localStorage.setItem('api_config', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const testConnection = async () => {
    setTestStatus('testing');
    setTestMessage('Testing connection...');

    try {
      const baseUrl = config.mode === 'ngrok' ? config.ngrokUrl : config.huggingfaceUrl;
      
      if (!baseUrl) {
        throw new Error('Please fill in the URL first');
      }

      const response = await fetch(`${baseUrl}/`, {
        method: 'GET',
        mode: 'no-cors',
      });

      setTestStatus('success');
      setTestMessage('Server is reachable! (CORS may block detailed check)');
      
    } catch (error) {
      setTestStatus('error');
      setTestMessage(`Connection failed: ${error.message}`);
    }
  };

  const getActiveUrl = () => {
    return config.mode === 'ngrok' ? config.ngrokUrl : config.huggingfaceUrl;
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
            Setup your Ngrok or Hugging Face backend connection
          </p>
        </div>

        {/* Mode Selection */}
        <GlassCard className="mb-6">
          <h2 className="font-space text-xl font-semibold mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-primary-light" />
            Select Backend Mode
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleModeChange('ngrok')}
              className={`p-4 rounded-2xl border-2 transition-all ${
                config.mode === 'ngrok'
                  ? 'border-primary bg-primary/10'
                  : 'border-glass-border hover:border-white/25'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  config.mode === 'ngrok' ? 'bg-primary border-primary' : 'border-white/30'
                }`} />
                <span className="font-semibold">Ngrok</span>
              </div>
              <p className="text-sm text-white/50 text-left">
                Use Google Colab + Ngrok tunnel
              </p>
            </button>

            <button
              onClick={() => handleModeChange('huggingface')}
              className={`p-4 rounded-2xl border-2 transition-all ${
                config.mode === 'huggingface'
                  ? 'border-primary bg-primary/10'
                  : 'border-glass-border hover:border-white/25'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  config.mode === 'huggingface' ? 'bg-primary border-primary' : 'border-white/30'
                }`} />
                <span className="font-semibold">Hugging Face</span>
              </div>
              <p className="text-sm text-white/50 text-left">
                Use Hugging Face Spaces
              </p>
            </button>
          </div>
        </GlassCard>

        {/* Ngrok Configuration */}
        {config.mode === 'ngrok' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <GlassCard className="mb-6">
              <h2 className="font-space text-xl font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-secondary" />
                Ngrok Configuration
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">
                    Ngrok Public URL
                  </label>
                  <input
                    type="text"
                    name="ngrokUrl"
                    value={config.ngrokUrl}
                    onChange={handleChange}
                    placeholder="https://xxxx-xx-xx-xxx-xx.ngrok.io"
                    className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors"
                  />
                  <p className="text-xs text-white/40 mt-1">
                    Copy from Colab output: https://xxxx.ngrok.io
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">
                    Ngrok Auth Token (Optional)
                  </label>
                  <input
                    type="password"
                    name="ngrokToken"
                    value={config.ngrokToken}
                    onChange={handleChange}
                    placeholder="2Kjsh...xxxxx"
                    className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors"
                  />
                  <p className="text-xs text-white/40 mt-1">
                    Only needed if running your own ngrok client
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Hugging Face Configuration */}
        {config.mode === 'huggingface' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <GlassCard className="mb-6">
              <h2 className="font-space text-xl font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-accent" />
                Hugging Face Configuration
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">
                    Hugging Face Space URL
                  </label>
                  <input
                    type="text"
                    name="huggingfaceUrl"
                    value={config.huggingfaceUrl}
                    onChange={handleChange}
                    placeholder="https://your-username-project-datmin.hf.space"
                    className="w-full px-4 py-3 bg-black/30 border border-glass-border rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary transition-colors"
                  />
                  <p className="text-xs text-white/40 mt-1">
                    Your HF Space URL (e.g., https://faqih-project-datmin.hf.space)
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Common Settings */}
        <GlassCard className="mb-6">
          <h2 className="font-space text-xl font-semibold mb-4">
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
              <span className="text-white/50">Mode:</span>
              <span className="font-medium capitalize">{config.mode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Base URL:</span>
              <span className="font-medium text-primary-light truncate max-w-xs">
                {getActiveUrl() || 'Not configured'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/50">Predict URL:</span>
              <span className="font-medium text-primary-light truncate max-w-xs">
                {getActiveUrl() ? `${getActiveUrl()}${config.predictEndpoint}` : 'Not configured'}
              </span>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default ApiConfig;