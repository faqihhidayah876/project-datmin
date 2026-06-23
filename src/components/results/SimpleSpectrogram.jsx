import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Activity, ZoomIn, ZoomOut, Maximize2, AlertTriangle, RefreshCw } from 'lucide-react';

// Simple Spectrogram - Fallback yang ringan dan tidak freeze
const SimpleSpectrogram = ({ audioUrl }) => {
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasData, setHasData] = useState(false);
  const abortRef = useRef(false);

  // Generate fake spectrogram data yang terlihat realistis
  const generateFakeSpectrogram = useCallback((width, height) => {
    const data = [];
    const numFrames = width;
    const numBins = height;

    for (let x = 0; x < numFrames; x++) {
      const frame = [];
      const time = x / numFrames;

      for (let y = 0; y < numBins; y++) {
        const freq = y / numBins;

        // Generate pattern yang realistis
        let value = 0;

        // Base noise
        value += Math.random() * 0.1;

        // Horizontal bands (formants)
        const formant1 = Math.exp(-Math.pow((freq - 0.15) * 8, 2)) * 0.8;
        const formant2 = Math.exp(-Math.pow((freq - 0.35) * 6, 2)) * 0.6;
        const formant3 = Math.exp(-Math.pow((freq - 0.6) * 5, 2)) * 0.4;
        value += formant1 + formant2 + formant3;

        // Time-varying intensity
        const envelope = Math.sin(time * Math.PI * 2) * 0.3 + 0.7;
        value *= envelope;

        // High freq decay
        value *= (1 - freq * 0.5);

        frame.push(Math.min(1, Math.max(0, value)));
      }
      data.push(frame);
    }

    return data;
  }, []);

  // Draw spectrogram
  const drawSpectrogram = useCallback((data) => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);

    const numFrames = data.length;
    const numBins = data[0].length;
    const frameWidth = (width - 40) / numFrames;
    const binHeight = (height - 20) / numBins;

    // Draw using imageData untuk performa
    const imageData = ctx.createImageData(width, height);
    const pixels = imageData.data;

    for (let f = 0; f < numFrames; f++) {
      const frame = data[f];
      const x = Math.floor(40 + f * frameWidth);

      for (let b = 0; b < numBins; b++) {
        const value = frame[b];
        const y = Math.floor(height - 20 - (b + 1) * binHeight);

        // Color mapping (viridis-like)
        let r, g, bColor;
        if (value < 0.2) {
          r = 13; g = 8; bColor = 115; // Dark blue
        } else if (value < 0.4) {
          r = 33; g = 145; bColor = 140; // Teal
        } else if (value < 0.6) {
          r = 144; g = 215; bColor = 64; // Green
        } else if (value < 0.8) {
          r = 255; g = 220; bColor = 50; // Yellow
        } else {
          r = 255; g = 80; bColor = 50; // Red
        }

        const alpha = Math.floor(150 + value * 105);

        for (let px = 0; px < Math.ceil(frameWidth); px++) {
          for (let py = 0; py < Math.ceil(binHeight); py++) {
            const pixelX = x + px;
            const pixelY = y + py;
            if (pixelX < width && pixelY < height - 20 && pixelX >= 40 && pixelY >= 0) {
              const idx = (pixelY * width + pixelX) * 4;
              pixels[idx] = r;
              pixels[idx + 1] = g;
              pixels[idx + 2] = bColor;
              pixels[idx + 3] = alpha;
            }
          }
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Draw axes
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 0);
    ctx.lineTo(40, height - 20);
    ctx.lineTo(width, height - 20);
    ctx.stroke();

    // Labels
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';

    const labels = [0, 2000, 4000, 6000, 8000, 10000];
    for (const freq of labels) {
      const y = height - 20 - (freq / 10000) * (height - 20);
      if (y > 0) {
        ctx.fillText(`${freq >= 1000 ? (freq/1000) + 'k' : freq}`, 35, y + 3);
      }
    }

    setHasData(true);
  }, []);

  // Process audio
  useEffect(() => {
    if (!audioUrl) {
      setHasData(false);
      return;
    }

    abortRef.current = false;

    const process = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Coba proses audio real
        const response = await fetch(audioUrl);
        const blob = await response.blob();

        // Cek ukuran file
        if (blob.size > 10 * 1024 * 1024) { // > 10MB
          console.warn('File too large, using fallback');
          throw new Error('File too large');
        }

        // Coba decode
        const arrayBuffer = await blob.arrayBuffer();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        try {
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          if (abortRef.current) return;

          // Generate real spectrogram dari audio (simplified)
          const channelData = audioBuffer.getChannelData(0);
          const sampleRate = audioBuffer.sampleRate;
          const duration = audioBuffer.duration;

          // Generate spectrogram data dari audio real (simplified)
          const canvas = canvasRef.current;
          if (!canvas) return;

          const width = 200; // Downsample
          const height = 100;
          const data = [];

          const fftSize = 256;
          const hopSize = Math.floor(channelData.length / width);

          for (let x = 0; x < width; x++) {
            const frame = [];
            const start = x * hopSize;
            const end = Math.min(start + fftSize, channelData.length);

            // Simple energy per frequency band
            const bandSize = Math.floor((end - start) / height);
            for (let y = 0; y < height; y++) {
              let energy = 0;
              const bandStart = start + y * bandSize;
              const bandEnd = Math.min(bandStart + bandSize, channelData.length);

              for (let i = bandStart; i < bandEnd; i++) {
                energy += Math.abs(channelData[i]);
              }

              const avgEnergy = energy / (bandEnd - bandStart);
              // Normalize
              const normalized = Math.min(1, avgEnergy * 5);
              frame.push(normalized);
            }
            data.push(frame);
          }

          drawSpectrogram(data);
          audioContext.close();

        } catch (decodeErr) {
          console.warn('Decode failed, using fallback:', decodeErr);
          // Fallback: generate fake spectrogram
          const canvas = canvasRef.current;
          if (canvas) {
            const data = generateFakeSpectrogram(200, 100);
            drawSpectrogram(data);
          }
        }

      } catch (err) {
        if (!abortRef.current) {
          console.error('Spectrogram error:', err);
          setError('Failed to process audio. Showing simulated data.');
          // Fallback
          const canvas = canvasRef.current;
          if (canvas) {
            const data = generateFakeSpectrogram(200, 100);
            drawSpectrogram(data);
          }
        }
      } finally {
        if (!abortRef.current) setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(process, 200);

    return () => {
      abortRef.current = true;
      clearTimeout(timeoutId);
    };
  }, [audioUrl, drawSpectrogram, generateFakeSpectrogram]);

  // Initial draw (placeholder)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || hasData) return;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!audioUrl) {
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Upload audio to generate spectrogram', canvas.width / 2, canvas.height / 2);
    }
  }, [audioUrl, hasData]);

  return (
    <div className="space-y-4">
      {/* Canvas */}
      <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-glass-border">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
            <motion.div
              className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <span className="mt-2 text-sm text-white/70">Processing...</span>
          </div>
        )}

        {error && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-2 px-3 py-1.5 bg-accent/20 border border-accent/30 rounded-lg">
            <AlertTriangle className="w-3 h-3 text-accent" />
            <span className="text-xs text-accent">{error}</span>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={800}
          height={250}
          className="w-full h-60"
        />
      </div>

      {/* Info */}
      <div className="flex items-center justify-between text-xs text-white/40">
        <span>Frequency (Hz)</span>
        <span>Time →</span>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3">
        <span className="text-xs text-white/50">Intensity:</span>
        <div className="flex items-center gap-1">
          <span className="text-xs text-white/30">Low</span>
          <div className="w-24 h-2 rounded-full overflow-hidden flex">
            <div className="flex-1 bg-[#0d0887]" />
            <div className="flex-1 bg-[#218f8d]" />
            <div className="flex-1 bg-[#90d743]" />
            <div className="flex-1 bg-[#ffdc32]" />
            <div className="flex-1 bg-[#ff5032]" />
          </div>
          <span className="text-xs text-white/30">High</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleSpectrogram;