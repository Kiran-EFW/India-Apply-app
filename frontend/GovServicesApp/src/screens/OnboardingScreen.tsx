import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVoice } from '../contexts/VoiceContext';

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const { startListening, stopListening, isListening, transcript } = useVoice();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleVoiceCommand = () => {
    if (isListening) {
      stopListening();
      processVoiceCommand(transcript);
    } else {
      startListening();
    }
  };

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('start') || lowerCommand.includes('begin')) {
      navigation.navigate('Auth');
    } else if (lowerCommand.includes('next')) {
      if (currentPage < 2) {
        setCurrentPage(currentPage + 1);
        scrollViewRef.current?.scrollTo({ x: currentPage * 100, animated: true });
      }
    } else if (lowerCommand.includes('previous')) {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
        scrollViewRef.current?.scrollTo({ x: currentPage * 100, animated: true });
      }
    }
  };

  const handleGetStarted = () => {
    navigation.navigate('Auth');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          setCurrentPage(Math.round(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width));
        }}
      >
        <View style={styles.slide}>
          <Text style={styles.title}>Welcome to GovServices</Text>
          <Text style={styles.description}>
            Your voice-enabled assistant for all government services in India
          </Text>
        </View>
        
        <View style={styles.slide}>
          <Text style={styles.title}>Simple & Fast</Text>
          <Text style={styles.description}>
            Apply for passport, PAN, Aadhaar updates, file taxes, and more with just your voice
          </Text>
        </View>
        
        <View style={styles.slide}>
          <Text style={styles.title}>Secure & Reliable</Text>
          <Text style={styles.description}>
            Your data is encrypted and processed with government-approved security standards
          </Text>
        </View>
      </ScrollView>

      <View style={styles.pagination}>
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            style={[
              styles.paginationDot,
              { backgroundColor: i === currentPage ? '#4F46E5' : '#CBD5E1' },
            ]}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, isListening && styles.listeningButton]}
        onPress={handleVoiceCommand}
      >
        <Text style={styles.buttonText}>
          {isListening ? 'Listening...' : 'Use Voice Assistant'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
        <Text style={styles.getStartedText}>Get Started</Text>
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
  slide: {
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: '#4F46E5',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
    width: '80%',
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
  getStartedButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  getStartedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;
