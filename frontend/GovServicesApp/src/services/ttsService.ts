import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const ttsService = {
  async speak(text: string, voiceId?: string): Promise<void> {
    try {
      const response = await axios.post(
        `${API_URL}/elevenlabs/text-to-speech`,
        { text, voiceId },
        {
          responseType: 'blob',
        }
      );

      // In a real app, we would play the audio
      // For now, we'll just log the response
      console.log('TTS response received:', response.data);
    } catch (error) {
      console.error('Error in TTS:', error);
    }
  },

  async getVoices() {
    try {
      const response = await axios.get(`${API_URL}/elevenlabs/voices`);
      return response.data;
    } catch (error) {
      console.error('Error fetching voices:', error);
      return [];
    }
  },
};
