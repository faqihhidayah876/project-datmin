export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// HAPUS getGaugeScore dari sini jika sudah pindah ke constants.js
// export const getGaugeScore = (className) => {
//   const scoreMap = { low: 0.2, medium: 0.5, high: 0.8 };
//   return scoreMap[className] || 0.5;
// };

export const getGaugeOffset = (score) => {
  const circumference = 220;
  return circumference - (circumference * score);
};

export const generateRandomBars = (count = 40) => {
  return Array.from({ length: count }, () => ({
    height: Math.random() * 80 + 20,
    delay: Math.random() * 2,
    duration: 0.5 + Math.random() * 0.5,
  }));
};