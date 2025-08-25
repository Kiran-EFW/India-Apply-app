import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVoice } from '../contexts/VoiceContext';
import { aadhaarService } from '../services/aadhaarService';

interface AppointmentSlot {
  id: string;
  date: string;
  time: string;
  available: boolean;
}

interface AppointmentCenter {
  id: string;
  name: string;
  address: string;
  distance: string;
  slots: AppointmentSlot[];
}

const AadhaarAppointmentScreen = () => {
  const navigation = useNavigation();
  const { startListening, stopListening, isListening, transcript, speak } = useVoice();
  
  const [selectedCenter, setSelectedCenter] = useState<AppointmentCenter | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(null);
  const [showCenterModal, setShowCenterModal] = useState(false);
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [appointmentData, setAppointmentData] = useState({
    purpose: 'biometric_update',
    documents: [] as string[],
    remarks: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for centers
  const centers: AppointmentCenter[] = [
    {
      id: '1',
      name: 'Aadhaar Seva Kendra - Central Mall',
      address: 'Central Mall, MG Road, Bangalore',
      distance: '2.5 km',
      slots: [
        { id: '1', date: '2024-01-15', time: '09:00 AM', available: true },
        { id: '2', date: '2024-01-15', time: '10:00 AM', available: true },
        { id: '3', date: '2024-01-15', time: '11:00 AM', available: false },
        { id: '4', date: '2024-01-16', time: '09:00 AM', available: true },
        { id: '5', date: '2024-01-16', time: '10:00 AM', available: true },
      ],
    },
    {
      id: '2',
      name: 'Aadhaar Seva Kendra - City Center',
      address: 'City Center, Brigade Road, Bangalore',
      distance: '4.1 km',
      slots: [
        { id: '6', date: '2024-01-15', time: '02:00 PM', available: true },
        { id: '7', date: '2024-01-15', time: '03:00 PM', available: true },
        { id: '8', date: '2024-01-16', time: '02:00 PM', available: true },
        { id: '9', date: '2024-01-16', time: '03:00 PM', available: true },
      ],
    },
  ];

  useEffect(() => {
    speak('Welcome to Aadhaar Appointment Booking. Please select a center and time slot.');
  }, []);

  const handleVoiceCommand = async () => {
    if (isListening) {
      stopListening();
      await processVoiceCommand(transcript);
    } else {
      startListening();
      await speak('Listening... Please say your command');
    }
  };

  const processVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('select center') || lowerCommand.includes('choose center')) {
      setShowCenterModal(true);
      await speak('Opening center selection');
    } else if (lowerCommand.includes('select slot') || lowerCommand.includes('choose time')) {
      if (selectedCenter) {
        setShowSlotModal(true);
        await speak('Opening time slot selection');
      } else {
        await speak('Please select a center first');
      }
    } else if (lowerCommand.includes('book') || lowerCommand.includes('confirm')) {
      if (selectedCenter && selectedSlot) {
        await handleBookAppointment();
      } else {
        await speak('Please select both center and time slot first');
      }
    } else if (lowerCommand.includes('back') || lowerCommand.includes('home')) {
      navigation.goBack();
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedCenter || !selectedSlot) {
      Alert.alert('Error', 'Please select both center and time slot');
      return;
    }

    setIsLoading(true);
    try {
      await speak('Booking your appointment');
      
      const appointment = await aadhaarService.bookAppointment({
        centerId: selectedCenter.id,
        slotId: selectedSlot.id,
        date: selectedSlot.date,
        time: selectedSlot.time,
        purpose: appointmentData.purpose,
        documents: appointmentData.documents,
        remarks: appointmentData.remarks,
      });

      await speak('Appointment booked successfully');
      Alert.alert(
        'Success',
        `Appointment booked for ${selectedSlot.date} at ${selectedSlot.time}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      await speak('Failed to book appointment');
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCenterItem = (center: AppointmentCenter) => (
    <TouchableOpacity
      key={center.id}
      style={styles.centerItem}
      onPress={() => {
        setSelectedCenter(center);
        setShowCenterModal(false);
        speak(`Selected ${center.name}`);
      }}
    >
      <Text style={styles.centerName}>{center.name}</Text>
      <Text style={styles.centerAddress}>{center.address}</Text>
      <Text style={styles.centerDistance}>{center.distance}</Text>
    </TouchableOpacity>
  );

  const renderSlotItem = (slot: AppointmentSlot) => (
    <TouchableOpacity
      key={slot.id}
      style={[styles.slotItem, !slot.available && styles.unavailableSlot]}
      onPress={() => {
        if (slot.available) {
          setSelectedSlot(slot);
          setShowSlotModal(false);
          speak(`Selected ${slot.time} on ${slot.date}`);
        }
      }}
      disabled={!slot.available}
    >
      <Text style={[styles.slotTime, !slot.available && styles.unavailableText]}>
        {slot.time}
      </Text>
      <Text style={[styles.slotDate, !slot.available && styles.unavailableText]}>
        {slot.date}
      </Text>
      {!slot.available && (
        <Text style={styles.unavailableLabel}>Unavailable</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aadhaar Appointment Booking</Text>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Center</Text>
          <TouchableOpacity
            style={styles.selectionButton}
            onPress={() => setShowCenterModal(true)}
          >
            <Text style={styles.selectionButtonText}>
              {selectedCenter ? selectedCenter.name : 'Choose Center'}
            </Text>
            <Text style={styles.selectionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {selectedCenter && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Time Slot</Text>
            <TouchableOpacity
              style={styles.selectionButton}
              onPress={() => setShowSlotModal(true)}
            >
              <Text style={styles.selectionButtonText}>
                {selectedSlot ? `${selectedSlot.time} on ${selectedSlot.date}` : 'Choose Time Slot'}
              </Text>
              <Text style={styles.selectionArrow}>›</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appointment Details</Text>
          
          <Text style={styles.label}>Purpose</Text>
          <Text style={styles.value}>Biometric Update</Text>
          
          <Text style={styles.label}>Required Documents</Text>
          <Text style={styles.value}>
            • Aadhaar Card{'\n'}
            • Proof of Address{'\n'}
            • Recent Passport Size Photo
          </Text>
          
          <Text style={styles.label}>Remarks (Optional)</Text>
          <TextInput
            style={styles.remarksInput}
            placeholder="Any special requirements..."
            value={appointmentData.remarks}
            onChangeText={(text) => setAppointmentData({...appointmentData, remarks: text})}
            multiline
          />
        </View>

        {selectedCenter && selectedSlot && (
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Appointment Summary</Text>
            <Text style={styles.summaryText}>Center: {selectedCenter.name}</Text>
            <Text style={styles.summaryText}>Date: {selectedSlot.date}</Text>
            <Text style={styles.summaryText}>Time: {selectedSlot.time}</Text>
            <Text style={styles.summaryText}>Purpose: Biometric Update</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.bookButton,
          (!selectedCenter || !selectedSlot || isLoading) && styles.disabledButton
        ]}
        onPress={handleBookAppointment}
        disabled={!selectedCenter || !selectedSlot || isLoading}
      >
        <Text style={styles.bookButtonText}>
          {isLoading ? 'Booking...' : 'Book Appointment'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.voiceButton, isListening && styles.listeningButton]}
        onPress={handleVoiceCommand}
      >
        <Text style={styles.voiceButtonText}>
          {isListening ? 'Listening...' : 'Tap to Speak'}
        </Text>
      </TouchableOpacity>

      {/* Center Selection Modal */}
      <Modal
        visible={showCenterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCenterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Center</Text>
            <ScrollView>
              {centers.map(renderCenterItem)}
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowCenterModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Slot Selection Modal */}
      <Modal
        visible={showSlotModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSlotModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Time Slot</Text>
            <ScrollView>
              {selectedCenter?.slots.map(renderSlotItem)}
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowSlotModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  selectionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  selectionButtonText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  selectionArrow: {
    fontSize: 18,
    color: '#6B7280',
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 15,
  },
  remarksInput: {
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  summarySection: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 16,
    color: '#1E40AF',
    marginBottom: 5,
  },
  bookButton: {
    backgroundColor: '#10B981',
    paddingVertical: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  voiceButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  listeningButton: {
    backgroundColor: '#10B981',
  },
  voiceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  centerItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  centerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 5,
  },
  centerAddress: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 5,
  },
  centerDistance: {
    fontSize: 12,
    color: '#6B7280',
  },
  slotItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  unavailableSlot: {
    backgroundColor: '#F3F4F6',
    opacity: 0.6,
  },
  slotTime: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  slotDate: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 5,
  },
  unavailableText: {
    color: '#9CA3AF',
  },
  unavailableLabel: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 5,
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  cancelButtonText: {
    color: '#4B5563',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AadhaarAppointmentScreen;
