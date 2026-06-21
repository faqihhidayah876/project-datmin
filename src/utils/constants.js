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

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  PREDICT_ENDPOINT: import.meta.env.VITE_PREDICT_ENDPOINT || '/predict',
  TIMEOUT: 30000,
};

// TAMBAHKAN INI:
export const getGaugeScore = (className) => {
  const scoreMap = { low: 0.2, medium: 0.5, high: 0.8 };
  return scoreMap[className] || 0.5;
};