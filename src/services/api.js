import axios from 'axios';
import { getBaseUrl, getPredictUrl, isConfigValid } from '../utils/constants';

// Create axios instance dengan timeout lebih lama
const createApi = () => {
  const baseURL = getBaseUrl();
  
  return axios.create({
    baseURL: baseURL || undefined,
    timeout: 120000, // ⬆️ INCREASE: 2 menit (120 detik)
    headers: {
      'Accept': 'application/json',
    },
  });
};

// ==================== API FUNCTIONS ====================

export const predictFatigue = async (audioFile, onProgress) => {
  if (!isConfigValid()) {
    throw new Error('API not configured. Please go to Configure page first.');
  }

  const formData = new FormData();
  formData.append('file', audioFile);

  const api = createApi();
  const predictUrl = getPredictUrl();

  try {
    const response = await api.post(predictUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // ⬆️ INCREASE timeout khusus untuk upload
      timeout: 120000,
      // Progress tracking
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress({ type: 'upload', progress: percentCompleted });
        }
      },
    });
    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Backend processing took too long. Please try again with a shorter audio file.');
    }
    if (error.response) {
      throw new Error(error.response.data?.error || `Server error: ${error.response.status}`);
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection and API URL.');
    } else {
      throw new Error(error.message);
    }
  }
};

export const checkConnection = async () => {
  if (!isConfigValid()) return false;

  const api = createApi();
  const baseUrl = getBaseUrl();

  try {
    // Coba ping base URL dengan timeout pendek
    await api.get('/', { timeout: 10000 });
    return true;
  } catch {
    try {
      await api.options(getPredictUrl(), { timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }
};

export default createApi;