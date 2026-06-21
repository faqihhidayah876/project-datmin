import { motion } from 'framer-motion';
// GANTI: Waveform → Activity (atau AudioLines)
import { Activity } from 'lucide-react';

const SpectrogramDisplay = () => {
  return (
    <div>
      <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gradient-to-b from-primary/30 via-secondary/20 to-accent/10">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          }}
        />
        
        {/* Animated wave effect */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* GANTI DI SINI: Waveform → Activity */}
          <Activity className="w-12 h-12 text-white/30" />
          <span className="ml-4 text-white/50">Spectrogram with Attention Map</span>
        </motion.div>

        {/* Simulated frequency bars */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 bg-gradient-to-t from-primary/50 to-secondary/30"
            style={{
              left: `${i * 5}%`,
              width: '4%',
            }}
            animate={{
              height: [`${Math.random() * 30}%`, `${Math.random() * 80 + 20}%`, `${Math.random() * 30}%`],
            }}
            transition={{
              duration: 2 + Math.random(),
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <p className="text-center text-xs text-white/50 mt-2">Spectrogram with Attention Map</p>
    </div>
  );
};

export default SpectrogramDisplay;