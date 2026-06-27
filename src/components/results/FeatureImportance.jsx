import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

const FeatureImportance = ({ featureValues }) => {
  const { t } = useApp();
  const safeValues = featureValues || {};

  const features = [
    { key: 'rms', label: t('feature_rms'), gradient: 'from-primary to-primary-light' },
    { key: 'pitch', label: t('feature_pitch'), gradient: 'from-secondary to-cyan-400' },
    { key: 'centroid', label: t('feature_centroid'), gradient: 'from-accent to-orange-400' },
    { key: 'zcr', label: t('feature_zcr'), gradient: 'from-accent-2 to-accent' },
    { key: 'silence', label: t('feature_silence'), gradient: 'from-primary to-secondary' },
  ];

  return (
    <div className="space-y-3 mt-4">
      {features.map((feature, index) => {
        const value = typeof safeValues[feature.key] === 'number' ? safeValues[feature.key] : 0;
        
        return (
          <div key={feature.key} className="flex items-center gap-3">
            <span className="w-28 text-xs text-white/70">{feature.label}</span>
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${feature.gradient}`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(value, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: index * 0.1 }}
              />
            </div>
            <span className="w-10 text-right text-xs font-space text-white/50">
              {value}%
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default FeatureImportance;