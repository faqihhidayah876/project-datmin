import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { Info } from 'lucide-react';

const generateShapData = (predictedClass) => {
  const features = [
    { key: 'rms', baseValue: 0.33 },
    { key: 'pitch', baseValue: 0.33 },
    { key: 'centroid', baseValue: 0.33 },
    { key: 'zcr', baseValue: 0.33 },
    { key: 'silence', baseValue: 0.33 },
    { key: 'mfcc', baseValue: 0.33 },
    { key: 'mel', baseValue: 0.33 },
    { key: 'tempo', baseValue: 0.33 },
  ];

  const classShapPatterns = {
    low: {
      rms: 0.18, pitch: 0.15, centroid: 0.12, zcr: 0.08,
      silence: -0.14, mfcc: 0.11, mel: 0.09, tempo: 0.07
    },
    medium: {
      rms: 0.05, pitch: 0.02, centroid: 0.14, zcr: 0.11,
      silence: 0.04, mfcc: 0.08, mel: 0.06, tempo: 0.03
    },
    high: {
      rms: -0.12, pitch: -0.15, centroid: 0.03, zcr: 0.05,
      silence: 0.22, mfcc: -0.08, mel: 0.01, tempo: -0.06
    }
  };

  const pattern = classShapPatterns[predictedClass] || classShapPatterns.medium;

  return features.map(f => ({
    ...f,
    shapValue: pattern[f.key] || 0,
    finalValue: f.baseValue + (pattern[f.key] || 0)
  })).sort((a, b) => Math.abs(b.shapValue) - Math.abs(a.shapValue));
};

const ShapExplanation = ({ predictedClass }) => {
  const { t } = useApp();
  const shapData = generateShapData(predictedClass);
  const baseValue = 0.33;
  const maxShap = Math.max(...shapData.map(d => Math.abs(d.shapValue)));

  const getBarColor = (value) => {
    if (value > 0) return 'from-blue-500 to-cyan-400';
    return 'from-orange-500 to-amber-400';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 p-3 bg-secondary/5 border border-secondary/10 rounded-xl">
        <Info className="w-4 h-4 text-secondary-light mt-0.5 flex-shrink-0" />
        <p className="text-xs text-white/50 leading-relaxed">
          {t('shap_explanation')}
        </p>
      </div>

      <div className="flex items-center justify-between text-xs text-white/40 px-1">
        <span>Base value: {baseValue.toFixed(2)}</span>
        <span>Final prediction: {predictedClass.toUpperCase()}</span>
      </div>

      <div className="space-y-2">
        {shapData.map((feature, index) => {
          const isPositive = feature.shapValue > 0;
          const barWidth = (Math.abs(feature.shapValue) / maxShap) * 100;
          
          return (
            <motion.div
              key={feature.key}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.07 }}
              className="flex items-center gap-3"
            >
              <span className="w-28 text-xs text-white/70 text-right truncate">
                {t(`feature_${feature.key}`)}
              </span>
              
              <div className="flex-1 h-5 bg-white/5 rounded-md overflow-hidden relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-white/5" />
                </div>
                
                <motion.div
                  className={`absolute top-0.5 bottom-0.5 rounded-sm bg-gradient-to-r ${getBarColor(feature.shapValue)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: index * 0.07 }}
                  style={{ left: 0 }}
                />
                
                <span className="absolute top-1/2 -translate-y-1/2 left-2 text-[10px] font-mono font-medium text-white/80 z-10">
                  {feature.shapValue > 0 ? '+' : ''}{feature.shapValue.toFixed(3)}
                </span>
              </div>
              
              <div className={`w-5 flex justify-center ${isPositive ? 'text-blue-400' : 'text-orange-400'}`}>
                {isPositive ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 2L10 8H2L6 2Z" fill="currentColor"/>
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 10L2 4H10L6 10Z" fill="currentColor"/>
                  </svg>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-secondary/10 to-primary/10 border border-white/5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-white/40">Feature impact ranking</span>
          <span className="text-white/60 font-mono">
            {shapData[0].key.toUpperCase()} → {shapData[1].key.toUpperCase()} → {shapData[2].key.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShapExplanation;