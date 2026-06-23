import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, AlertCircle } from 'lucide-react';

const AudioVisualizer = ({ audioUrl, file }) => {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [audioStats, setAudioStats] = useState({ sampleRate: 44100, channels: 1 });

  // Initialize audio
  useEffect(() => {
    if (!audioUrl) return;

    let audio = null;
    let audioContext = null;
    let source = null;
    let analyser = null;

    const setupAudio = async () => {
      try {
        audio = new Audio(audioUrl);
        audioRef.current = audio;

        // Event listeners
        const handleLoaded = () => {
          setDuration(audio.duration);
          setIsReady(true);
          setAudioStats({
            sampleRate: audio.sampleRate || 44100,
            channels: audio.channelCount || 1,
          });
        };

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleEnded = () => setIsPlaying(false);
        const handleError = (e) => {
          console.error('Audio error:', e);
          setError('Failed to load audio');
        };

        audio.addEventListener('loadedmetadata', handleLoaded);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);

        // Setup Web Audio API
        try {
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
          source = audioContext.createMediaElementSource(audio);
          analyser = audioContext.createAnalyser();
          analyser.fftSize = 256; // Lebih kecil = lebih cepat
          analyser.smoothingTimeConstant = 0.8;

          source.connect(analyser);
          analyser.connect(audioContext.destination);
          analyserRef.current = analyser;
        } catch (err) {
          console.warn('Web Audio API not available:', err);
          // Fallback: tetap bisa play tanpa visualizer
        }

        return () => {
          audio.removeEventListener('loadedmetadata', handleLoaded);
          audio.removeEventListener('timeupdate', handleTimeUpdate);
          audio.removeEventListener('ended', handleEnded);
          audio.removeEventListener('error', handleError);
        };
      } catch (err) {
        console.error('Setup error:', err);
        setError('Failed to initialize audio player');
      }
    };

    const cleanupFn = setupAudio();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      if (audioContext) audioContext.close();
      cleanupFn?.then?.(fn => fn?.());
    };
  }, [audioUrl]);

  // Drawing function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Get frequency data
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);

    const barCount = 48; // Kurangi jumlah bar
    const barWidth = width / barCount;

    // Clear dengan fade effect
    ctx.fillStyle = 'rgba(10, 10, 26, 0.3)';
    ctx.fillRect(0, 0, width, height);

    // Draw bars
    for (let i = 0; i < barCount; i++) {
      const dataIndex = Math.floor((i / barCount) * frequencyData.length);
      const value = frequencyData[dataIndex] / 255;

      const barHeight = value * height * 0.85;
      const x = i * barWidth;
      const y = height - barHeight;

      // Gradient
      const hue = 200 + (i / barCount) * 160;
      const gradient = ctx.createLinearGradient(x, height, x, y);
      gradient.addColorStop(0, `hsla(${hue}, 70%, 50%, 0.8)`);
      gradient.addColorStop(1, `hsla(${hue + 20}, 80%, 70%, 0.3)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x + 1, y, barWidth - 2, barHeight, [3, 3, 0, 0]);
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(draw);
  }, []);

  // Start/stop animation
  useEffect(() => {
    if (isPlaying && analyserRef.current) {
      draw();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isPlaying, draw]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error('Play error:', err);
        setError('Failed to play audio');
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolume = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="p-3 bg-accent/10 border border-accent/30 rounded-xl flex items-center gap-2 text-sm text-accent">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Canvas Visualizer */}
      <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-glass-border">
        <canvas
          ref={canvasRef}
          width={600}
          height={150}
          className="w-full h-36"
        />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2 py-1 bg-black/50 rounded-lg text-xs text-white/70 font-mono">
            {audioStats.sampleRate >= 1000 ? `${(audioStats.sampleRate/1000).toFixed(1)}kHz` : `${audioStats.sampleRate}Hz`}
          </span>
          {isPlaying && <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 p-4 bg-black/20 rounded-xl border border-glass-border">
        <button
          onClick={togglePlay}
          disabled={!isReady}
          className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
        >
          {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
        </button>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/50 font-mono w-10 text-right">{formatTime(currentTime)}</span>
            <div className="flex-1 relative">
              <input
                type="range"
                min={0}
                max={duration || 1}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full"
              />
              <div 
                className="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full pointer-events-none"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs text-white/50 font-mono w-10">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-white/50" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolume}
            className="w-20 h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-white/70 [&::-webkit-slider-thumb]:rounded-full"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-black/20 rounded-xl border border-glass-border text-center">
          <div className="text-xs text-white/50 mb-1">Sample Rate</div>
          <div className="text-sm font-mono text-primary-light">{audioStats.sampleRate >= 1000 ? `${(audioStats.sampleRate/1000).toFixed(1)}kHz` : `${audioStats.sampleRate}Hz`}</div>
        </div>
        <div className="p-3 bg-black/20 rounded-xl border border-glass-border text-center">
          <div className="text-xs text-white/50 mb-1">Channels</div>
          <div className="text-sm font-mono text-secondary">{audioStats.channels === 1 ? 'Mono' : 'Stereo'}</div>
        </div>
        <div className="p-3 bg-black/20 rounded-xl border border-glass-border text-center">
          <div className="text-xs text-white/50 mb-1">Duration</div>
          <div className="text-sm font-mono text-accent">{formatTime(duration)}</div>
        </div>
      </div>
    </div>
  );
};

export default AudioVisualizer;