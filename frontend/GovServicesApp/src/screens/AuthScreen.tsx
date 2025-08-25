import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useVoice } from '../contexts/VoiceContext';

const AuthScreen = () => {
  const navigation = useNavigation();
  const { login, register, isLoading } = useAuth();
  const { startListening, stopListening, isListening, transcript, resetTranscript } = useVoice();
  
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleVoiceCommand = () => {
    if (isListening) {
      stopListening();
      processVoiceCommand(transcript);
    } else {
      resetTranscript();
      startListening();
    }
  };

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('login') || lowerCommand.includes('sign in')) {
      setIsLogin(true);
    } else if (lowerCommand.includes('register') || lowerCommand.includes('sign up')) {
      setIsLogin(false);
    } else if (lowerCommand.includes('phone')) {
      const phoneMatch = command.match(/\d{10}/);
      if (phoneMatch) {
        setPhone(phoneMatch[0]);
      }
    } else if (lowerCommand.includes('password')) {
      // In a real app, we'd use a more secure method
      setPassword('voice123');
    } else if (lowerCommand.includes('name')) {
      const nameMatch = command.match(/my name is (\w+)/i);
      if (nameMatch) {
        setName(nameMatch[1]);
      }
    } else if (lowerCommand.includes('submit') || lowerCommand.includes('done')) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        await login(phone, password);
      } else {
        await register({ phone, password, name, email });
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>
      
      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
      )}
      
      {!isLogin && (
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      )}
      
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        style={[styles.button, isListening && styles.listeningButton]}
        onPress={handleVoiceCommand}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isListening ? 'Listening...' : 'Use Voice Assistant'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.submitButtonText}>
          {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  listeningButton: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  switchText: {
    color: '#4F46E5',
    fontSize: 16,
    marginTop: 15,
  },
});

export default AuthScreen;
