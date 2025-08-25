import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useVoice } from '../contexts/VoiceContext';
import VoiceFormField from '../components/VoiceFormField';

const ApplicationWorkspace = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { startListening, stopListening, isListening, transcript, speak } = useVoice();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    address: '',
    aadhaarNumber: '',
  });

  const service = route.params?.service || 'passport';

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
    
    if (lowerCommand.includes('next') || lowerCommand.includes('continue')) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    } else if (lowerCommand.includes('previous') || lowerCommand.includes('back')) {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    } else if (lowerCommand.includes('submit') || lowerCommand.includes('finish')) {
      handleSubmit();
    } else if (lowerCommand.includes('home') || lowerCommand.includes('cancel')) {
      navigation.goBack();
    }
  };

  const handleSubmit = () => {
    Alert.alert(
      'Submit Application',
      'Are you sure you want to submit this application?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Submit', 
          onPress: () => {
            Alert.alert('Success', 'Application submitted successfully!');
            navigation.navigate('Home');
          }
        },
      ],
    );
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>Step 1: Personal Information</Text>
      <VoiceFormField
        label="Full Name"
        value={formData.fullName}
        onChangeText={(value) => updateFormData('fullName', value)}
        placeholder="Enter your full name"
      />
      <VoiceFormField
        label="Date of Birth"
        value={formData.dateOfBirth}
        onChangeText={(value) => updateFormData('dateOfBirth', value)}
        placeholder="DD/MM/YYYY"
      />
      <VoiceFormField
        label="Phone Number"
        value={formData.phoneNumber}
        onChangeText={(value) => updateFormData('phoneNumber', value)}
        placeholder="Enter your phone number"
        keyboardType="phone-pad"
      />
      <VoiceFormField
        label="Email Address"
        value={formData.email}
        onChangeText={(value) => updateFormData('email', value)}
        placeholder="Enter your email"
        keyboardType="email-address"
      />
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>Step 2: Address Information</Text>
      <VoiceFormField
        label="Address"
        value={formData.address}
        onChangeText={(value) => updateFormData('address', value)}
        placeholder="Enter your complete address"
      />
      <VoiceFormField
        label="Aadhaar Number"
        value={formData.aadhaarNumber}
        onChangeText={(value) => updateFormData('aadhaarNumber', value)}
        placeholder="Enter your Aadhaar number"
        keyboardType="numeric"
      />
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.stepTitle}>Step 3: Review & Submit</Text>
      <View style={styles.reviewCard}>
        <Text style={styles.reviewTitle}>Application Summary</Text>
        <Text style={styles.reviewText}>Name: {formData.fullName}</Text>
        <Text style={styles.reviewText}>DOB: {formData.dateOfBirth}</Text>
        <Text style={styles.reviewText}>Phone: {formData.phoneNumber}</Text>
        <Text style={styles.reviewText}>Email: {formData.email}</Text>
        <Text style={styles.reviewText}>Address: {formData.address}</Text>
        <Text style={styles.reviewText}>Aadhaar: {formData.aadhaarNumber}</Text>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{service.charAt(0).toUpperCase() + service.slice(1)} Application</Text>
      
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(currentStep / 3) * 100}%` }]} />
      </View>
      
      <Text style={styles.progressText}>Step {currentStep} of 3</Text>
      
      <ScrollView style={styles.formContainer}>
        {renderCurrentStep()}
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        {currentStep > 1 && (
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={() => setCurrentStep(currentStep - 1)}
          >
            <Text style={styles.secondaryButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        
        {currentStep < 3 ? (
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => setCurrentStep(currentStep + 1)}
          >
            <Text style={styles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleSubmit}
          >
            <Text style={styles.primaryButtonText}>Submit Application</Text>
          </TouchableOpacity>
        )}
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
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  formContainer: {
    flex: 1,
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 20,
  },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 15,
  },
  reviewText: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
  },
  voiceButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 20,
    borderRadius: 50,
    alignItems: 'center',
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

export default ApplicationWorkspace;
