import { useState, useCallback } from 'react';
import { predictFatigue as apiPredict, checkConnection } from '../services/api';
import { isConfigValid } from '../utils/constants';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(null);
  const [progress, setProgress] = useState(null); // ⬆️ TAMBAH

  const predict = useCallback(async (audioFile) => {
    if (!isConfigValid()) {
      setError('API not configured. Please configure API settings first.');
      throw new Error('API not configured');
    }

    setLoading(true);
    setError(null);
    setProgress(null);
    
    try {
      // ⬆️ TAMBAH progress callback
      const result = await apiPredict(audioFile, (progressInfo) => {
        setProgress(progressInfo);
      });
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }, []);

  const checkApiConnection = useCallback(async () => {
    if (!isConfigValid()) {
      setConnected(false);
      return false;
    }
    
    const isConnected = await checkConnection();
    setConnected(isConnected);
    return isConnected;
  }, []);

  return { loading, error, connected, progress, predict, checkApiConnection };
};