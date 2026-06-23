import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Activity, ZoomIn, ZoomOut, Maximize2, AlertTriangle } from 'lucide-react';
import { extractFrequencyData, generateMelSpectrogram, getSpectrogramColor } from '../../utils/audioAnalysis';

const SpectrogramDisplay = ({ audioUrl }) => {
  const canvasRef = useRef(null);
  const [spectrogramData, setSpectrogramData] = useState(null);
  const [melSpectrogram, setMelSpectrogram] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState(0);
  const [viewMode, setViewMode] = useState('linear');
  const [hoverInfo, setHoverInfo] = useState(null);
  const abortRef = useRef(false);

  // Cleanup function
  const cleanup = useCallback(() => {
    abortRef.current = true;
  }, []);

  // Process audio dengan timeout protection
  useEffect(() => {
    if (!audioUrl) {
      setSpectrogramData(null);
      setMelSpectrogram(null);
      setError(null);
      return;
    }

    abortRef.current = false;
    let timeoutId = null;

    const processAudio = async () => {
      setIsLoading(true);
      setError(null);
      setProgress(0);

      try {
        // Fetch audio dengan timeout
        const controller = new AbortController();
        timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(audioUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        const blob = await response.blob();
        const file = new File([blob], 'audio.wav', { type: 'audio/wav' });

        // Decode audio
        const arrayBuffer = await file.arrayBuffer();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Timeout untuk decode
        const decodePromise = audioContext.decodeAudioData(arrayBuffer);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Decode timeout')), 5000)
        );

        const audioBuffer = await Promise.race([decodePromise, timeoutPromise]);

        if (abortRef.current) return;

        // Extract frequency data dengan progress callback
        const freqData = await extractFrequencyData(
          audioBuffer, 
          (prog) => {
            if (!abortRef.current) setProgress(prog);
          }
        );

        if (abortRef.current) return;

        setSpectrogramData(freqData);

        // Generate mel spectrogram (lebih ringan)
        const melData = generateMelSpectrogram(freqData, 40); // 40 mels saja

        if (abortRef.current) return;

        setMelSpectrogram(melData);

        audioContext.close();

      } catch (err) {
        if (!abortRef.current) {
          console.error('Spectrogram error:', err);
          setError(err.message || 'Failed to process audio');
        }
      } finally {
        if (!abortRef.current) {
          setIsLoading(false);
        }
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    // Delay sedikit agar tidak freeze saat render
    const delayId = setTimeout(processAudio, 100);

    return () => {
      abortRef.current = true;
      clearTimeout(delayId);
      if (timeoutId) clearTimeout(timeoutId);
      cleanup();
    };
  }, [audioUrl, cleanup]);

  // Draw spectrogram
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const data = viewMode === 'mel' ? melSpectrogram : spectrogramData;

    // Clear canvas
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!data || data.length === 0) {
      // Placeholder text
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(audioUrl ? 'Processing spectrogram...' : 'Upload audio to generate spectrogram', canvas.width / 2, canvas.height / 2);
      return;
    }

    const width = canvas.width;
    const height = canvas.height;
    const numFrames = data.length;
    const numFreqBins = data[0].length;

    // Calculate visible range
    const visibleFrames = Math.max(1, Math.floor(numFrames / zoom));
    const startFrame = Math.min(Math.floor(offset * (numFrames - visibleFrames)), numFrames - visibleFrames);
    const endFrame = Math.min(startFrame + visibleFrames, numFrames);

    const frameWidth = (width - 40) / (endFrame - startFrame);
    const binHeight = (height - 20) / numFreqBins;

    // Draw spectrogram - optimized
    const imageData = ctx.createImageData(width, height);
    const pixels = imageData.data;

    for (let f = startFrame; f < endFrame; f++) {
      const frame = data[f];
      const x = Math.floor(40 + (f - startFrame) * frameWidth);

      for (let b = 0; b < numFreqBins; b++) {
        const value = frame[b];
        const y = Math.floor(height - 20 - (b + 1) * binHeight);

        const [r, g, bColor] = getSpectrogramColor(value);

        // Fill pixel block
        for (let px = 0; px < Math.ceil(frameWidth); px++) {
          for (let py = 0; py < Math.ceil(binHeight); py++) {
            const pixelX = x + px;
            const pixelY = y + py;
            if (pixelX < width && pixelY < height - 20 && pixelX >= 40 && pixelY >= 0) {
              const idx = (pixelY * width + pixelX) * 4;
              pixels[idx] = Math.floor(r * 255);
              pixels[idx + 1] = Math.floor(g * 255);
              pixels[idx + 2] = Math.floor(bColor * 255);
              pixels[idx + 3] = Math.floor(200 + value * 55); // Alpha
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

    const freqLabels = viewMode === 'mel' 
      ? [0, 500, 1000, 2000, 4000, 8000] 
      : [0, 2000, 4000, 6000, 8000, 10000];

    for (const freq of freqLabels) {
      const y = height - 20 - (freq / (viewMode === 'mel' ? 8000 : 10000)) * (height - 20);
      if (y > 0) {
        ctx.fillText(`${freq >= 1000 ? (freq/1000) + 'k' : freq}`, 35, y + 3);
      }
    }

  }, [spectrogramData, melSpectrogram, viewMode, zoom, offset, audioUrl]);

  // Mouse interaction
  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas || !spectrogramData) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const data = viewMode === 'mel' ? melSpectrogram : spectrogramData;
    const numFrames = data.length;
    const numFreqBins = data[0].length;

    const visibleFrames = Math.floor(numFrames / zoom);
    const startFrame = Math.floor(offset * (numFrames - visibleFrames));

    const frameIndex = Math.floor(startFrame + ((x - 40) / (canvas.width - 40)) * visibleFrames);
    const freqBin = Math.floor((1 - (y / (canvas.height - 20))) * numFreqBins);

    if (frameIndex >= 0 && frameIndex < numFrames && freqBin >= 0 && freqBin < numFreqBins) {
      const value = data[frameIndex][freqBin];
      const time = (frameIndex / numFrames) * 5; // Approximate
      const freq = (freqBin / numFreqBins) * (viewMode === 'mel' ? 8000 : 10000);

      setHoverInfo({
        x: e.clientX,
        y: e.clientY,
        time: time.toFixed(2),
        frequency: freq >= 1000 ? `${(freq/1000).toFixed(1)}kHz` : `${freq.toFixed(0)}Hz`,
        magnitude: (value * 100).toFixed(1),
      });
    }
  }, [spectrogramData, melSpectrogram, viewMode, zoom, offset]);

  const handleMouseLeave = () => setHoverInfo(null);
  const handleZoomIn = () => setZoom(prev => Math.min(prev * 2, 8));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 2, 1));
  const handleReset = () => { setZoom(1); setOffset(0); };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('linear')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'linear' 
                ? 'bg-primary/20 text-primary-light border border-primary/30' 
                : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
            }`}
          >
            Linear
          </button>
          <button
            onClick={() => setViewMode('mel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              viewMode === 'mel' 
                ? 'bg-primary/20 text-primary-light border border-primary/30' 
                : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
            }`}
          >
            Mel Scale
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleZoomOut} disabled={zoom <= 1} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-white/50 font-mono w-12 text-center">{zoom}x</span>
          <button onClick={handleZoomIn} disabled={zoom >= 8} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={handleReset} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Spectrogram Canvas */}
      <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-glass-border">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
            <motion.div
              className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <span className="mt-3 text-sm text-white/70">Processing spectrogram...</span>
            <div className="mt-2 w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                animate={{ width: `${progress}%` }}
              />
            </div>
            <span className="mt-1 text-xs text-white/40">{progress}%</span>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
            <AlertTriangle className="w-10 h-10 text-accent mb-3" />
            <span className="text-sm text-accent font-medium">Processing Failed</span>
            <span className="text-xs text-white/50 mt-1 max-w-xs text-center">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="mt-3 px-4 py-2 bg-white/10 rounded-lg text-xs hover:bg-white/20 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={800}
          height={250}
          className="w-full h-60 cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        {/* Hover tooltip */}
        {hoverInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed z-50 pointer-events-none bg-black/90 backdrop-blur-xl border border-glass-border rounded-lg p-2 shadow-2xl"
            style={{ left: hoverInfo.x + 10, top: hoverInfo.y - 50 }}
          >
            <div className="space-y-0.5 text-xs">
              <div className="text-white/50">Time: <span className="text-primary-light">{hoverInfo.time}s</span></div>
              <div className="text-white/50">Freq: <span className="text-secondary">{hoverInfo.frequency}</span></div>
              <div className="text-white/50">Mag: <span className="text-accent">{hoverInfo.magnitude}%</span></div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4">
        <span className="text-xs text-white/50">Intensity:</span>
        <div className="flex items-center gap-1">
          <span className="text-xs text-white/30">Low</span>
          <div className="w-28 h-2.5 rounded-full overflow-hidden flex">
            {Array.from({ length: 20 }).map((_, i) => {
              const [r, g, b] = getSpectrogramColor(i / 19);
              return (
                <div key={i} className="flex-1 h-full" style={{ backgroundColor: `rgb(${Math.floor(r*255)}, ${Math.floor(g*255)}, ${Math.floor(b*255)})` }} />
              );
            })}
          </div>
          <span className="text-xs text-white/30">High</span>
        </div>
      </div>
    </div>
  );
};

export default SpectrogramDisplay;