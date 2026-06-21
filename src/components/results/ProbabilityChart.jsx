import { motion } from 'framer-motion';
import { CLASSES, CLASS_COLORS, CLASS_LABELS } from '../../utils/constants';

const ProbabilityChart = ({ probabilities }) => {
  const probMap = probabilities.reduce((acc, item) => {
    acc[item.class] = item.probability;
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {CLASSES.map((cls) => (
        <div key={cls} className="flex items-center gap-3">
          <span className="w-20 text-sm font-medium text-white/70 uppercase">
            {cls}
          </span>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${CLASS_COLORS[cls]}, ${cls === 'low' ? '#00B4D8' : cls === 'medium' ? '#FF8E53' : '#FF4757'})`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${probMap[cls] || 0}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            />
          </div>
          <span className="w-16 text-right text-sm font-space text-white/70">
            {(probMap[cls] || 0).toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default ProbabilityChart;