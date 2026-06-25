import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const LoadingSpinner = ({ 
  text = 'Analyzing Audio...', 
  subtext = 'Processing audio features and generating prediction',
  progress = null,
}) => {
  const [dots, setDots] = useState('');

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Calculate overall progress
  const getProgressPercent = () => {
    if (!progress) return 0;
    if (progress.type === 'upload') return progress.progress * 0.3;
    if (progress.type === 'processing') return 30 + (progress.progress * 0.7);
    return 0;
  };

  const progressPercent = getProgressPercent();
  const progressStage = progress?.type || 'connecting';

  const stages = [
    { id: 'connecting', label: 'Connecting to server' },
    { id: 'upload', label: 'Uploading audio file' },
    { id: 'processing', label: 'Processing audio features' },
    { id: 'predicting', label: 'Running CNN prediction' },
    { id: 'finalizing', label: 'Generating visualization' },
  ];

  const getCurrentStageIndex = () => {
    if (!progress) return 0;
    if (progress.type === 'upload') return 1;
    if (progress.type === 'processing') return 2;
    if (progress.type === 'predicting') return 3;
    return 4;
  };

  const currentStage = getCurrentStageIndex();

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-dark/95 backdrop-blur-xl">
      {/* Background animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md w-full mx-4">
        {/* Main spinner */}
        <div className="relative w-24 h-24 mb-8">
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent"
            style={{
              borderTopColor: '#7C3AED',
              borderRightColor: '#A78BFA',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />

          {/* Middle ring */}
          <motion.div
            className="absolute inset-3 rounded-full border-4 border-transparent"
            style={{
              borderBottomColor: '#8B5CF6',
              borderLeftColor: '#C4B5FD',
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />

          {/* Inner ring */}
          <motion.div
            className="absolute inset-6 rounded-full border-4 border-transparent"
            style={{
              borderTopColor: '#EC4899',
              borderRightColor: '#F59E0B',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />

          {/* Center pulse */}
          <motion.div
            className="absolute inset-9 rounded-full bg-gradient-to-br from-primary to-secondary"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        {/* Text */}
        <motion.h3
          className="text-xl font-medium text-white/90 mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {text}{dots}
        </motion.h3>

        <motion.p
          className="text-sm text-white/50 mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {subtext}
        </motion.p>

        {/* Progress Bar */}
        <div className="w-full mb-6">
          <div className="flex justify-between text-xs text-white/40 mb-2">
            <span>{progress ? `${Math.round(progressPercent)}%` : 'Starting...'}</span>
            <span>{progress ? progressStage.charAt(0).toUpperCase() + progressStage.slice(1) : 'Connecting'}</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Stage indicators */}
        <div className="w-full space-y-2">
          {stages.map((stage, index) => {
            const isActive = index === currentStage;
            const isCompleted = index < currentStage;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: isActive || isCompleted ? 1 : 0.3,
                  x: 0,
                }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  isActive ? 'bg-white/5' : ''
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  isCompleted 
                    ? 'bg-secondary/20 text-secondary' 
                    : isActive 
                      ? 'bg-primary/20 text-primary-light animate-pulse'
                      : 'bg-white/5 text-white/30'
                }`}>
                  {isCompleted ? '✓' : (index + 1)}
                </div>
                <span className={`text-sm ${
                  isActive 
                    ? 'text-white font-medium' 
                    : isCompleted 
                      ? 'text-white/60' 
                      : 'text-white/30'
                }`}>
                  {stage.label}
                </span>
                {isActive && (
                  <motion.div
                    className="ml-auto w-4 h-4"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Audio waveform mini visualization */}
        <div className="mt-6 flex items-center gap-1 h-8">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 bg-gradient-to-t from-primary/50 to-secondary/50 rounded-full"
              animate={{
                height: [`${20 + Math.random() * 60}%`, `${40 + Math.random() * 60}%`, `${20 + Math.random() * 60}%`],
              }}
              transition={{
                duration: 0.5 + Math.random() * 0.5,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: i * 0.03,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;