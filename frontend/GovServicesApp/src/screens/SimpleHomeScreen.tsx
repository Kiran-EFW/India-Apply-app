import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../theme/theme';

const { width, height } = Dimensions.get('window');

interface ServiceOption {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  route: string;
}

const SimpleHomeScreen: React.FC = ({ navigation }: any) => {
  const [userName, setUserName] = useState('आप');

  const serviceOptions: ServiceOption[] = [
    {
      id: '1',
      title: 'पासपोर्ट',
      subtitle: 'नया पासपोर्ट बनाएं',
      icon: '🛂',
      color: '#FF6B35',
      route: 'PassportServices',
    },
    {
      id: '2',
      title: 'पैन कार्ड',
      subtitle: 'पैन कार्ड बनाएं',
      icon: '💳',
      color: '#1E3A8A',
      route: 'PANCard',
    },
    {
      id: '3',
      title: 'आधार अपडेट',
      subtitle: 'आधार में बदलाव करें',
      icon: '🆔',
      color: '#10B981',
      route: 'AadhaarUpdate',
    },
    {
      id: '4',
      title: 'टैक्स भरें',
      subtitle: 'आयकर रिटर्न दाखिल करें',
      icon: '📊',
      color: '#F59E0B',
      route: 'TaxFiling',
    },
    {
      id: '5',
      title: 'दस्तावेज़',
      subtitle: 'अपने कागज़ात देखें',
      icon: '📁',
      color: '#8B5CF6',
      route: 'DocumentVault',
    },
    {
      id: '6',
      title: 'भुगतान',
      subtitle: 'फीस भुगतान करें',
      icon: '💳',
      color: '#EF4444',
      route: 'PaymentGateway',
    },
  ];

  const handleServicePress = (service: ServiceOption) => {
    Alert.alert(
      `${service.title}`,
      `क्या आप ${service.subtitle} चाहते हैं?`,
      [
        { text: 'नहीं', style: 'cancel' },
        { text: 'हाँ', onPress: () => navigation.navigate(service.route) },
      ]
    );
  };

  const handleVoiceHelp = () => {
    Alert.alert(
      'आवाज़ सहायता',
      'बोलकर बताएं कि आप क्या करना चाहते हैं',
      [
        { text: 'ठीक है', onPress: () => console.log('Voice help activated') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Simple Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#FF6B35', '#FF8A65']}
          style={styles.headerGradient}
        >
          <Text style={styles.headerTitle}>सरकारी सेवाएं</Text>
          <Text style={styles.headerSubtitle}>आपकी मदद के लिए</Text>
        </LinearGradient>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Message */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            नमस्ते {userName}! 👋
          </Text>
          <Text style={styles.instructionText}>
            नीचे दिए गए बटन पर टैप करें जो आप करना चाहते हैं
          </Text>
        </View>

        {/* Voice Help Button */}
        <TouchableOpacity style={styles.voiceButton} onPress={handleVoiceHelp}>
          <Text style={styles.voiceIcon}>🎤</Text>
          <Text style={styles.voiceText}>आवाज़ से बताएं</Text>
        </TouchableOpacity>

        {/* Service Options - Large, Simple Buttons */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>आप क्या करना चाहते हैं?</Text>
          
          {serviceOptions.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[styles.serviceButton, { backgroundColor: service.color }]}
              onPress={() => handleServicePress(service)}
              activeOpacity={0.8}
            >
              <View style={styles.serviceContent}>
                <Text style={styles.serviceIcon}>{service.icon}</Text>
                <View style={styles.serviceTextContainer}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
                </View>
                <Text style={styles.arrowIcon}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>मदद चाहिए?</Text>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => navigation.navigate('Help')}
          >
            <Text style={styles.helpButtonText}>हमसे संपर्क करें</Text>
          </TouchableOpacity>
        </View>

        {/* Emergency Contact */}
        <View style={styles.emergencySection}>
          <Text style={styles.emergencyText}>
            तुरंत मदद के लिए: 1800-XXX-XXXX
          </Text>
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
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerGradient: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
  },
  voiceIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  voiceText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  servicesSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  serviceButton: {
    marginBottom: 15,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  serviceTextContainer: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  serviceSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  arrowIcon: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  helpSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  helpButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  helpButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  emergencySection: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    marginBottom: 20,
  },
  emergencyText: {
    fontSize: 16,
    color: '#92400E',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default SimpleHomeScreen;
