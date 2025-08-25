import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import SimpleFormField from '../components/ui/SimpleFormField';

interface FormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  fatherName: string;
  motherName: string;
  address: string;
  phoneNumber: string;
  email: string;
}

const SimplePassportForm: React.FC = ({ navigation }: any) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    fatherName: '',
    motherName: '',
    address: '',
    phoneNumber: '',
    email: '',
  });

  const totalSteps = 3;

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    Alert.alert(
      'आवेदन जमा करें',
      'क्या आप अपना पासपोर्ट आवेदन जमा करना चाहते हैं?',
      [
        { text: 'नहीं', style: 'cancel' },
        { 
          text: 'हाँ, जमा करें', 
          onPress: () => {
            Alert.alert(
              'सफल!',
              'आपका आवेदन जमा हो गया है। आपको SMS मिलेगा।',
              [{ text: 'ठीक है', onPress: () => navigation.navigate('Home') }]
            );
          }
        },
      ]
    );
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <Text style={styles.stepText}>
        चरण {currentStep} / {totalSteps}
      </Text>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${(currentStep / totalSteps) * 100}%` }]} />
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>आपका नाम</Text>
      <Text style={styles.stepDescription}>
        अपना पूरा नाम लिखें जैसा आधार कार्ड में है
      </Text>

      <SimpleFormField
        label="पहला नाम"
        placeholder="अपना पहला नाम लिखें"
        value={formData.firstName}
        onChangeText={(value) => updateFormData('firstName', value)}
        required
        helperText="जैसे: राहुल, प्रिया, अमित"
      />

      <SimpleFormField
        label="अंतिम नाम"
        placeholder="अपना अंतिम नाम लिखें"
        value={formData.lastName}
        onChangeText={(value) => updateFormData('lastName', value)}
        required
        helperText="जैसे: शर्मा, वर्मा, पटेल"
      />

      <SimpleFormField
        label="जन्म तिथि"
        placeholder="दिन/महीना/साल (जैसे: 15/03/1990)"
        value={formData.dateOfBirth}
        onChangeText={(value) => updateFormData('dateOfBirth', value)}
        required
        helperText="आधार कार्ड में जो तिथि है वही लिखें"
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>परिवार की जानकारी</Text>
      <Text style={styles.stepDescription}>
        अपने माता-पिता का नाम और जन्म स्थान लिखें
      </Text>

      <SimpleFormField
        label="जन्म स्थान"
        placeholder="जहां आप पैदा हुए थे"
        value={formData.placeOfBirth}
        onChangeText={(value) => updateFormData('placeOfBirth', value)}
        required
        helperText="शहर और राज्य का नाम"
      />

      <SimpleFormField
        label="पिता का नाम"
        placeholder="अपने पिता का पूरा नाम"
        value={formData.fatherName}
        onChangeText={(value) => updateFormData('fatherName', value)}
        required
        helperText="जैसा आधार कार्ड में लिखा है"
      />

      <SimpleFormField
        label="माता का नाम"
        placeholder="अपनी माता का पूरा नाम"
        value={formData.motherName}
        onChangeText={(value) => updateFormData('motherName', value)}
        required
        helperText="जैसा आधार कार्ड में लिखा है"
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>संपर्क जानकारी</Text>
      <Text style={styles.stepDescription}>
        अपना पता और फोन नंबर लिखें
      </Text>

      <SimpleFormField
        label="पता"
        placeholder="आपका पूरा पता लिखें"
        value={formData.address}
        onChangeText={(value) => updateFormData('address', value)}
        required
        helperText="मकान नंबर, गली, शहर, पिन कोड"
      />

      <SimpleFormField
        label="मोबाइल नंबर"
        placeholder="10 अंकों का नंबर"
        value={formData.phoneNumber}
        onChangeText={(value) => updateFormData('phoneNumber', value)}
        type="phone"
        required
        helperText="जैसे: 9876543210"
      />

      <SimpleFormField
        label="ईमेल (वैकल्पिक)"
        placeholder="अगर आपके पास है तो लिखें"
        value={formData.email}
        onChangeText={(value) => updateFormData('email', value)}
        type="email"
        helperText="अगर नहीं है तो खाली छोड़ दें"
      />
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← वापस</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>पासपोर्ट आवेदन</Text>
      </View>

      {/* Progress Indicator */}
      {renderStepIndicator()}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Current Step Content */}
        {renderCurrentStep()}

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          {currentStep > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>← पिछला</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.nextButton} 
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === totalSteps ? 'आवेदन जमा करें' : 'अगला →'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>मदद चाहिए?</Text>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={styles.helpButtonText}>📞 कॉल करें</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FF6B35',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
  },
  stepIndicator: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  stepText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#10B981',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  stepContainer: {
    marginBottom: 30,
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
    marginBottom: 30,
    lineHeight: 24,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 30,
  },
  nextButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    flex: 1,
    marginLeft: currentStep > 1 ? 10 : 0,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  helpSection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    marginBottom: 20,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 15,
  },
  helpButton: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  helpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default SimplePassportForm;
