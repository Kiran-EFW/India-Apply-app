import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVoice } from '../contexts/VoiceContext';

const TrackingScreen = () => {
  const navigation = useNavigation();
  const { startListening, stopListening, isListening, transcript } = useVoice();
  const [applications, setApplications] = useState([
    {
      id: '1',
      service: 'Passport Renewal',
      status: 'In Progress',
      date: '2023-06-15',
      statusDetails: 'Police verification in progress',
      progress: 60,
    },
    {
      id: '2',
      service: 'PAN Card Update',
      status: 'Approved',
      date: '2023-05-20',
      statusDetails: 'Card dispatched to your address',
      progress: 100,
    },
    {
      id: '3',
      service: 'Aadhaar Address Update',
      status: 'Submitted',
      date: '2023-06-10',
      statusDetails: 'Application under review',
      progress: 30,
    },
    {
      id: '4',
      service: 'Driving License Renewal',
      status: 'Rejected',
      date: '2023-04-05',
      statusDetails: 'Document verification failed',
      progress: 0,
    },
  ]);

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
      // In a real app, we'd filter applications
      Alert.alert('Passport Applications', 'Showing passport applications');
    } else if (lowerCommand.includes('pan')) {
      Alert.alert('PAN Applications', 'Showing PAN applications');
    } else if (lowerCommand.includes('aadhaar')) {
      Alert.alert('Aadhaar Applications', 'Showing Aadhaar applications');
    } else if (lowerCommand.includes('back') || lowerCommand.includes('home')) {
      navigation.goBack();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return '#10B981';
      case 'In Progress':
        return '#3B82F6';
      case 'Submitted':
        return '#F59E0B';
      case 'Rejected':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const renderApplication = ({ item }: any) => (
    <View style={styles.applicationCard}>
      <View style={styles.applicationHeader}>
        <Text style={styles.applicationService}>{item.service}</Text>
        <Text style={[styles.applicationStatus, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>
      
      <Text style={styles.applicationDate}>Applied on: {item.date}</Text>
      <Text style={styles.applicationDetails}>{item.statusDetails}</Text>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[styles.progressFill, { width: `${item.progress}%` }]} 
          />
        </View>
        <Text style={styles.progressText}>{item.progress}%</Text>
      </View>
      
      <TouchableOpacity style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>View Details</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Application Tracking</Text>
      
      <FlatList
        data={applications}
        renderItem={renderApplication}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.applicationsList}
      />
      
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
  applicationsList: {
    paddingBottom: 20,
  },
  applicationCard: {
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
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  applicationService: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  applicationStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  applicationDate: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  applicationDetails: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 15,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#4B5563',
  },
  detailsButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
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

export default TrackingScreen;
