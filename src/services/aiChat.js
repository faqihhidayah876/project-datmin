import { CEREBRAS_API_KEY, CEREBRAS_API_URL } from '../utils/constants';

/**
 * Generate system prompt based on fatigue classification results
 */
const generateSystemPrompt = (fatigueData, language = 'en') => {
  const { predictedClass, confidence, features, probabilities } = fatigueData;
  
  const classLabels = {
    low: language === 'id' ? 'Rendah (Semangat)' : 'Low (Energetic)',
    medium: language === 'id' ? 'Sedang (Cukup Lelah)' : 'Medium (Moderately Tired)',
    high: language === 'id' ? 'Tinggi (Sangat Lelah)' : 'High (Very Tired)',
  };

  const probInfo = probabilities?.map(p => 
    `${p.class}: ${p.probability.toFixed(2)}%`
  ).join(', ') || 'N/A';

  const featureInfo = features ? Object.entries(features)
    .map(([k, v]) => `${k}: ${v}%`)
    .join(', ') : 'N/A';

  const basePrompt = language === 'id' 
    ? `Anda adalah SAHAJA AI, Health Asistant untuk 'Explainable AI' yang ditugaskan untuk menjawab seputar kesehatan mental yang berpengetahuan luas dan penuh perhatian. Anda sedang berbicara dengan seseorang yang baru saja menyelesaikan analisis kelelahan emosional berbasis audio.

KONTEKS HASIL ANALISIS:
- Tingkat Kelelahan: ${classLabels[predictedClass]}
- Confidence: ${confidence?.toFixed(2)}%
- Distribusi Probabilitas: ${probInfo}
- Fitur Audio: ${featureInfo}

PANDUAN PERILAKU:
1. Anda HARUS selalu merujuk hasil analisis di atas dalam setiap respons Anda
2. Berikan saran yang PERSONAL dan SPESIFIK berdasarkan tingkat kelelahan yang terdeteksi
3. Gunakan bahasa yang hangat, empati, dan mendukung
4. Jika user bertanya tentang kesehatan mental, stres, atau kelelahan, hubungkan dengan hasil analisis mereka
5. Anda boleh memberikan saran praktis tentang: tidur, nutrisi, olahraga, manajemen stres, teknik relaksasi, dan produktivitas
6. JANGAN memberikan diagnosis medis formal - selalu sertakan disclaimer bahwa ini bukan pengganti konsultasi dokter
7. Jika user mengeluhkan gejala serius, arahkan untuk mencari bantuan profesional
8. Gunakan emoji sesekali untuk membuat percakapan lebih ramah
9. Bahasa respons: Bahasa Indonesia

INGAT: User ini sedang dalam kondisi ${classLabels[predictedClass]}. Sesuaikan nada dan saran Anda dengan kondisi tersebut.`
    : `You are a knowledgeable and caring mental health AI assistant. You are talking to someone who has just completed an emotional fatigue analysis based on their audio.

ANALYSIS RESULTS CONTEXT:
- Fatigue Level: ${classLabels[predictedClass]}
- Confidence: ${confidence?.toFixed(2)}%
- Probability Distribution: ${probInfo}
- Audio Features: ${featureInfo}

BEHAVIOR GUIDELINES:
1. You MUST always reference the analysis results above in every response
2. Provide PERSONAL and SPECIFIC advice based on the detected fatigue level
3. Use warm, empathetic, and supportive language
4. If user asks about mental health, stress, or fatigue, connect it with their analysis results
5. You may give practical advice about: sleep, nutrition, exercise, stress management, relaxation techniques, and productivity
6. DO NOT give formal medical diagnosis - always include disclaimer that this is not a substitute for professional medical advice
7. If user complains about serious symptoms, direct them to seek professional help
8. Use emojis occasionally to make conversation more friendly
9. Response language: English

REMEMBER: This user is currently in ${classLabels[predictedClass]} condition. Adjust your tone and advice accordingly.`;

  return basePrompt;
};

/**
 * Send message to Cerebras AI and get response
 */
export const sendMessageToAI = async (message, fatigueData, language = 'en', chatHistory = []) => {
  if (!CEREBRAS_API_KEY) {
    throw new Error(language === 'id' 
      ? 'Kunci API Cerebras belum dikonfigurasi. Silakan tambahkan VITE_CEREBRAS_API_KEY di file .env Anda.'
      : 'Cerebras API key not configured. Please add VITE_CEREBRAS_API_KEY to your .env file.'
    );
  }

  const systemPrompt = generateSystemPrompt(fatigueData, language);
  
  // Format chat history for Cerebras (OpenAI-compatible format)
  const messages = [
    { role: 'system', content: systemPrompt },
    ...chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    })),
    { role: 'user', content: message }
  ];

  try {
    const response = await fetch(CEREBRAS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CEREBRAS_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gemma-4-31b', // Model Cerebras (bisa diganti: llama3.1-70b, etc)
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || 
        `API Error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Unknown API error');
    }

    // Extract text from Cerebras response (OpenAI-compatible format)
    const assistantMessage = data.choices?.[0]?.message;
    if (!assistantMessage || !assistantMessage.content) {
      throw new Error(language === 'id' 
        ? 'Tidak ada respons dari AI. Silakan coba lagi.'
        : 'No response from AI. Please try again.'
      );
    }

    return {
      text: assistantMessage.content,
      role: 'assistant',
      timestamp: new Date().toISOString(),
    };

  } catch (error) {
    console.error('Cerebras AI Chat Error:', error);
    throw error;
  }
};

export default { sendMessageToAI };