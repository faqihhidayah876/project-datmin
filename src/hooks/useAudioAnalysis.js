import { useState, useCallback } from 'react';
import { useApi } from './useApi';
// Import dari constants.js (sudah include getGaugeScore)
import { CLASS_LABELS, getGaugeScore, FEATURE_IMPORTANCE_MAP } from '../utils/constants';

export const useAudioAnalysis = () => {
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const { loading, error, connected, predict, checkApiConnection } = useApi();

  const analyzeAudio = useCallback(async (audioFile) => {
    try {
      const data = await predict(audioFile);
      
      if (data.success) {
        const processedResults = {
          predictedClass: data.predicted_class,
          predictedLabel: CLASS_LABELS[data.predicted_class],
          confidence: data.confidence,
          probabilities: data.probabilities,
          gaugeScore: getGaugeScore(data.predicted_class),
          features: FEATURE_IMPORTANCE_MAP[data.predicted_class] || FEATURE_IMPORTANCE_MAP.medium,
          raw: data,
        };

        setResults(processedResults);
        
        const historyItem = {
          id: Date.now(),
          timestamp: new Date(),
          fileName: audioFile.name,
          predictedClass: data.predicted_class,
          confidence: data.confidence,
        };
        
        setHistory(prev => [historyItem, ...prev].slice(0, 50));
        return processedResults;
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      throw err;
    }
  }, [predict]);

  const clearResults = useCallback(() => {
    setResults(null);
  }, []);

  return {
    results,
    history,
    loading,
    error,
    connected,
    analyzeAudio,
    clearResults,
    checkApiConnection,
  };
};