import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  X, 
  User, 
  Sparkles, 
  Loader2, 
  AlertCircle,
  RefreshCw,
  Heart
} from 'lucide-react';
import { sendMessageToAI } from '../../services/aiChat';
import { useApp } from '../../context/AppContext';
import { isAIConfigValid } from '../../utils/constants';

// Logo SAHAJA AI
const SAHAJA_AI_LOGO = 'https://i.ibb.co.com/jZZ0648R/Logo-SAHAJA-AI.png';

const AIChatAssistant = ({ fatigueData, onClose }) => {
  const { t, language } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check if AI is configured
  useEffect(() => {
    setIsConfigured(isAIConfigValid());
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Add welcome message when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0 && fatigueData) {
      const welcomeMsg = language === 'id'
        ? `Halo! 👋 Saya adalah asisten AI kesehatan mental Anda, hasil kolaborasi dengan SAHAJA AI. Saya sudah melihat hasil analisis kelelahan Anda:

**Tingkat Kelelahan:** ${fatigueData.predictedClass === 'low' ? 'Rendah (Semangat)' : fatigueData.predictedClass === 'medium' ? 'Sedang (Cukup Lelah)' : 'Tinggi (Sangat Lelah)'}
**Confidence:** ${fatigueData.confidence?.toFixed(2)}%

Anda bisa bertanya apa saja tentang kesehatan mental, stres, kelelahan, atau meminta saran personal berdasarkan hasil analisis ini. Bagaimana perasaan Anda hari ini? 😊`
        : `Hello! 👋 I'm your mental health AI assistant, collaborate with SAHAJA AI. I've reviewed your fatigue analysis results:

**Fatigue Level:** ${fatigueData.predictedClass === 'low' ? 'Low (Energetic)' : fatigueData.predictedClass === 'medium' ? 'Medium (Moderately Tired)' : 'High (Very Tired)'}
**Confidence:** ${fatigueData.confidence?.toFixed(2)}%

Feel free to ask anything about mental health, stress, fatigue, or request personalized advice based on these results. How are you feeling today? 😊`;

      setMessages([
        {
          role: 'assistant',
          content: welcomeMsg,
          timestamp: new Date().toISOString(),
        }
      ]);
    }
  }, [isOpen, messages.length, fatigueData, language]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessageToAI(
        userMessage.content,
        fatigueData,
        language,
        messages
      );

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.text,
        timestamp: response.timestamp,
      }]);
    } catch (err) {
      console.error('Chat error:', err);
      setError(err.message || (language === 'id' 
        ? 'Terjadi kesalahan. Silakan coba lagi.'
        : 'An error occurred. Please try again.'
      ));
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ ${err.message || (language === 'id' ? 'Maaf, saya mengalami masalah teknis. Silakan coba lagi nanti.' : 'Sorry, I encountered a technical issue. Please try again later.')}`,
        timestamp: new Date().toISOString(),
        isError: true,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  const suggestedQuestions = language === 'id' ? [
    'Apa arti hasil analisis saya?',
    'Bagaimana cara mengatasi kelelahan ini?',
    'Tips tidur berkualitas',
    'Apakah saya perlu ke dokter?',
    'Teknik relaksasi yang efektif',
  ] : [
    'What does my analysis result mean?',
    'How can I overcome this fatigue?',
    'Tips for quality sleep',
    'Should I see a doctor?',
    'Effective relaxation techniques',
  ];

  const handleSuggestedQuestion = (question) => {
    setInputMessage(question);
    inputRef.current?.focus();
  };

  const formatMessage = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary-light">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 py-0.5 rounded text-xs">$1</code>')
      .replace(/\n/g, '<br />');
  };

  if (!isConfigured) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
          <img 
            src={SAHAJA_AI_LOGO} 
            alt="SAHAJA AI" 
            className="w-12 h-12 object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.parentElement.innerHTML = '<span class="text-2xl">🤖</span>';
            }}
          />
        </div>
        <h3 className="font-space text-lg font-semibold text-white/70 mb-2">
          {language === 'id' ? 'Asisten AI Belum Aktif' : 'AI Assistant Not Active'}
        </h3>
        <p className="text-sm text-white/40 mb-4">
          {language === 'id' 
            ? 'Tambahkan VITE_CEREBRAS_API_KEY di file .env Anda untuk mengaktifkan fitur chat AI.'
            : 'Add VITE_CEREBRAS_API_KEY to your .env file to enable the AI chat feature.'}
        </p>
        <div className="text-xs text-white/30 font-mono bg-black/20 p-3 rounded-lg">
        </div>
      </motion.div>
    );
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-shadow"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          {messages.length > 1 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full text-xs flex items-center justify-center text-white font-bold">
              {messages.filter(m => m.role === 'assistant').length}
            </span>
          )}
        </motion.button>
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-md max-h-[600px] flex flex-col glass-card overflow-hidden shadow-2xl shadow-primary/20"
            style={{ height: 'calc(100vh - 100px)', maxHeight: '600px' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-glass-border bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-white/10">
                  <img 
                    src={SAHAJA_AI_LOGO} 
                    alt="SAHAJA AI" 
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <Sparkles className="w-5 h-5 text-white hidden" />
                </div>
                <div>
                  <h3 className="font-space font-semibold text-white text-sm">
                    {language === 'id' ? 'Asisten Kesehatan AI' : 'AI Health Assistant'}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-white/50">
                      {language === 'id' ? 'Online' : 'Online'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  title={language === 'id' ? 'Bersihkan chat' : 'Clear chat'}
                >
                  <RefreshCw className="w-4 h-4 text-white/50" />
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onClose?.();
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>
            </div>

            {/* Fatigue Context Banner */}
            {fatigueData && (
              <div className="px-4 py-2 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-glass-border">
                <div className="flex items-center gap-2 text-xs">
                  <Heart className="w-3 h-3 text-primary-light" />
                  <span className="text-white/50">
                    {language === 'id' ? 'Konteks: ' : 'Context: '}
                  </span>
                  <span className={`font-semibold ${
                    fatigueData.predictedClass === 'low' ? 'text-green-400' :
                    fatigueData.predictedClass === 'medium' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {fatigueData.predictedClass === 'low' 
                      ? (language === 'id' ? 'Kelelahan Rendah' : 'Low Fatigue')
                      : fatigueData.predictedClass === 'medium'
                      ? (language === 'id' ? 'Kelelahan Sedang' : 'Medium Fatigue')
                      : (language === 'id' ? 'Kelelahan Tinggi' : 'High Fatigue')
                    }
                  </span>
                  <span className="text-white/30">•</span>
                  <span className="text-white/40">
                    {fatigueData.confidence?.toFixed(1)}% confidence
                  </span>
                </div>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center">
                    <img 
                      src={SAHAJA_AI_LOGO} 
                      alt="SAHAJA AI" 
                      className="w-10 h-10 object-contain opacity-30"
                    />
                  </div>
                  <p className="text-sm text-white/30">
                    {language === 'id' 
                      ? 'Mulai percakapan dengan asisten AI...'
                      : 'Start a conversation with the AI assistant...'}
                  </p>
                </div>
              )}

              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-accent to-accent-2'
                      : 'bg-white/10'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <img 
                        src={SAHAJA_AI_LOGO} 
                        alt="SAHAJA AI" 
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    )}
                    <Sparkles className="w-4 h-4 text-white hidden" />
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/20'
                      : message.isError
                      ? 'bg-accent/10 border border-accent/30'
                      : 'bg-white/5 border border-white/10'
                  }`}>
                    <div 
                      className={`text-sm leading-relaxed ${
                        message.isError ? 'text-accent' : 'text-white/80'
                      }`}
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                    <span className="text-[10px] text-white/30 mt-2 block">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
                    <img 
                      src={SAHAJA_AI_LOGO} 
                      alt="SAHAJA AI" 
                      className="w-6 h-6 object-contain animate-pulse"
                    />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-primary-light animate-spin" />
                      <span className="text-sm text-white/50">
                        {language === 'id' ? 'Sedang mengetik...' : 'Typing...'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {messages.length <= 2 && !isLoading && (
              <div className="px-4 py-2 border-t border-glass-border">
                <p className="text-xs text-white/30 mb-2">
                  {language === 'id' ? 'Pertanyaan yang disarankan:' : 'Suggested questions:'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestedQuestion(q)}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/50 hover:bg-primary/10 hover:text-primary-light hover:border-primary/30 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-glass-border">
              {error && (
                <div className="flex items-center gap-2 p-2 mb-3 bg-accent/10 border border-accent/30 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-accent flex-shrink-0" />
                  <span className="text-xs text-accent">{error}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={language === 'id' 
                    ? 'Tanyakan sesuatu tentang kesehatan mental...'
                    : 'Ask something about mental health...'
                  }
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 resize-none max-h-24"
                  rows={1}
                  disabled={isLoading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/30 transition-shadow"
                >
                  <Send className="w-4 h-4 text-white" />
                </motion.button>
              </div>
              <p className="text-[10px] text-white/20 mt-2 text-center">
                {language === 'id' 
                  ? 'Powered by Cerebras AI • Bukan pengganti saran medis profesional'
                  : 'Powered by Cerebras AI • Not a substitute for professional medical advice'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatAssistant;