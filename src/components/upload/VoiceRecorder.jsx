import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Play, Pause, RotateCcw, Save, Volume2, Activity, Timer, AlertCircle } from 'lucide-react';
import { MAX_AUDIO_DURATION } from '../../utils/constants';

const VoiceRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [volume, setVolume] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState('prompt');

  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const animationRef = useRef(null);
  const canvasRef = useRef(null);

  // ✅ GANTI maxDuration ke MAX_AUDIO_DURATION (15 detik)
  const maxDuration = MAX_AUDIO_DURATION;

  // Check microphone permission
  useEffect(() => {
    const checkPermission = async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const result = await navigator.permissions.query({ name: 'microphone' });
          setPermissionStatus(result.state);
          result.addEventListener('change', () => setPermissionStatus(result.state));
        }
      } catch (e) {
        console.log('Permission API not supported');
      }
    };
    checkPermission();
  }, []);

  // Timer
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused, maxDuration]);

  // Visualize volume
  const visualizeVolume = useCallback(() => {
    const analyser = analyserRef.current;
    const canvas = canvasRef.current;
    if (!analyser || !canvas) return;

    const ctx = canvas.getContext('2d');
    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      if (!isRecording) return;

      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      setVolume(average);

      const width = canvas.width;
      const height = canvas.height;
      ctx.fillStyle = 'rgba(10, 10, 26, 0.3)';
      ctx.fillRect(0, 0, width, height);

      const barWidth = width / 64;

      for (let i = 0; i < 64; i++) {
        const value = dataArray[i * 2] / 255;
        const barHeight = value * height * 0.9;
        const x = i * barWidth;
        const y = height - barHeight;

        const hue = 200 + (i / 64) * 160;
        const gradient = ctx.createLinearGradient(x, height, x, y);
        gradient.addColorStop(0, `hsla(${hue}, 70%, 50%, 0.8)`);
        gradient.addColorStop(1, `hsla(${hue + 20}, 80%, 70%, 0.3)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
  }, [isRecording]);

  // Start recording
  const startRecording = async () => {
    try {
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
          channelCount: 1,
        }
      });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') 
          ? 'audio/webm' 
          : 'audio/mp4',
      });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);

        if (onRecordingComplete) {
          const file = new File([blob], `recording-${Date.now()}.webm`, {
            type: mediaRecorder.mimeType,
          });
          onRecordingComplete(file, url);
        }

        stream.getTracks().forEach(track => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setAudioBlob(null);
      setAudioUrl(null);

      visualizeVolume();

    } catch (err) {
      console.error('Recording error:', err);
      setPermissionStatus('denied');
      alert('Microphone access denied. Please allow microphone permission in your browser.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  };

  // Pause/Resume
  const togglePause = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  // Reset
  const resetRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setVolume(0);
    chunksRef.current = [];
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVolumeColor = () => {
    if (volume < 30) return 'bg-secondary';
    if (volume < 70) return 'bg-accent-2';
    return 'bg-accent';
  };

  return (
    <div className="space-y-6">
      {/* Permission Warning */}
      {permissionStatus === 'denied' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-accent/10 border border-accent/30 rounded-xl"
        >
          <div className="flex items-center gap-3 text-accent">
            <Volume2 className="w-5 h-5" />
            <div>
              <p className="font-medium">Microphone Access Denied</p>
              <p className="text-sm text-white/70">
                Please allow microphone access in your browser settings.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Recording Visualizer */}
      <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-glass-border">
        <canvas
          ref={canvasRef}
          width={600}
          height={120}
          className="w-full h-28"
        />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          {isRecording && (
            <>
              <span className={`w-2 h-2 rounded-full animate-pulse ${isPaused ? 'bg-yellow-400' : 'bg-red-500'}`} />
              <span className="px-2 py-1 bg-black/50 rounded-lg text-xs text-white/70 font-mono">
                {isPaused ? 'PAUSED' : 'RECORDING'}
              </span>
            </>
          )}
        </div>

        {isRecording && (
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <Activity className="w-4 h-4 text-white/50" />
            <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full ${getVolumeColor()}`}
                animate={{ width: `${volume}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Timer */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-3 px-6 py-3 bg-black/20 rounded-xl border border-glass-border">
          <Timer className="w-5 h-5 text-white/50" />
          <span className={`font-mono text-2xl font-bold ${
            recordingTime >= maxDuration ? 'text-accent' : 'text-white'
          }`}>
            {formatTime(recordingTime)}
          </span>
          <span className="text-white/30">/ {formatTime(maxDuration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {!isRecording ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startRecording}
            disabled={permissionStatus === 'denied'}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent to-red-500 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-accent/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mic className="w-6 h-6" />
            Start Recording
          </motion.button>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePause}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-glass-border rounded-xl hover:bg-white/20 transition-colors"
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              {isPaused ? 'Resume' : 'Pause'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopRecording}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent to-red-500 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-accent/30 transition-all"
            >
              <Square className="w-5 h-5" />
              Stop
            </motion.button>
          </>
        )}
      </div>

      {/* Playback & Actions */}
      <AnimatePresence>
        {audioUrl && !isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="p-4 bg-black/20 rounded-xl border border-glass-border">
              <audio src={audioUrl} controls className="w-full h-10 rounded-full" />
            </div>

            <div className="flex items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetRecording}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-glass-border rounded-xl hover:bg-white/10 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Record Again
              </motion.button>

              {onRecordingComplete && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const file = new File([audioBlob], `recording-${Date.now()}.webm`, {
                      type: audioBlob.type,
                    });
                    onRecordingComplete(file, audioUrl);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all"
                >
                  <Save className="w-5 h-5" />
                  Use This Recording
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
        <h4 className="text-sm font-medium text-primary-light mb-2">💡 Recording Tips</h4>
        <ul className="text-xs text-white/50 space-y-1">
          <li>• Speak clearly and at a normal pace</li>
          <li>• Minimize background noise</li>
          <li>• Keep microphone 10-15 cm from your mouth</li>
          <li>• Maximum recording duration: <span className="text-accent-2 font-medium">{maxDuration} seconds</span></li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceRecorder;