import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useVoice } from '../contexts/VoiceContext';

const ServiceHubScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { startListening, stopListening, isListening, transcript } = useVoice();
  const [selectedService, setSelectedService] = useState(route.params?.service || null);
  
  const services = [
    {
      id: 'passport',
      name: 'Passport Services',
      description: 'Apply for new passport, renewal, or update details',
      icon: '📄',
    },
    {
      id: 'pan',
      name: 'PAN Card Services',
      description: 'Apply for new PAN, update details, or reprint',
      icon: '💳',
    },
    {
      id: 'aadhaar',
      name: 'Aadhaar Services',
      description: 'Update address, mobile number, or other details',
      icon: '🆔',
    },
    {
      id: 'tax',
      name: 'Tax Services',
      description: 'File ITR, generate UTR, or check refund status',
      icon: '🧾',
    },
    {
      id: 'driving',
      name: 'Driving License',
      description: 'Apply for new license or renewal',
      icon: '🚗',
    },
    {
      id: 'voter',
      name: 'Voter ID',
      description: 'Apply for new voter ID or update details',
      icon: '🗳️',
    },
  ];

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
    
    if (lowerCommand.includes('passport')) {
      setSelectedService('passport');
    } else if (lowerCommand.includes('pan')) {
      setSelectedService('pan');
    } else if (lowerCommand.includes('aadhaar')) {
      setSelectedService('aadhaar');
    } else if (lowerCommand.includes('tax') || lowerCommand.includes('itr')) {
      setSelectedService('tax');
    } else if (lowerCommand.includes('driving') || lowerCommand.includes('license')) {
      setSelectedService('driving');
    } else if (lowerCommand.includes('voter')) {
      setSelectedService('voter');
    } else if (lowerCommand.includes('back') || lowerCommand.includes('home')) {
      navigation.goBack();
    } else if (lowerCommand.includes('start') || lowerCommand.includes('begin')) {
      if (selectedService) {
        navigation.navigate('ApplicationWorkspace', { service: selectedService });
      }
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleStartApplication = () => {
    if (selectedService) {
      navigation.navigate('ApplicationWorkspace', { service: selectedService });
    }
  };

  const selectedServiceData = services.find(service => service.id === selectedService);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Government Services</Text>
      
      <ScrollView style={styles.servicesContainer}>
        {services.map((service) => (
          <TouchableOpacity
            key={service.id}
            style={[
              styles.serviceCard,
              selectedService === service.id && styles.selectedServiceCard,
            ]}
            onPress={() => handleServiceSelect(service.id)}
          >
            <Text style={styles.serviceIcon}>{service.icon}</Text>
            <Text style={styles.serviceName}>{service.name}</Text>
            <Text style={styles.serviceDescription}>{service.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {selectedServiceData && (
        <View style={styles.selectedServiceContainer}>
          <Text style={styles.selectedServiceTitle}>{selectedServiceData.name}</Text>
          <Text style={styles.selectedServiceDesc}>{selectedServiceData.description}</Text>
          
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartApplication}
          >
            <Text style={styles.startButtonText}>Start Application</Text>
          </TouchableOpacity>
        </View>
      )}
      
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
  servicesContainer: {
    flex: 1,
    marginBottom: 20,
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedServiceCard: {
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  serviceIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  selectedServiceContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedServiceTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  selectedServiceDesc: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
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

export default ServiceHubScreen;
