import React, { createContext, useState, useContext, useEffect } from 'react';
import { ttsService } from '../services/ttsService';

interface VoiceContextType {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  speak: (text: string, voiceId?: string) => Promise<void>;
  voices: any[];
  loadVoices: () => Promise<void>;
}

const VoiceContext = createContext<VoiceContextType>({
  isListening: false,
  transcript: '',
  startListening: () => {},
  stopListening: () => {},
  resetTranscript: () => {},
  speak: async () => {},
  voices: [],
  loadVoices: async () => {},
});

export const VoiceProvider: React.FC = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voices, setVoices] = useState<any[]>([]);

  useEffect(() => {
    // Initialize voice recognition
    // In a real app, we would use @react-native-voice/voice
    // For now, we'll simulate voice recognition
    loadVoices();
  }, []);

  const startListening = async () => {
    try {
      setIsListening(true);
      // Simulate voice recognition
      console.log('Voice recognition started');
    } catch (e) {
      console.error(e);
    }
  };

  const stopListening = async () => {
    try {
      setIsListening(false);
      console.log('Voice recognition stopped');
    } catch (e) {
      console.error(e);
    }
  };

  const resetTranscript = () => {
    setTranscript('');
  };

  const speak = async (text: string, voiceId?: string) => {
    await ttsService.speak(text, voiceId);
  };

  const loadVoices = async () => {
    try {
      const availableVoices = await ttsService.getVoices();
      setVoices(availableVoices);
    } catch (error) {
      console.error('Error loading voices:', error);
    }
  };

  return (
    <VoiceContext.Provider
      value={{
        isListening,
        transcript,
        startListening,
        stopListening,
        resetTranscript,
        speak,
        voices,
        loadVoices,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => useContext(VoiceContext);
