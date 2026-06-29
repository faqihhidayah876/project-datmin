import { motion } from 'framer-motion';
import { Battery, BatteryMedium, BatteryLow, Activity, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const FatigueEducation = () => {
  const { t } = useApp();

  const levels = [
    {
      id: 'low',
      levelLabel: t('level_low'),
      title: t('low_edu_title'),
      description: t('low_edu_desc'),
      audioFeatures: t('low_audio_features'),
      recommendation: t('low_recommendation'),
      icon: Battery,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      gradientFrom: 'from-emerald-500',
      gradientTo: 'to-teal-400',
      percentage: '0-33%',
    },
    {
      id: 'medium',
      levelLabel: t('level_medium'),
      title: t('medium_edu_title'),
      description: t('medium_edu_desc'),
      audioFeatures: t('medium_audio_features'),
      recommendation: t('medium_recommendation'),
      icon: BatteryMedium,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      gradientFrom: 'from-amber-500',
      gradientTo: 'to-orange-400',
      percentage: '34-66%',
    },
    {
      id: 'high',
      levelLabel: t('level_high'),
      title: t('high_edu_title'),
      description: t('high_edu_desc'),
      audioFeatures: t('high_audio_features'),
      recommendation: t('high_recommendation'),
      icon: BatteryLow,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
      gradientFrom: 'from-rose-500',
      gradientTo: 'to-red-400',
      percentage: '67-100%',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-space text-3xl md:text-4xl font-bold gradient-text-purple mb-4">
          {t('fatigue_edu_title')}
        </h2>
        <p className="text-white/50 max-w-2xl mx-auto leading-relaxed">
          {t('fatigue_edu_subtitle')}
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {levels.map((level, index) => {
          const IconComponent = level.icon;

          return (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="h-full"
            >
              <div className="h-full glass-card group overflow-hidden">
                {/* Icon Header */}
                <div className="relative p-6 pb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${level.gradientFrom} ${level.gradientTo} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Level Badge */}
                  <span className={`inline-block px-3 py-1.5 ${level.bgColor} border ${level.borderColor} rounded-full text-xs font-semibold ${level.color} tracking-wider mb-3`}>
                    {level.levelLabel}
                  </span>

                  {/* Percentage Indicator */}
                  <div className="absolute top-6 right-6">
                    <span className={`text-2xl font-bold ${level.color} font-space`}>
                      {level.percentage}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-6 space-y-4">
                  <h3 className="font-space text-xl font-bold text-white group-hover:text-primary-light transition-colors">
                    {level.title}
                  </h3>

                  <p className="text-sm text-white/60 leading-relaxed">
                    {level.description}
                  </p>

                  {/* Audio Features Box */}
                  <div className={`p-4 rounded-2xl border ${level.borderColor} ${level.bgColor}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className={`w-4 h-4 ${level.color}`} />
                      <span className={`text-xs font-bold ${level.color} tracking-wide`}>
                        Audio Characteristics
                      </span>
                    </div>
                    <p className="text-xs text-white/70 leading-relaxed">
                      {level.audioFeatures}
                    </p>
                  </div>

                  {/* Recommendation */}
                  <div className="flex items-start gap-2 pt-2">
                    <AlertCircle className={`w-4 h-4 ${level.color} mt-0.5 flex-shrink-0`} />
                    <p className="text-xs text-white/60 leading-relaxed">
                      {level.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FatigueEducation;