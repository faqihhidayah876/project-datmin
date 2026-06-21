import { Music, X } from 'lucide-react';
import { formatFileSize } from '../../utils/helpers';
import AudioVisualizer from './AudioVisualizer';

const AudioPreview = ({ file, audioUrl, onRemove }) => {
  return (
    <div className="mt-6 p-6 bg-black/20 rounded-2xl border border-glass-border animate-fadeIn">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-2 rounded-xl flex items-center justify-center">
          <Music className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{file.name}</h4>
          <span className="text-sm text-white/50">{formatFileSize(file.size)}</span>
        </div>
        <button
          onClick={onRemove}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <AudioVisualizer />
      
      <audio
        src={audioUrl}
        controls
        className="w-full h-10 rounded-full mt-2"
      />
    </div>
  );
};

export default AudioPreview;