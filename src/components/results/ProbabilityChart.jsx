import { motion } from 'framer-motion';
import { CLASSES, CLASS_COLORS } from '../../utils/constants';
import { useApp } from '../../context/AppContext';

const ProbabilityChart = ({ probabilities }) => {
  const { t } = useApp();

  if (!probabilities || !Array.isArray(probabilities)) {
    return (
      <div className="p-4 text-center text-white/50 text-sm">
        Probability data not available
      </div>
    );
  }

  const probMap = probabilities.reduce((acc, item) => {
    if (item && item.class) {
      acc[item.class] = typeof item.probability === 'number' ? item.probability : 0;
    }
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {CLASSES.map((cls) => {
        const prob = probMap[cls] || 0;
        const color = CLASS_COLORS[cls] || '#888';
        const gradientEnd = cls === 'low' ? '#00B4D8' : cls === 'medium' ? '#FF8E53' : '#FF4757';

        return (
          <div key={cls} className="flex items-center gap-3">
            <span className="w-20 text-sm font-medium text-white/70 uppercase">
              {t(cls)}
            </span>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${color}, ${gradientEnd})`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(prob, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              />
            </div>
            <span className="w-16 text-right text-sm font-space text-white/70">
              {prob.toFixed(2)}%
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ProbabilityChart;