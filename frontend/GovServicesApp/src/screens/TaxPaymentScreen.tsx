import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVoice } from '../contexts/VoiceContext';
import { useUTR } from '../contexts/UTRContext';

const TaxPaymentScreen = () => {
  const navigation = useNavigation();
  const { startListening, stopListening, isListening, transcript, speak } = useVoice();
  const { generateUTR } = useUTR();
  
  const [paymentType, setPaymentType] = useState('');
  const [amount, setAmount] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [assessmentYear, setAssessmentYear] = useState('');

  const paymentTypes = [
    { id: 'income-tax', name: 'Income Tax', description: 'Pay your income tax dues' },
    { id: 'gst', name: 'GST', description: 'Pay Goods and Services Tax' },
    { id: 'tds', name: 'TDS', description: 'Pay Tax Deducted at Source' },
    { id: 'advance-tax', name: 'Advance Tax', description: 'Pay advance tax' },
  ];

  const handleVoiceCommand = async () => {
    if (isListening) {
      stopListening();
      await processVoiceCommand(transcript);
    } else {
      startListening();
      await speak('Listening for payment commands');
    }
  };

  const processVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('income tax')) {
      setPaymentType('income-tax');
      await speak('Selected Income Tax payment');
    } else if (lowerCommand.includes('gst')) {
      setPaymentType('gst');
      await speak('Selected GST payment');
    } else if (lowerCommand.includes('tds')) {
      setPaymentType('tds');
      await speak('Selected TDS payment');
    } else if (lowerCommand.includes('advance tax')) {
      setPaymentType('advance-tax');
      await speak('Selected Advance Tax payment');
    } else if (lowerCommand.includes('amount')) {
      const amountMatch = command.match(/\d+/);
      if (amountMatch) {
        setAmount(amountMatch[0]);
        await speak(`Amount set to ${amountMatch[0]} rupees`);
      }
    } else if (lowerCommand.includes('pan')) {
      const panMatch = command.match(/[A-Z]{5}\d{4}[A-Z]{1}/);
      if (panMatch) {
        setPanNumber(panMatch[0]);
        await speak(`PAN number set to ${panMatch[0]}`);
      }
    } else if (lowerCommand.includes('pay') || lowerCommand.includes('submit')) {
      handlePayment();
    }
  };

  const handlePayment = async () => {
    if (!paymentType || !amount || !panNumber) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      const utr = await generateUTR({
        amount: parseFloat(amount),
        description: `${paymentType} payment`,
        userId: 'user_123',
      });

      Alert.alert(
        'Payment Successful',
        `UTR Number: ${utr.utrNumber}\nAmount: ₹${amount}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tax Payment</Text>
      
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Select Payment Type</Text>
        <View style={styles.paymentTypes}>
          {paymentTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.paymentTypeCard,
                paymentType === type.id && styles.selectedPaymentType,
              ]}
              onPress={() => setPaymentType(type.id)}
            >
              <Text style={styles.paymentTypeName}>{type.name}</Text>
              <Text style={styles.paymentTypeDescription}>{type.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {paymentType && (
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PAN Number</Text>
              <TextInput
                style={styles.input}
                value={panNumber}
                onChangeText={setPanNumber}
                placeholder="Enter PAN number"
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Assessment Year</Text>
              <TextInput
                style={styles.input}
                value={assessmentYear}
                onChangeText={setAssessmentYear}
                placeholder="e.g., 2024-25"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount (₹)</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter amount"
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
              <Text style={styles.payButtonText}>Pay ₹{amount || '0'}</Text>
            </TouchableOpacity>
          </View>
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
  },
  paymentTypes: {
    marginBottom: 30,
  },
  paymentTypeCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  selectedPaymentType: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  paymentTypeName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 5,
  },
  paymentTypeDescription: {
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
  payButton: {
    backgroundColor: '#10B981',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  payButtonText: {
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

export default TaxPaymentScreen;
