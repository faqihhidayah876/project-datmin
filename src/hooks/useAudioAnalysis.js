import { useState, useCallback } from 'react';
import { useApi } from './useApi';
import { CLASS_LABELS, getGaugeScore, FEATURE_IMPORTANCE_MAP } from '../utils/constants';

export const useAudioAnalysis = () => {
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const { loading, error, connected, progress, predict, checkApiConnection } = useApi();

  const analyzeAudio = useCallback(async (audioFile) => {
    console.log('=== ANALYZE AUDIO START ===');
    console.log('File:', audioFile?.name, 'Type:', audioFile?.type, 'Size:', audioFile?.size);

    try {
      const data = await predict(audioFile);
      console.log('Raw API data:', data);

      // ✅ VALIDASI RESPONSE API
      if (!data) {
        throw new Error('Empty response from API');
      }

      // Handle berbagai format response
      const predictedClass = data.predicted_class || data.predictedClass || 'medium';
      const confidence = typeof data.confidence === 'number' ? data.confidence : 0;
      
      // Normalisasi probabilities - bisa array atau object
      let probabilities = [];
      if (Array.isArray(data.probabilities)) {
        probabilities = data.probabilities;
      } else if (typeof data.probabilities === 'object' && data.probabilities !== null) {
        // Jika object {low: 0.1, medium: 0.7, high: 0.2}
        probabilities = Object.entries(data.probabilities).map(([cls, prob]) => ({
          class: cls,
          probability: typeof prob === 'number' ? prob * 100 : 0
        }));
      } else {
        // Fallback jika tidak ada probabilities
        probabilities = [
          { class: 'low', probability: predictedClass === 'low' ? confidence : (100 - confidence) / 2 },
          { class: 'medium', probability: predictedClass === 'medium' ? confidence : (100 - confidence) / 2 },
          { class: 'high', probability: predictedClass === 'high' ? confidence : (100 - confidence) / 2 },
        ];
      }

      // Pastikan semua class ada
      const probMap = {};
      probabilities.forEach(p => { probMap[p.class] = p.probability; });
      
      const normalizedProbabilities = ['low', 'medium', 'high'].map(cls => ({
        class: cls,
        probability: probMap[cls] || 0
      }));

      console.log('Processed data:', { predictedClass, confidence, probabilities: normalizedProbabilities });

      const processedResults = {
        predictedClass,
        predictedLabel: CLASS_LABELS[predictedClass] || CLASS_LABELS.medium,
        confidence,
        probabilities: normalizedProbabilities,
        gaugeScore: getGaugeScore(predictedClass),
        features: FEATURE_IMPORTANCE_MAP[predictedClass] || FEATURE_IMPORTANCE_MAP.medium,
        raw: data,
      };

      setResults(processedResults);

      const historyItem = {
        id: Date.now(),
        timestamp: new Date(),
        fileName: audioFile.name,
        predictedClass,
        confidence,
      };

      setHistory(prev => [historyItem, ...prev].slice(0, 50));
      console.log('=== ANALYZE AUDIO SUCCESS ===');
      return processedResults;
    } catch (err) {
      console.error('=== ANALYZE AUDIO ERROR ===');
      console.error('Error:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      throw err;
    }
  }, [predict]);

  const clearResults = useCallback(() => {
    setResults(null);
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return {
    results,
    history,
    loading,
    error,
    connected,
    progress,
    analyzeAudio,
    clearResults,
    clearHistory,
    checkApiConnection,
  };
};