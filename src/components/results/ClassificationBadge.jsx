import { motion } from 'framer-motion';
import { CLASS_LABELS, CLASS_BADGE_STYLES } from '../../utils/constants';

const ClassificationBadge = ({ predictedClass, confidence }) => {
  const badgeStyle = CLASS_BADGE_STYLES[predictedClass] || CLASS_BADGE_STYLES.medium;

  return (
    <div className="text-center p-6 bg-black/20 rounded-2xl mt-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={`inline-block px-6 py-2 rounded-full font-semibold border ${badgeStyle}`}
      >
        {CLASS_LABELS[predictedClass] || 'Unknown'}
      </motion.div>
      
      <div className="mt-4">
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg, ${predictedClass === 'low' ? '#00D4AA' : predictedClass === 'medium' ? '#FFB347' : '#FF6B9D'}, ${predictedClass === 'low' ? '#00B4D8' : predictedClass === 'medium' ? '#FF8E53' : '#FF4757'})`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-white/50">
          <span>Confidence</span>
          <span>{confidence.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
};

export default ClassificationBadge;