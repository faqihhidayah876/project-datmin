import { useState, useCallback } from 'react';
import { predictFatigue as apiPredict, checkConnection } from '../services/api';
import { isConfigValid } from '../utils/constants';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(null);
  const [progress, setProgress] = useState(null);

  const predict = useCallback(async (audioFile) => {
    console.log('=== PREDICT START ===');
    console.log('File:', audioFile?.name, 'Size:', audioFile?.size);
    console.log('Config valid:', isConfigValid());
    console.log('Predict URL:', window.localStorage.getItem('api_config'));

    if (!isConfigValid()) {
      const errMsg = 'API not configured. Please go to Configure page first.';
      console.error('ERROR:', errMsg);
      setError(errMsg);
      throw new Error(errMsg);
    }

    setLoading(true);
    setError(null);
    setProgress(null);

    try {
      console.log('Calling apiPredict...');
      const result = await apiPredict(audioFile, (progressInfo) => {
        console.log('Progress:', progressInfo);
        setProgress(progressInfo);
      });

      console.log('API Result:', result);
      return result;
    } catch (err) {
      console.error('API Error:', err);
      console.error('Error message:', err.message);
      console.error('Error response:', err.response?.data);
      setError(err.message || 'Unknown error occurred');
      throw err;
    } finally {
      setLoading(false);
      setProgress(null);
      console.log('=== PREDICT END ===');
    }
  }, []);

  const checkApiConnection = useCallback(async () => {
    console.log('Checking API connection...');
    if (!isConfigValid()) {
      console.log('Config invalid');
      setConnected(false);
      return false;
    }

    try {
      const isConnected = await checkConnection();
      console.log('Connection result:', isConnected);
      setConnected(isConnected);
      return isConnected;
    } catch (err) {
      console.error('Connection check failed:', err);
      setConnected(false);
      return false;
    }
  }, []);

  return { loading, error, connected, progress, predict, checkApiConnection };
};