import axios from 'axios';
import { getBaseUrl, getPredictUrl, isConfigValid } from '../utils/constants';

const createApi = () => {
  const baseURL = getBaseUrl();
  console.log('API Base URL:', baseURL);

  return axios.create({
    baseURL: baseURL || undefined,
    timeout: 120000,
    headers: {
      'Accept': 'application/json',
    },
  });
};

export const predictFatigue = async (audioFile, onProgress) => {
  console.log('=== predictFatigue called ===');
  console.log('isConfigValid:', isConfigValid());

  if (!isConfigValid()) {
    throw new Error('API not configured. Please go to Configure page first.');
  }

  const formData = new FormData();
  const fileName = audioFile.name || 'recording.webm';
  const fileType = audioFile.type || 'audio/webm';

  console.log('Appending file:', fileName, 'Type:', fileType, 'Size:', audioFile.size);
  formData.append('file', audioFile, fileName);

  const api = createApi();
  const predictUrl = getPredictUrl();

  console.log('Predict URL:', predictUrl);

  try {
    console.log('Sending request...');
    const response = await api.post(predictUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000,
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload progress:', percentCompleted + '%');
          onProgress({ type: 'upload', progress: percentCompleted });
        }
      },
    });

    console.log('Response received:', response.status, response.data);
    return response.data;
  } catch (error) {
    console.error('=== API ERROR ===');
    console.error('Error type:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);

    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Backend processing took too long. Please try again with a shorter audio file.');
    }
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      throw new Error(error.response.data?.error || error.response.data?.message || 'Server error: ' + error.response.status);
    } else if (error.request) {
      console.error('No response received. Request:', error.request);
      throw new Error('No response from server. Please check: (1) Hugging Face Space is running (2) API URL is correct (3) CORS is enabled');
    } else {
      throw new Error(error.message);
    }
  }
};

export const checkConnection = async () => {
  if (!isConfigValid()) {
    console.log('checkConnection: Config invalid');
    return false;
  }

  const api = createApi();
  const baseUrl = getBaseUrl();

  try {
    console.log('Checking connection to:', baseUrl);
    await api.get('/', { timeout: 10000 });
    console.log('Connection check: SUCCESS');
    return true;
  } catch (err) {
    console.log('Connection check root failed:', err.message);
    try {
      await api.options(getPredictUrl(), { timeout: 10000 });
      console.log('Connection check options: SUCCESS');
      return true;
    } catch (err2) {
      console.log('Connection check options failed:', err2.message);
      return false;
    }
  }
};

export default createApi;