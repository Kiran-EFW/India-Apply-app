import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVoice } from '../contexts/VoiceContext';

const BiometricAuthScreen = () => {
  const navigation = useNavigation();
  const { startListening, stopListening, isListening, transcript, speak } = useVoice();
  const [biometricType, setBiometricType] = useState<'fingerprint' | 'face' | 'none'>('fingerprint');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      // In a real app, you would use react-native-biometrics or similar library
      // For now, we'll simulate the check
      const hasFingerprint = true; // Mock value
      const hasFaceID = false; // Mock value
      
      if (hasFingerprint) {
        setBiometricType('fingerprint');
        setIsEnabled(true);
      } else if (hasFaceID) {
        setBiometricType('face');
        setIsEnabled(true);
      } else {
        setBiometricType('none');
        setIsEnabled(false);
      }
    } catch (error) {
      console.error('Biometric check error:', error);
      setBiometricType('none');
      setIsEnabled(false);
    }
  };

  const handleVoiceCommand = async () => {
    if (isListening) {
      stopListening();
      await processVoiceCommand(transcript);
    } else {
      startListening();
      await speak('Listening for biometric commands');
    }
  };

  const processVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('enable') || lowerCommand.includes('turn on')) {
      await handleEnableBiometric();
    } else if (lowerCommand.includes('disable') || lowerCommand.includes('turn off')) {
      await handleDisableBiometric();
    } else if (lowerCommand.includes('test') || lowerCommand.includes('try')) {
      await handleTestBiometric();
    } else if (lowerCommand.includes('back') || lowerCommand.includes('home')) {
      navigation.goBack();
    }
  };

  const handleEnableBiometric = async () => {
    if (!isEnabled) {
      Alert.alert('Error', 'Biometric authentication is not available on this device');
      return;
    }

    try {
      setIsAuthenticating(true);
      await speak('Enabling biometric authentication');
      
      // Simulate biometric setup
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await speak('Biometric authentication enabled successfully');
      Alert.alert('Success', 'Biometric authentication has been enabled');
    } catch (error) {
      await speak('Failed to enable biometric authentication');
      Alert.alert('Error', 'Failed to enable biometric authentication');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleDisableBiometric = async () => {
    try {
      await speak('Disabling biometric authentication');
      
      // Simulate biometric removal
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await speak('Biometric authentication disabled');
      Alert.alert('Success', 'Biometric authentication has been disabled');
    } catch (error) {
      await speak('Failed to disable biometric authentication');
      Alert.alert('Error', 'Failed to disable biometric authentication');
    }
  };

  const handleTestBiometric = async () => {
    if (!isEnabled) {
      Alert.alert('Error', 'Biometric authentication is not available');
      return;
    }

    try {
      setIsAuthenticating(true);
      await speak('Testing biometric authentication');
      
      // Simulate biometric authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await speak('Biometric authentication successful');
      Alert.alert('Success', 'Biometric authentication test passed');
    } catch (error) {
      await speak('Biometric authentication failed');
      Alert.alert('Error', 'Biometric authentication test failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const getBiometricIcon = () => {
    switch (biometricType) {
      case 'fingerprint':
        return '👆';
      case 'face':
        return '👤';
      default:
        return '❌';
    }
  };

  const getBiometricText = () => {
    switch (biometricType) {
      case 'fingerprint':
        return 'Fingerprint';
      case 'face':
        return 'Face ID';
      default:
        return 'Not Available';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biometric Authentication</Text>
      
      <View style={styles.biometricCard}>
        <Text style={styles.biometricIcon}>{getBiometricIcon()}</Text>
        <Text style={styles.biometricType}>{getBiometricText()}</Text>
        <Text style={styles.biometricStatus}>
          {isEnabled ? 'Available' : 'Not Available'}
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>What is Biometric Authentication?</Text>
        <Text style={styles.infoText}>
          Biometric authentication uses your unique physical characteristics like fingerprints or facial features to securely access the app. This provides an additional layer of security beyond your password.
        </Text>
      </View>

      <View style={styles.buttonSection}>
        {isEnabled && (
          <>
            <TouchableOpacity
              style={[styles.button, styles.enableButton, isAuthenticating && styles.disabledButton]}
              onPress={handleEnableBiometric}
              disabled={isAuthenticating}
            >
              <Text style={styles.buttonText}>
                {isAuthenticating ? 'Enabling...' : 'Enable Biometric Auth'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.testButton]}
              onPress={handleTestBiometric}
              disabled={isAuthenticating}
            >
              <Text style={styles.buttonText}>Test Authentication</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.disableButton]}
              onPress={handleDisableBiometric}
              disabled={isAuthenticating}
            >
              <Text style={styles.buttonText}>Disable Biometric Auth</Text>
            </TouchableOpacity>
          </>
        )}

        {!isEnabled && (
          <View style={styles.notAvailableSection}>
            <Text style={styles.notAvailableText}>
              Biometric authentication is not available on this device. You can still use the app with your password.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.securityInfo}>
        <Text style={styles.securityTitle}>Security Features</Text>
        <View style={styles.securityItem}>
          <Text style={styles.securityIcon}>🔒</Text>
          <Text style={styles.securityText}>Encrypted biometric data storage</Text>
        </View>
        <View style={styles.securityItem}>
          <Text style={styles.securityIcon}>🛡️</Text>
          <Text style={styles.securityText}>Fallback to password authentication</Text>
        </View>
        <View style={styles.securityItem}>
          <Text style={styles.securityIcon}>⚡</Text>
          <Text style={styles.securityText}>Fast and convenient access</Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={[styles.voiceButton, isListening && styles.listeningButton]}
        onPress={handleVoiceCommand}
      >
        <Text style={styles.voiceButtonText}>
          {isListening ? 'Listening...' : 'Tap to Speak'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  biometricCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  biometricIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  biometricType: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 5,
  },
  biometricStatus: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '500',
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  buttonSection: {
    marginBottom: 20,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  enableButton: {
    backgroundColor: '#10B981',
  },
  testButton: {
    backgroundColor: '#3B82F6',
  },
  disableButton: {
    backgroundColor: '#EF4444',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  notAvailableSection: {
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  notAvailableText: {
    fontSize: 16,
    color: '#92400E',
    lineHeight: 24,
  },
  securityInfo: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 15,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  securityIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  securityText: {
    fontSize: 16,
    color: '#4B5563',
    flex: 1,
  },
  voiceButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 20,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  listeningButton: {
    backgroundColor: '#10B981',
  },
  voiceButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default BiometricAuthScreen;
