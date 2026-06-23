// Audio Analysis Utilities - FIXED VERSION
// Lightweight, non-blocking, dengan chunking untuk audio besar

/**
 * Decode audio dengan error handling
 */
export const decodeAudioData = async (audioFile) => {
  try {
    const arrayBuffer = await audioFile.arrayBuffer();
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return { audioContext, audioBuffer };
  } catch (err) {
    console.error('Decode error:', err);
    throw new Error('Failed to decode audio file. Ensure it is a valid WAV/MP3.');
  }
};

/**
 * Extract frequency data - CHUNKED & NON-BLOCKING
 * Menggunakan requestAnimationFrame untuk yield ke main thread
 */
export const extractFrequencyData = async (audioBuffer, onProgress = null) => {
  const sampleRate = audioBuffer.sampleRate;
  const channelData = audioBuffer.getChannelData(0); // Ambil channel pertama saja
  const totalSamples = channelData.length;

  // Parameter yang lebih ringan
  const fftSize = 512; // Lebih kecil = lebih cepat
  const hopSize = 256; // 50% overlap
  const maxFrames = 400; // Batasi maksimum frame untuk performa

  // Hitung frame yang akan diproses
  const rawFrameCount = Math.floor((totalSamples - fftSize) / hopSize) + 1;
  const frameSkip = Math.max(1, Math.floor(rawFrameCount / maxFrames));
  const numFrames = Math.min(rawFrameCount, maxFrames);

  const spectrogramData = [];

  // Proses dalam chunk dengan yield
  return new Promise((resolve) => {
    let frameIndex = 0;

    const processChunk = () => {
      const chunkSize = 10; // Proses 10 frame per chunk
      const endFrame = Math.min(frameIndex + chunkSize, numFrames);

      for (let i = frameIndex; i < endFrame; i++) {
        const start = i * hopSize * frameSkip;
        const end = start + fftSize;

        if (end > totalSamples) break;

        // Extract frame
        const frame = channelData.slice(start, end);

        // Apply Hanning window
        const windowed = applyHanningWindow(frame);

        // Simplified magnitude (lebih cepat dari full FFT)
        const magnitudes = computeMagnitudesFast(windowed);

        spectrogramData.push(magnitudes);
      }

      frameIndex = endFrame;

      // Report progress
      if (onProgress) {
        onProgress(Math.round((frameIndex / numFrames) * 100));
      }

      if (frameIndex < numFrames) {
        // Yield ke main thread
        requestAnimationFrame(processChunk);
      } else {
        resolve(spectrogramData);
      }
    };

    processChunk();
  });
};

/**
 * Apply Hanning window
 */
const applyHanningWindow = (frame) => {
  const n = frame.length;
  const windowed = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    windowed[i] = frame[i] * 0.5 * (1 - Math.cos((2 * Math.PI * i) / (n - 1)));
  }
  return windowed;
};

/**
 * Fast magnitude computation - Simplified DFT (lebih cepat)
 */
const computeMagnitudesFast = (frame) => {
  const n = frame.length;
  const binCount = n / 2;
  const magnitudes = new Float32Array(binCount);

  // Gunakan Goertzel algorithm approximation untuk kecepatan
  // Atau simplified DFT dengan step yang lebih besar
  const step = Math.max(1, Math.floor(n / 256)); // Downsample untuk kecepatan

  for (let k = 0; k < binCount; k += step) {
    let real = 0;
    let imag = 0;
    const stepK = Math.min(step, binCount - k);

    for (let t = 0; t < n; t++) {
      const angle = -2 * Math.PI * k * t / n;
      real += frame[t] * Math.cos(angle);
      imag += frame[t] * Math.sin(angle);
    }

    const mag = Math.sqrt(real * real + imag * imag) / n;

    // Fill intermediate bins
    for (let s = 0; s < stepK && (k + s) < binCount; s++) {
      magnitudes[k + s] = mag;
    }
  }

  // Normalize to 0-1
  let maxMag = 0;
  for (let i = 0; i < binCount; i++) {
    if (magnitudes[i] > maxMag) maxMag = magnitudes[i];
  }

  if (maxMag > 0) {
    for (let i = 0; i < binCount; i++) {
      magnitudes[i] = magnitudes[i] / maxMag;
    }
  }

  return Array.from(magnitudes);
};

/**
 * Create real-time analyser untuk live visualization
 */
export const createRealtimeAnalyser = (audioContext, source) => {
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256; // Lebih kecil = lebih responsif
  analyser.smoothingTimeConstant = 0.8;
  source.connect(analyser);
  return analyser;
};

/**
 * Get frequency data untuk visualizer
 */
export const getFrequencyData = (analyser) => {
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);
  return Array.from(dataArray);
};

/**
 * Get waveform data
 */
export const getWaveformData = (analyser) => {
  const dataArray = new Uint8Array(analyser.fftSize);
  analyser.getByteTimeDomainData(dataArray);
  return Array.from(dataArray).map(v => (v - 128) / 128);
};

/**
 * Generate simplified mel spectrogram
 */
export const generateMelSpectrogram = (spectrogramData, numMels = 40) => {
  if (!spectrogramData || spectrogramData.length === 0) return [];

  const numFreqBins = spectrogramData[0].length;
  const melSpectrogram = [];

  // Simplified mel bands (tanpa filter bank kompleks)
  const bands = [];
  for (let m = 0; m < numMels; m++) {
    const start = Math.floor((m / numMels) * numFreqBins);
    const end = Math.floor(((m + 1) / numMels) * numFreqBins);
    bands.push({ start, end });
  }

  for (const frame of spectrogramData) {
    const melFrame = new Float32Array(numMels);
    for (let m = 0; m < numMels; m++) {
      const { start, end } = bands[m];
      let sum = 0;
      let count = 0;
      for (let f = start; f < end && f < numFreqBins; f++) {
        sum += frame[f];
        count++;
      }
      melFrame[m] = count > 0 ? sum / count : 0;
    }
    // Log scale
    const logFrame = Array.from(melFrame).map(v => Math.log(v + 1e-10));
    const maxVal = Math.max(...logFrame);
    const minVal = maxVal - 10; // 10dB range
    melSpectrogram.push(logFrame.map(v => Math.max(0, Math.min(1, (v - minVal) / (maxVal - minVal)))));
  }

  return melSpectrogram;
};

/**
 * Color mapping untuk spectrogram (viridis-like)
 */
export const getSpectrogramColor = (value) => {
  // value: 0-1
  const colors = [
    [0.05, 0.02, 0.45],   // Dark blue
    [0.13, 0.57, 0.55],   // Teal
    [0.85, 0.90, 0.25],   // Yellow
    [0.99, 0.55, 0.08],   // Orange
    [0.90, 0.15, 0.15],   // Red
  ];

  const idx = Math.min(value * (colors.length - 1), colors.length - 2);
  const lower = Math.floor(idx);
  const upper = lower + 1;
  const t = idx - lower;

  return [
    colors[lower][0] + (colors[upper][0] - colors[lower][0]) * t,
    colors[lower][1] + (colors[upper][1] - colors[lower][1]) * t,
    colors[lower][2] + (colors[upper][2] - colors[lower][2]) * t,
  ];
};

export default {
  decodeAudioData,
  extractFrequencyData,
  createRealtimeAnalyser,
  getFrequencyData,
  getWaveformData,
  generateMelSpectrogram,
  getSpectrogramColor,
};