import { motion } from 'framer-motion';
import { getGaugeOffset } from '../../utils/helpers';
import { CLASS_COLORS } from '../../utils/constants';

const FatigueGauge = ({ score, predictedClass, confidence }) => {
  // ✅ SAFEGUARD
  const safeScore = typeof score === 'number' ? Math.max(0, Math.min(1, score)) : 0.5;
  const safeClass = predictedClass || 'medium';
  const offset = getGaugeOffset(safeScore);
  const color = CLASS_COLORS[safeClass] || CLASS_COLORS.medium;

  return (
    <div className="flex flex-col items-center py-4">
      <div className="relative w-48 h-24">
        <svg className="w-full h-full" viewBox="0 0 180 90">
          <path
            d="M 20 90 A 70 70 0 0 1 160 90"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="20"
            strokeLinecap="round"
          />
          <motion.path
            d="M 20 90 A 70 70 0 0 1 160 90"
            fill="none"
            stroke={color}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray="220"
            initial={{ strokeDashoffset: 220 }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 font-space text-3xl font-bold">
          {Math.round(safeScore * 100)}%
        </div>
      </div>
      <span className="mt-2 text-sm text-white/70">Fatigue Level</span>
    </div>
  );
};

export default FatigueGauge;