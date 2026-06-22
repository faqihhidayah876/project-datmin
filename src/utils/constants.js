// ==================== API CONFIGURATION ====================

// Ambil config dari localStorage, fallback ke default
const getStoredConfig = () => {
  try {
    const stored = localStorage.getItem('api_config');
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Error parsing stored config:', e);
  }
  return null;
};

const storedConfig = getStoredConfig();

// Default config (kosong - user harus setup dulu)
export const DEFAULT_CONFIG = {
  mode: 'ngrok', // 'ngrok' | 'huggingface'
  ngrokToken: '',
  ngrokUrl: '',
  huggingfaceUrl: '',
  predictEndpoint: '/predict',
};

// Current active config
export const API_CONFIG = storedConfig || DEFAULT_CONFIG;

// Helper: Get base URL berdasarkan mode
export const getBaseUrl = () => {
  if (API_CONFIG.mode === 'ngrok') {
    return API_CONFIG.ngrokUrl || '';
  }
  return API_CONFIG.huggingfaceUrl || '';
};

// Helper: Get full predict URL
export const getPredictUrl = () => {
  const base = getBaseUrl();
  const endpoint = API_CONFIG.predictEndpoint || '/predict';
  return base ? `${base}${endpoint}` : '';
};

// Helper: Check if config is valid
export const isConfigValid = () => {
  const base = getBaseUrl();
  return base && base.startsWith('http');
};

// ==================== CLASSES & LABELS ====================
export const CLASSES = ['low', 'medium', 'high'];

export const CLASS_LABELS = {
  low: 'LOW FATIGUE (Not Tired)',
  medium: 'MEDIUM FATIGUE (Moderately Tired)',
  high: 'HIGH FATIGUE (Very Tired)',
};

export const CLASS_COLORS = {
  low: '#00D4AA',
  medium: '#FFB347',
  high: '#FF6B9D',
};

export const CLASS_BADGE_STYLES = {
  low: 'bg-secondary/20 text-secondary border-secondary/30',
  medium: 'bg-accent-2/20 text-accent-2 border-accent-2/30',
  high: 'bg-accent/20 text-accent border-accent/30',
};

export const FEATURE_IMPORTANCE_MAP = {
  low: { rms: 85, pitch: 78, centroid: 72, zcr: 65, silence: 45 },
  medium: { rms: 60, pitch: 55, centroid: 70, zcr: 58, silence: 62 },
  high: { rms: 40, pitch: 35, centroid: 45, zcr: 42, silence: 80 },
};

export const getGaugeScore = (className) => {
  const scoreMap = { low: 0.2, medium: 0.5, high: 0.8 };
  return scoreMap[className] || 0.5;
};