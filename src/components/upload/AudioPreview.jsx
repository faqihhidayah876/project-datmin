import { Music, X, FileAudio, Clock } from 'lucide-react';
import { formatFileSize } from '../../utils/helpers';
import AudioVisualizer from './AudioVisualizer';

const AudioPreview = ({ file, audioUrl, onRemove }) => {
  return (
    <div className="mt-6 p-6 bg-black/20 rounded-2xl border border-glass-border animate-fadeIn">
      {/* File info header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-2 rounded-xl flex items-center justify-center">
          <Music className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium truncate">{file.name}</h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-white/50">{formatFileSize(file.size)}</span>
            <span className="text-xs text-white/30">•</span>
            <span className="text-sm text-white/50 flex items-center gap-1">
              <FileAudio className="w-3 h-3" />
              {file.name.endsWith('.wav') ? 'WAV' : 'MP3'}
            </span>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Real Audio Visualizer */}
      <AudioVisualizer audioUrl={audioUrl} file={file} />
    </div>
  );
};

export default AudioPreview;