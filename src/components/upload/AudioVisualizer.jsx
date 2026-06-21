import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { generateRandomBars } from '../../utils/helpers';

const AudioVisualizer = ({ isPlaying = true }) => {
  const bars = useMemo(() => generateRandomBars(40), []);

  return (
    <div className="h-16 flex items-end justify-center gap-1 my-4">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className="w-1 bg-gradient-to-t from-primary to-secondary rounded-full"
          animate={isPlaying ? {
            height: [`${bar.height * 0.3}%`, `${bar.height}%`, `${bar.height * 0.3}%`],
          } : { height: '10%' }}
          transition={{
            duration: bar.duration,
            repeat: Infinity,
            repeatType: 'reverse',
            delay: bar.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default AudioVisualizer;