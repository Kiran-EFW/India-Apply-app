import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVoice } from '../contexts/VoiceContext';

const AadhaarAppointmentScreen = () => {
  const navigation = useNavigation();
  const { startListening, stopListening, isListening, transcript, speak } = useVoice();
  
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const services = [
    { id: 'biometric', name: 'Biometric Update', description: 'Update fingerprints and iris scan' },
    { id: 'photo', name: 'Photo Update', description: 'Update your Aadhaar photo' },
    { id: 'address', name: 'Address Update', description: 'Update your address details' },
    { id: 'mobile', name: 'Mobile Update', description: 'Update mobile number' },
  ];

  const availableDates = [
    { date: '2024-01-15', day: 'Monday', available: true },
    { date: '2024-01-16', day: 'Tuesday', available: true },
    { date: '2024-01-17', day: 'Wednesday', available: false },
    { date: '2024-01-18', day: 'Thursday', available: true },
    { date: '2024-01-19', day: 'Friday', available: true },
  ];

  const availableTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  ];

  const handleVoiceCommand = async () => {
    if (isListening) {
      stopListening();
      await processVoiceCommand(transcript);
    } else {
      startListening();
      await speak('Listening for appointment commands');
    }
  };

  const processVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('biometric')) {
      setSelectedService('biometric');
      await speak('Selected biometric update service');
    } else if (lowerCommand.includes('photo')) {
      setSelectedService('photo');
      await speak('Selected photo update service');
    } else if (lowerCommand.includes('address')) {
      setSelectedService('address');
      await speak('Selected address update service');
    } else if (lowerCommand.includes('mobile')) {
      setSelectedService('mobile');
      await speak('Selected mobile update service');
    } else if (lowerCommand.includes('date')) {
      const dateMatch = command.match(/\d{1,2}\/\d{1,2}\/\d{4}/);
      if (dateMatch) {
        setSelectedDate(dateMatch[0]);
        await speak(`Date set to ${dateMatch[0]}`);
      }
    } else if (lowerCommand.includes('time')) {
      const timeMatch = command.match(/\d{1,2}:\d{2}\s?(AM|PM)/i);
      if (timeMatch) {
        setSelectedTime(timeMatch[0]);
        await speak(`Time set to ${timeMatch[0]}`);
      }
    } else if (lowerCommand.includes('aadhaar')) {
      const aadhaarMatch = command.match(/\d{4}\s\d{4}\s\d{4}/);
      if (aadhaarMatch) {
        setAadhaarNumber(aadhaarMatch[0].replace(/\s/g, ''));
        await speak(`Aadhaar number set to ${aadhaarMatch[0]}`);
      }
    } else if (lowerCommand.includes('book') || lowerCommand.includes('confirm')) {
      handleBookAppointment();
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !aadhaarNumber) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      await speak('Booking your appointment');
      Alert.alert(
        'Appointment Booked',
        `Service: ${selectedService}\nDate: ${selectedDate}\nTime: ${selectedTime}\nAadhaar: ${aadhaarNumber}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to book appointment');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aadhaar Appointment</Text>
      
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Select Service</Text>
        <View style={styles.servicesContainer}>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceCard,
                selectedService === service.id && styles.selectedServiceCard,
              ]}
              onPress={() => setSelectedService(service.id)}
            >
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceDescription}>{service.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedService && (
          <>
            <Text style={styles.sectionTitle}>Enter Details</Text>
            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Aadhaar Number</Text>
                <TextInput
                  style={styles.input}
                  value={aadhaarNumber}
                  onChangeText={setAadhaarNumber}
                  placeholder="XXXX XXXX XXXX"
                  keyboardType="numeric"
                  maxLength={12}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <Text style={styles.sectionTitle}>Select Date</Text>
            <View style={styles.datesContainer}>
              {availableDates.map((date) => (
                <TouchableOpacity
                  key={date.date}
                  style={[
                    styles.dateCard,
                    selectedDate === date.date && styles.selectedDateCard,
                    !date.available && styles.unavailableDateCard,
                  ]}
                  onPress={() => date.available && setSelectedDate(date.date)}
                  disabled={!date.available}
                >
                  <Text style={styles.dateDay}>{date.day}</Text>
                  <Text style={styles.dateDate}>{date.date}</Text>
                  {!date.available && <Text style={styles.unavailableText}>Full</Text>}
                </TouchableOpacity>
              ))}
            </View>

            {selectedDate && (
              <>
                <Text style={styles.sectionTitle}>Select Time</Text>
                <View style={styles.timesContainer}>
                  {availableTimes.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeCard,
                        selectedTime === time && styles.selectedTimeCard,
                      ]}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text style={styles.timeText}>{time}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity style={styles.bookButton} onPress={handleBookAppointment}>
                  <Text style={styles.bookButtonText}>Book Appointment</Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </ScrollView>

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
  content: {
    flex: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 15,
    marginTop: 20,
  },
  servicesContainer: {
    marginBottom: 20,
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedServiceCard: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
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
  formSection: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  datesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedDateCard: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  unavailableDateCard: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  dateDay: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  dateDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  unavailableText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    width: '48%',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedTimeCard: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  bookButton: {
    backgroundColor: '#10B981',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 18,
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

export default AadhaarAppointmentScreen;
