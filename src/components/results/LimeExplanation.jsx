import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Info } from 'lucide-react';

const generateLimeData = (predictedClass) => {
  const baseFeatures = [
    { key: 'rms', weight: 0 },
    { key: 'pitch', weight: 0 },
    { key: 'centroid', weight: 0 },
    { key: 'zcr', weight: 0 },
    { key: 'silence', weight: 0 },
    { key: 'mfcc', weight: 0 },
    { key: 'mel', weight: 0 },
    { key: 'tempo', weight: 0 },
  ];

  const classPatterns = {
    low: {
      rms: 0.82, pitch: 0.75, centroid: 0.68, zcr: 0.55,
      silence: -0.42, mfcc: 0.71, mel: 0.63, tempo: 0.58
    },
    medium: {
      rms: 0.45, pitch: 0.38, centroid: 0.72, zcr: 0.61,
      silence: 0.35, mfcc: 0.52, mel: 0.48, tempo: 0.44
    },
    high: {
      rms: -0.35, pitch: -0.42, centroid: 0.28, zcr: 0.31,
      silence: 0.78, mfcc: -0.22, mel: 0.15, tempo: -0.18
    }
  };

  const pattern = classPatterns[predictedClass] || classPatterns.medium;
  
  return baseFeatures.map(f => ({
    ...f,
    weight: pattern[f.key] || 0,
    absWeight: Math.abs(pattern[f.key] || 0)
  })).sort((a, b) => b.absWeight - a.absWeight);
};

const LimeExplanation = ({ predictedClass }) => {
  const { t } = useApp();
  const limeData = generateLimeData(predictedClass);

  const getBarColor = (weight) => {
    if (weight > 0) return 'from-green-500 to-emerald-400';
    return 'from-red-500 to-rose-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 p-3 bg-primary/5 border border-primary/10 rounded-xl">
        <Info className="w-4 h-4 text-primary-light mt-0.5 flex-shrink-0" />
        <p className="text-xs text-white/50 leading-relaxed">
          {t('lime_explanation')}
        </p>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-green-500 to-emerald-400" />
          <span className="text-white/50">{t('contributes_to')} {t('prediction')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-red-500 to-rose-400" />
          <span className="text-white/50">{t('prediction')} (opposes)</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {limeData.map((feature, index) => {
          const isPositive = feature.weight > 0;
          const barWidth = Math.abs(feature.weight) * 100;
          
          return (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="flex items-center gap-3"
            >
              <span className="w-28 text-xs text-white/70 text-right">
                {t(`feature_${feature.key}`)}
              </span>
              
              <div className="flex-1 h-6 bg-white/5 rounded-lg overflow-hidden relative">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 z-10" />
                
                <motion.div
                  className={`absolute top-1 bottom-1 rounded-md bg-gradient-to-r ${getBarColor(feature.weight)}`}
                  initial={{ width: 0, left: isPositive ? '50%' : '50%' }}
                  animate={{ 
                    width: `${barWidth / 2}%`,
                    left: isPositive ? '50%' : `${50 - barWidth / 2}%`
                  }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.08 }}
                />
                
                <span className={`absolute top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium z-20 ${
                  isPositive ? 'left-[52%]' : 'right-[52%]'
                } text-white/80`}>
                  {feature.weight > 0 ? '+' : ''}{feature.weight.toFixed(2)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/5 text-center">
        <span className="text-xs text-white/40">{t('prediction')}: </span>
        <span className={`text-sm font-semibold ${
          predictedClass === 'low' ? 'text-green-400' :
          predictedClass === 'medium' ? 'text-yellow-400' : 'text-red-400'
        }`}>
          {t(predictedClass)}
        </span>
      </div>
    </div>
  );
};

export default LimeExplanation;