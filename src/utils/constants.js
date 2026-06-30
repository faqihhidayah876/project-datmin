// ==================== API CONFIGURATION ====================

export const HF_SPACE_URL = 'https://qeehh-fatigue-audio-classifier.hf.space';
export const HF_PREDICT_ENDPOINT = '/predict';
export const MAX_AUDIO_DURATION = 15;

export const getBaseUrl = () => HF_SPACE_URL;
export const getPredictUrl = () => `${HF_SPACE_URL}${HF_PREDICT_ENDPOINT}`;
export const isConfigValid = () => true;

// ==================== CEREBRAS AI CHAT API CONFIGURATION ====================
export const CEREBRAS_API_KEY = import.meta.env.VITE_CEREBRAS_API_KEY || '';
export const CEREBRAS_API_URL = import.meta.env.VITE_CEREBRAS_API_URL || 'https://api.cerebras.ai/v1/chat/completions';
export const isAIConfigValid = () => !!CEREBRAS_API_KEY;

// ==================== LOGO ====================
export const LOGO_URL = 'https://i.ibb.co.com/Rpkm30y0/logo-datmin.png';

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