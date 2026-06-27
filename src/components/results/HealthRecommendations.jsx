import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { 
  Heart, 
  Moon, 
  Droplets, 
  Activity, 
  Coffee, 
  Wind, 
  Sun,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Car,
  Stethoscope,
  MonitorOff,
  Flower2,
  CalendarOff,
  Dumbbell
} from 'lucide-react';

const iconMap = {
  'sleep': Moon,
  'exercise': Dumbbell,
  'hydrate': Droplets,
  'break': Clock,
  'caffeine': Coffee,
  'meditate': Wind,
  'stretch': Activity,
  'nap': Sun,
  'rest': Heart,
  'drive': Car,
  'doctor': Stethoscope,
  'screen': MonitorOff,
  'relax': Flower2,
  'dayoff': CalendarOff,
};

const getIconForTip = (tip, index) => {
  const tipLower = tip.toLowerCase();
  for (const [key, Icon] of Object.entries(iconMap)) {
    if (tipLower.includes(key)) return Icon;
  }
  const fallbacks = [Moon, Activity, Droplets, Clock, Coffee, Wind, Heart, Sun];
  return fallbacks[index % fallbacks.length];
};

const HealthRecommendations = ({ predictedClass }) => {
  const { t } = useApp();

  const configs = {
    low: {
      title: t('health_low_title'),
      description: t('health_low_desc'),
      tips: t('health_low_tips'),
      color: 'green',
      bgGradient: 'from-green-500/10 to-emerald-500/5',
      borderColor: 'border-green-500/20',
      iconColor: 'text-green-400',
      icon: CheckCircle2,
    },
    medium: {
      title: t('health_medium_title'),
      description: t('health_medium_desc'),
      tips: t('health_medium_tips'),
      color: 'yellow',
      bgGradient: 'from-yellow-500/10 to-amber-500/5',
      borderColor: 'border-yellow-500/20',
      iconColor: 'text-yellow-400',
      icon: AlertTriangle,
    },
    high: {
      title: t('health_high_title'),
      description: t('health_high_desc'),
      tips: t('health_high_tips'),
      color: 'red',
      bgGradient: 'from-red-500/10 to-rose-500/5',
      borderColor: 'border-red-500/20',
      iconColor: 'text-red-400',
      icon: AlertTriangle,
    }
  };

  const config = configs[predictedClass] || configs.medium;
  const IconComponent = config.icon;

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-2xl bg-gradient-to-r ${config.bgGradient} border ${config.borderColor}`}
      >
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl bg-${config.color}-500/10`}>
            <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
          </div>
          <div>
            <h4 className={`font-semibold ${config.iconColor} mb-1`}>
              {config.title}
            </h4>
            <p className="text-sm text-white/60 leading-relaxed">
              {config.description}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-2.5">
        {Array.isArray(config.tips) && config.tips.map((tip, index) => {
          const TipIcon = getIconForTip(tip, index);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
            >
              <div className={`p-1.5 rounded-lg bg-${config.color}-500/10 mt-0.5`}>
                <TipIcon className={`w-4 h-4 ${config.iconColor}`} />
              </div>
              <span className="text-sm text-white/70 leading-relaxed">{tip}</span>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-white/40 mb-2">
          <span>Severity Level</span>
          <span className={config.iconColor}>{predictedClass.toUpperCase()}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${
              predictedClass === 'low' ? 'from-green-400 to-emerald-500' :
              predictedClass === 'medium' ? 'from-yellow-400 to-amber-500' :
              'from-red-400 to-rose-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: predictedClass === 'low' ? '33%' : predictedClass === 'medium' ? '66%' : '100%' }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-green-400/60">Low</span>
          <span className="text-[10px] text-yellow-400/60">Medium</span>
          <span className="text-[10px] text-red-400/60">High</span>
        </div>
      </div>
    </div>
  );
};

export default HealthRecommendations;