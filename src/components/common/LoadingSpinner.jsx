import { motion } from 'framer-motion';

const LoadingSpinner = ({ text = 'Analyzing Audio...', subtext = 'Processing audio features and generating prediction' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-dark/90 backdrop-blur-lg">
      <div className="relative w-20 h-20">
        <motion.div
          className="absolute inset-0 rounded-full border-3 border-transparent border-t-primary border-r-secondary"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute inset-2 rounded-full border-3 border-transparent border-b-accent border-l-accent-2"
          animate={{ rotate: -360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <motion.h3
        className="mt-6 text-lg font-medium text-white/80"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {text}
      </motion.h3>
      <motion.p
        className="mt-2 text-sm text-white/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {subtext}
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;