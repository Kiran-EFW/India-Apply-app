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
import { taxService } from '../services/taxService';

interface TaxForm {
  id: string;
  name: string;
  description: string;
  requiredDocuments: string[];
  estimatedTime: string;
}

interface FilingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

const TaxFilingScreen = () => {
  const navigation = useNavigation();
  const { startListening, stopListening, isListening, transcript, speak } = useVoice();
  
  const [selectedForm, setSelectedForm] = useState<TaxForm | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showFormModal, setShowFormModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filingData, setFilingData] = useState({
    panNumber: '',
    aadhaarNumber: '',
    assessmentYear: '2024-25',
    incomeSource: 'salary',
    totalIncome: '',
    deductions: '',
    documents: [] as string[],
  });

  const taxForms: TaxForm[] = [
    {
      id: 'itr1',
      name: 'ITR-1 (Sahaj)',
      description: 'For individuals with income from salary, pension, interest, and one house property',
      requiredDocuments: [
        'PAN Card',
        'Aadhaar Card',
        'Form 16 (if applicable)',
        'Bank statements',
        'Investment proofs',
      ],
      estimatedTime: '15-20 minutes',
    },
    {
      id: 'itr2',
      name: 'ITR-2',
      description: 'For individuals with income from salary, pension, interest, and multiple house properties',
      requiredDocuments: [
        'PAN Card',
        'Aadhaar Card',
        'Form 16',
        'Property documents',
        'Bank statements',
        'Investment proofs',
      ],
      estimatedTime: '30-45 minutes',
    },
    {
      id: 'itr3',
      name: 'ITR-3',
      description: 'For individuals with income from business or profession',
      requiredDocuments: [
        'PAN Card',
        'Aadhaar Card',
        'Business accounts',
        'Profit & Loss statement',
        'Balance sheet',
        'Bank statements',
      ],
      estimatedTime: '60-90 minutes',
    },
  ];

  const filingSteps: FilingStep[] = [
    {
      id: '1',
      title: 'Select Form',
      description: 'Choose the appropriate ITR form',
      completed: false,
      current: true,
    },
    {
      id: '2',
      title: 'Personal Details',
      description: 'Enter PAN, Aadhaar, and basic information',
      completed: false,
      current: false,
    },
    {
      id: '3',
      title: 'Income Details',
      description: 'Enter income from various sources',
      completed: false,
      current: false,
    },
    {
      id: '4',
      title: 'Deductions',
      description: 'Claim eligible deductions',
      completed: false,
      current: false,
    },
    {
      id: '5',
      title: 'Upload Documents',
      description: 'Upload required documents',
      completed: false,
      current: false,
    },
    {
      id: '6',
      title: 'Review & Submit',
      description: 'Review and submit your return',
      completed: false,
      current: false,
    },
  ];

  useEffect(() => {
    speak('Welcome to Tax Filing. Please select the appropriate ITR form to begin.');
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
    
    if (lowerCommand.includes('select form') || lowerCommand.includes('choose form')) {
      setShowFormModal(true);
      await speak('Opening form selection');
    } else if (lowerCommand.includes('next') || lowerCommand.includes('continue')) {
      await handleNextStep();
    } else if (lowerCommand.includes('previous') || lowerCommand.includes('back')) {
      await handlePreviousStep();
    } else if (lowerCommand.includes('submit') || lowerCommand.includes('file')) {
      await handleSubmitFiling();
    } else if (lowerCommand.includes('home') || lowerCommand.includes('main')) {
      navigation.navigate('Home');
    }
  };

  const handleFormSelection = (form: TaxForm) => {
    setSelectedForm(form);
    setShowFormModal(false);
    speak(`Selected ${form.name}`);
    updateSteps(1);
  };

  const updateSteps = (stepIndex: number) => {
    const updatedSteps = filingSteps.map((step, index) => ({
      ...step,
      completed: index < stepIndex,
      current: index === stepIndex,
    }));
    setCurrentStep(stepIndex);
  };

  const handleNextStep = async () => {
    if (currentStep < filingSteps.length - 1) {
      await speak(`Moving to step ${currentStep + 2}`);
      updateSteps(currentStep + 1);
    }
  };

  const handlePreviousStep = async () => {
    if (currentStep > 0) {
      await speak(`Moving to step ${currentStep}`);
      updateSteps(currentStep - 1);
    }
  };

  const handleSubmitFiling = async () => {
    if (!selectedForm) {
      Alert.alert('Error', 'Please select a tax form first');
      return;
    }

    if (!filingData.panNumber || !filingData.aadhaarNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await speak('Submitting your tax return');
      
      const result = await taxService.fileTaxReturn({
        formType: selectedForm.id,
        ...filingData,
      });

      await speak('Tax return filed successfully');
      Alert.alert(
        'Success',
        `Your ${selectedForm.name} has been filed successfully. Acknowledgement number: ${result.acknowledgementNumber}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } catch (error) {
      await speak('Failed to file tax return');
      Alert.alert('Error', 'Failed to file tax return. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormItem = (form: TaxForm) => (
    <TouchableOpacity
      key={form.id}
      style={styles.formItem}
      onPress={() => handleFormSelection(form)}
    >
      <Text style={styles.formName}>{form.name}</Text>
      <Text style={styles.formDescription}>{form.description}</Text>
      <Text style={styles.formTime}>Estimated time: {form.estimatedTime}</Text>
    </TouchableOpacity>
  );

  const renderStep = (step: FilingStep, index: number) => (
    <View key={step.id} style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={[
          styles.stepNumber,
          step.completed && styles.completedStep,
          step.current && styles.currentStep,
        ]}>
          <Text style={styles.stepNumberText}>
            {step.completed ? '✓' : index + 1}
          </Text>
        </View>
        <View style={styles.stepInfo}>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <Text style={styles.stepDescription}>{step.description}</Text>
        </View>
      </View>
    </View>
  );

  const renderCurrentStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepContentTitle}>Select Tax Form</Text>
            <Text style={styles.stepContentDescription}>
              Choose the appropriate ITR form based on your income sources
            </Text>
            <TouchableOpacity
              style={styles.selectFormButton}
              onPress={() => setShowFormModal(true)}
            >
              <Text style={styles.selectFormButtonText}>
                {selectedForm ? selectedForm.name : 'Select Form'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepContentTitle}>Personal Details</Text>
            
            <Text style={styles.inputLabel}>PAN Number *</Text>
            <TextInput
              style={styles.input}
              value={filingData.panNumber}
              onChangeText={(text) => setFilingData({...filingData, panNumber: text})}
              placeholder="Enter PAN number"
              maxLength={10}
              autoCapitalize="characters"
            />
            
            <Text style={styles.inputLabel}>Aadhaar Number *</Text>
            <TextInput
              style={styles.input}
              value={filingData.aadhaarNumber}
              onChangeText={(text) => setFilingData({...filingData, aadhaarNumber: text})}
              placeholder="Enter Aadhaar number"
              maxLength={12}
              keyboardType="numeric"
            />
            
            <Text style={styles.inputLabel}>Assessment Year</Text>
            <TextInput
              style={styles.input}
              value={filingData.assessmentYear}
              onChangeText={(text) => setFilingData({...filingData, assessmentYear: text})}
              placeholder="Assessment year"
            />
          </View>
        );
      
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepContentTitle}>Income Details</Text>
            
            <Text style={styles.inputLabel}>Total Income *</Text>
            <TextInput
              style={styles.input}
              value={filingData.totalIncome}
              onChangeText={(text) => setFilingData({...filingData, totalIncome: text})}
              placeholder="Enter total income"
              keyboardType="numeric"
            />
            
            <Text style={styles.inputLabel}>Income Source</Text>
            <TextInput
              style={styles.input}
              value={filingData.incomeSource}
              onChangeText={(text) => setFilingData({...filingData, incomeSource: text})}
              placeholder="Salary, Business, etc."
            />
          </View>
        );
      
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepContentTitle}>Deductions</Text>
            
            <Text style={styles.inputLabel}>Total Deductions</Text>
            <TextInput
              style={styles.input}
              value={filingData.deductions}
              onChangeText={(text) => setFilingData({...filingData, deductions: text})}
              placeholder="Enter total deductions"
              keyboardType="numeric"
            />
            
            <Text style={styles.deductionInfo}>
              Common deductions include:{'\n'}
              • Section 80C (ELSS, PPF, etc.){'\n'}
              • Section 80D (Health Insurance){'\n'}
              • Section 80TTA (Interest on Savings){'\n'}
              • HRA, LTA, and other allowances
            </Text>
          </View>
        );
      
      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepContentTitle}>Upload Documents</Text>
            <Text style={styles.stepContentDescription}>
              Upload the required documents for verification
            </Text>
            
            {selectedForm?.requiredDocuments.map((doc, index) => (
              <TouchableOpacity key={index} style={styles.documentItem}>
                <Text style={styles.documentName}>{doc}</Text>
                <Text style={styles.uploadText}>Tap to upload</Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      
      case 5:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepContentTitle}>Review & Submit</Text>
            
            <View style={styles.reviewSection}>
              <Text style={styles.reviewTitle}>Form Details</Text>
              <Text style={styles.reviewText}>Form: {selectedForm?.name}</Text>
              <Text style={styles.reviewText}>PAN: {filingData.panNumber}</Text>
              <Text style={styles.reviewText}>Aadhaar: {filingData.aadhaarNumber}</Text>
              <Text style={styles.reviewText}>Assessment Year: {filingData.assessmentYear}</Text>
              <Text style={styles.reviewText}>Total Income: ₹{filingData.totalIncome}</Text>
              <Text style={styles.reviewText}>Deductions: ₹{filingData.deductions}</Text>
            </View>
            
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.disabledButton]}
              onPress={handleSubmitFiling}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Filing...' : 'File Tax Return'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tax Filing</Text>
      
      <ScrollView style={styles.content}>
        <View style={styles.stepsContainer}>
          {filingSteps.map((step, index) => renderStep(step, index))}
        </View>

        {renderCurrentStepContent()}
      </ScrollView>

      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[styles.navButton, currentStep === 0 && styles.disabledButton]}
          onPress={handlePreviousStep}
          disabled={currentStep === 0}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.navButton, currentStep === filingSteps.length - 1 && styles.disabledButton]}
          onPress={handleNextStep}
          disabled={currentStep === filingSteps.length - 1}
        >
          <Text style={styles.navButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.voiceButton, isListening && styles.listeningButton]}
        onPress={handleVoiceCommand}
      >
        <Text style={styles.voiceButtonText}>
          {isListening ? 'Listening...' : 'Tap to Speak'}
        </Text>
      </TouchableOpacity>

      {/* Form Selection Modal */}
      <Modal
        visible={showFormModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFormModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Tax Form</Text>
            <ScrollView>
              {taxForms.map(renderFormItem)}
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowFormModal(false)}
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
  stepsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  stepContainer: {
    marginBottom: 15,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  completedStep: {
    backgroundColor: '#10B981',
  },
  currentStep: {
    backgroundColor: '#4F46E5',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  stepContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  stepContentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  stepContentDescription: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  selectFormButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectFormButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  deductionInfo: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  documentItem: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  documentName: {
    fontSize: 16,
    color: '#1F2937',
  },
  uploadText: {
    fontSize: 14,
    color: '#4F46E5',
  },
  reviewSection: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  reviewText: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 5,
  },
  submitButton: {
    backgroundColor: '#10B981',
    paddingVertical: 15,
    borderRadius: 8,
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
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  voiceButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 15,
    borderRadius: 50,
    alignItems: 'center',
    margin: 20,
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
  formItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  formName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 5,
  },
  formDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 5,
  },
  formTime: {
    fontSize: 12,
    color: '#6B7280',
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

export default TaxFilingScreen;
