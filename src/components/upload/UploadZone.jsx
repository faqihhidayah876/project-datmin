import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileAudio } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';

const UploadZone = ({ onFileSelect }) => {
  const { t } = useApp();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.name.endsWith('.wav') || file.name.endsWith('.mp3')) {
        onFileSelect(file);
      } else {
        alert('Please upload a .wav or .mp3 file');
      }
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/wav': ['.wav'],
      'audio/mpeg': ['.mp3'],
    },
    multiple: false,
  });

  return (
    <motion.div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
        isDragActive
          ? 'border-secondary bg-secondary/5'
          : 'border-glass-border hover:border-primary-light hover:bg-primary/5'
      }`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <input {...getInputProps()} />
      
      <motion.div
        animate={isDragActive ? { y: [0, -10, 0] } : {}}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <UploadCloud className="w-16 h-16 mx-auto mb-4 text-primary-light" />
      </motion.div>
      
      <h3 className="text-xl font-medium mb-2">
        {isDragActive ? 'Drop Audio File Here' : t('drop_title')}
      </h3>
      <p className="text-white/50 mb-4">{t('drop_subtitle')}</p>
      
      <div className="flex justify-center gap-2">
        <span className="px-3 py-1 bg-glass border border-glass-border rounded-full text-xs text-white/70 flex items-center gap-1">
          <FileAudio className="w-3 h-3" /> .wav
        </span>
        <span className="px-3 py-1 bg-glass border border-glass-border rounded-full text-xs text-white/70 flex items-center gap-1">
          <FileAudio className="w-3 h-3" /> .mp3
        </span>
      </div>
    </motion.div>
  );
};

export default UploadZone;