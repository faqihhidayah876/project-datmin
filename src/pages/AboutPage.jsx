import { Server, Code, Layers, Brain, BookOpen } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';

const AboutPage = () => {
  return (
    <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto">
      <h1 className="font-space text-4xl font-bold text-center mb-8 gradient-text">
        About the System
      </h1>

      <GlassCard className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-space text-2xl font-semibold">System Information</h2>
            <p className="text-white/50 text-sm">Technical details about the classification system</p>
          </div>
        </div>

        <div className="space-y-4 text-white/70 leading-relaxed">
          <p>
            <strong className="text-white">Emotional Fatigue Detection System</strong> is a Deep Learning-based 
            classification system developed to analyze human emotional fatigue levels through audio signals. 
            The system uses a <strong className="text-primary-light">CNN architecture with Transfer Learning (YAMNet)</strong> 
            {' '}capable of classifying into 3 fatigue categories.
          </p>
          
          <p>
            The model is trained using audio features such as <strong className="text-secondary">MFCC</strong>, 
            <strong className="text-secondary"> Mel Spectrogram</strong>, 
            <strong className="text-secondary"> Spectral Centroid</strong>, 
            <strong className="text-secondary"> RMS Energy</strong>, and 
            <strong className="text-secondary"> Zero Crossing Rate</strong>. 
            With the XAI approach, the system provides transparency in decision-making through 
            important feature visualizations.
          </p>

          <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-glass-border">
            <div className="flex items-center gap-2 text-sm">
              <Server className="w-4 h-4 text-primary-light" />
              <strong>Backend:</strong> Flask + Hugging Face Spaces
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Code className="w-4 h-4 text-secondary" />
              <strong>Framework:</strong> TensorFlow/Keras
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Layers className="w-4 h-4 text-accent" />
              <strong>Model:</strong> YAMNet + MLP
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Brain className="w-4 h-4 text-accent-2" />
              <strong>Frontend:</strong> React.js + Tailwind CSS
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="font-space text-xl font-semibold mb-4">Model Architecture</h3>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
              YAMNet Embedding (1024-dim) + Acoustic Features (37-dim)
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
              Dense Layer 256 (ReLU + L2 + BatchNorm + Dropout 0.5)
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
              Dense Layer 128 (ReLU + L2 + BatchNorm + Dropout 0.4)
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
              Dense Layer 64 (ReLU + L2 + BatchNorm + Dropout 0.3)
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
              Output Softmax (3 classes: low, medium, high)
            </li>
          </ul>
        </GlassCard>

        <GlassCard>
          <h3 className="font-space text-xl font-semibold mb-4">Audio Features</h3>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-2" />
              RMS Energy (Mean, Std, Max)
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-2" />
              Fundamental Frequency F0 (Mean, Std, Range)
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-2" />
              Zero Crossing Rate & Spectral Centroid
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-2" />
              13 MFCC Coefficients + Mel Spectrogram Stats
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-2" />
              Tempo, Silence Ratio, and Jitter
            </li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
};

export default AboutPage;