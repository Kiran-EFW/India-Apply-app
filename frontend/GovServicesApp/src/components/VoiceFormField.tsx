import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useVoice } from '../contexts/VoiceContext';

interface VoiceFormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}

const VoiceFormField: React.FC<VoiceFormFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
}) => {
  const { startListening, stopListening, isListening, transcript, speak } = useVoice();
  const [isListeningField, setIsListeningField] = useState(false);

  const handleVoiceInput = async () => {
    if (isListening) {
      stopListening();
      setIsListeningField(false);
      if (transcript) {
        onChangeText(transcript);
        await speak(`I heard ${transcript}. Is that correct?`);
      }
    } else {
      setIsListeningField(true);
      await speak(`Please say your ${label}`);
      startListening();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          keyboardType={keyboardType}
        />
        <TouchableOpacity
          style={[styles.voiceButton, (isListening && isListeningField) && styles.listeningButton]}
          onPress={handleVoiceInput}
        >
          <Text style={styles.voiceButtonText}>🎤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  voiceButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  listeningButton: {
    backgroundColor: '#10B981',
  },
  voiceButtonText: {
    fontSize: 20,
  },
});

export default VoiceFormField;
