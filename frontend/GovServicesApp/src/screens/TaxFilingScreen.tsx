import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVoice } from '../contexts/VoiceContext';

const TaxFilingScreen = () => {
  const navigation = useNavigation();
  const { startListening, stopListening, isListening, transcript, speak } = useVoice();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    panNumber: '',
    assessmentYear: '',
    name: '',
    dateOfBirth: '',
    address: '',
    income: '',
    deductions: '',
    taxPaid: '',
  });

  const assessmentYears = [
    '2024-25', '2023-24', '2022-23', '2021-22', '2020-21'
  ];

  const handleVoiceCommand = async () => {
    if (isListening) {
      stopListening();
      await processVoiceCommand(transcript);
    } else {
      startListening();
      await speak('Listening for tax filing commands');
    }
  };

  const processVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('next') || lowerCommand.includes('continue')) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        await speak(`Moving to step ${currentStep + 1}`);
      }
    } else if (lowerCommand.includes('previous') || lowerCommand.includes('back')) {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
        await speak(`Moving to step ${currentStep - 1}`);
      }
    } else if (lowerCommand.includes('pan')) {
      const panMatch = command.match(/[A-Z]{5}\d{4}[A-Z]{1}/);
      if (panMatch) {
        setFormData({...formData, panNumber: panMatch[0]});
        await speak(`PAN number set to ${panMatch[0]}`);
      }
    } else if (lowerCommand.includes('income')) {
      const incomeMatch = command.match(/\d+/);
      if (incomeMatch) {
        setFormData({...formData, income: incomeMatch[0]});
        await speak(`Income set to ${incomeMatch[0]} rupees`);
      }
    } else if (lowerCommand.includes('submit') || lowerCommand.includes('file')) {
      handleSubmitTaxReturn();
    }
  };

  const handleSubmitTaxReturn = async () => {
    if (!formData.panNumber || !formData.assessmentYear || !formData.income) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    try {
      await speak('Submitting your tax return');
      Alert.alert(
        'Tax Return Submitted',
        `PAN: ${formData.panNumber}\nAssessment Year: ${formData.assessmentYear}\nIncome: ₹${formData.income}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit tax return');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Basic Information</Text>
            <Text style={styles.stepDescription}>
              Enter your basic details for tax filing
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PAN Number *</Text>
              <TextInput
                style={styles.input}
                value={formData.panNumber}
                onChangeText={(text) => setFormData({...formData, panNumber: text})}
                placeholder="Enter PAN number"
                autoCapitalize="characters"
                maxLength={10}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Assessment Year *</Text>
              <View style={styles.yearSelector}>
                {assessmentYears.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.yearCard,
                      formData.assessmentYear === year && styles.selectedYearCard,
                    ]}
                    onPress={() => setFormData({...formData, assessmentYear: year})}
                  >
                    <Text style={styles.yearText}>{year}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
                placeholder="Enter your full name"
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Income Details</Text>
            <Text style={styles.stepDescription}>
              Enter your income details for the assessment year
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Total Income (₹) *</Text>
              <TextInput
                style={styles.input}
                value={formData.income}
                onChangeText={(text) => setFormData({...formData, income: text})}
                placeholder="Enter total income"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Deductions (₹)</Text>
              <TextInput
                style={styles.input}
                value={formData.deductions}
                onChangeText={(text) => setFormData({...formData, deductions: text})}
                placeholder="Enter total deductions"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tax Already Paid (₹)</Text>
              <TextInput
                style={styles.input}
                value={formData.taxPaid}
                onChangeText={(text) => setFormData({...formData, taxPaid: text})}
                placeholder="Enter tax already paid"
                keyboardType="numeric"
              />
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Review & Calculate</Text>
            <Text style={styles.stepDescription}>
              Review your information and calculate tax liability
            </Text>
            
            <View style={styles.reviewCard}>
              <Text style={styles.reviewTitle}>Summary</Text>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>PAN Number:</Text>
                <Text style={styles.reviewValue}>{formData.panNumber}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Assessment Year:</Text>
                <Text style={styles.reviewValue}>{formData.assessmentYear}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Total Income:</Text>
                <Text style={styles.reviewValue}>₹{formData.income || '0'}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Deductions:</Text>
                <Text style={styles.reviewValue}>₹{formData.deductions || '0'}</Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>Tax Paid:</Text>
                <Text style={styles.reviewValue}>₹{formData.taxPaid || '0'}</Text>
              </View>
              <View style={[styles.reviewRow, styles.taxLiabilityRow]}>
                <Text style={styles.taxLiabilityLabel}>Estimated Tax Liability:</Text>
                <Text style={styles.taxLiabilityValue}>
                  ₹{calculateTaxLiability()}
                </Text>
              </View>
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Submit Return</Text>
            <Text style={styles.stepDescription}>
              Confirm and submit your income tax return
            </Text>
            
            <View style={styles.submitCard}>
              <Text style={styles.submitTitle}>Ready to Submit</Text>
              <Text style={styles.submitDescription}>
                Please review all information before submitting. You can make changes in previous steps if needed.
              </Text>
              
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmitTaxReturn}>
                <Text style={styles.submitButtonText}>Submit Tax Return</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const calculateTaxLiability = () => {
    const income = parseInt(formData.income) || 0;
    const deductions = parseInt(formData.deductions) || 0;
    const taxPaid = parseInt(formData.taxPaid) || 0;
    
    const taxableIncome = Math.max(0, income - deductions);
    let tax = 0;
    
    if (taxableIncome <= 250000) {
      tax = 0;
    } else if (taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
    } else if (taxableIncome <= 1000000) {
      tax = 12500 + (taxableIncome - 500000) * 0.2;
    } else {
      tax = 112500 + (taxableIncome - 1000000) * 0.3;
    }
    
    return Math.max(0, tax - taxPaid).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tax Filing</Text>
      
      <View style={styles.progressBar}>
        {[1, 2, 3, 4].map((step) => (
          <View
            key={step}
            style={[
              styles.progressStep,
              currentStep >= step && styles.progressStepActive,
            ]}
          />
        ))}
      </View>
      
      <ScrollView style={styles.content}>
        {renderStep()}
      </ScrollView>

      <View style={styles.navigationButtons}>
        {currentStep > 1 && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setCurrentStep(currentStep - 1)}
          >
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>
        )}
        
        {currentStep < 4 && (
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setCurrentStep(currentStep + 1)}
          >
            <Text style={styles.navButtonText}>Next</Text>
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
    flexDirection: 'row',
    marginBottom: 20,
  },
  progressStep: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  progressStepActive: {
    backgroundColor: '#4F46E5',
  },
  content: {
    flex: 1,
    marginBottom: 20,
  },
  stepContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6B7280',
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
  yearSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  yearCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    width: '48%',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedYearCard: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  yearText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  reviewCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 15,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  reviewLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  reviewValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  taxLiabilityRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
    marginTop: 10,
  },
  taxLiabilityLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  taxLiabilityValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  submitCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  submitTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  submitDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#10B981',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  navButtonText: {
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

export default TaxFilingScreen;
