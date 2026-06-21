import { useState, useCallback } from 'react';
import { predictFatigue as apiPredict, checkConnection } from '../services/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(null);

  const predict = useCallback(async (audioFile) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiPredict(audioFile);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkApiConnection = useCallback(async () => {
    const isConnected = await checkConnection();
    setConnected(isConnected);
    return isConnected;
  }, []);

  return { loading, error, connected, predict, checkApiConnection };
};