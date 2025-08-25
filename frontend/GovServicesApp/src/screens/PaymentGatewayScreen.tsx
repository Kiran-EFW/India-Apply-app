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
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useVoice } from '../contexts/VoiceContext';
import { paymentService } from '../services/paymentService';
import { utrService } from '../services/utrService';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
}

interface PaymentDetails {
  amount: number;
  currency: string;
  description: string;
  serviceType: string;
  applicationId?: string;
}

interface UPIApp {
  id: string;
  name: string;
  icon: string;
  packageName: string;
}

const PaymentGatewayScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { startListening, stopListening, isListening, transcript, speak } = useVoice();
  
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    amount: 0,
    currency: 'INR',
    description: '',
    serviceType: '',
  });
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed' | null>(null);
  const [upiId, setUpiId] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'upi',
      name: 'UPI',
      icon: '📱',
      description: 'Pay using UPI apps like Google Pay, PhonePe',
      enabled: true,
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      description: 'Pay using credit or debit card',
      enabled: true,
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: '🏦',
      description: 'Pay using your bank account',
      enabled: true,
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: '👛',
      description: 'Pay using digital wallets',
      enabled: true,
    },
    {
      id: 'emi',
      name: 'EMI',
      icon: '📅',
      description: 'Pay in easy installments',
      enabled: false,
    },
  ];

  const upiApps: UPIApp[] = [
    { id: 'gpay', name: 'Google Pay', icon: '🔵', packageName: 'com.google.android.apps.nbu.paisa.user' },
    { id: 'phonepe', name: 'PhonePe', icon: '🟣', packageName: 'com.phonepe.app' },
    { id: 'paytm', name: 'Paytm', icon: '🟡', packageName: 'net.one97.paytm' },
    { id: 'amazonpay', name: 'Amazon Pay', icon: '🟠', packageName: 'in.amazonpay' },
    { id: 'bhim', name: 'BHIM', icon: '🔴', packageName: 'in.org.npci.upiapp' },
  ];

  const banks = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank',
    'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'Union Bank of India', 'Bank of India',
  ];

  useEffect(() => {
    // Get payment details from route params
    if (route.params) {
      const params = route.params as any;
      setPaymentDetails({
        amount: params.amount || 0,
        currency: params.currency || 'INR',
        description: params.description || '',
        serviceType: params.serviceType || '',
        applicationId: params.applicationId,
      });
    }
    
    speak('Welcome to Payment Gateway. Please select your preferred payment method.');
  }, [route.params]);

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
    
    if (lowerCommand.includes('upi') || lowerCommand.includes('google pay')) {
      setSelectedMethod(paymentMethods.find(m => m.id === 'upi') || null);
      setShowUPIModal(true);
      await speak('Opening UPI payment options');
    } else if (lowerCommand.includes('card') || lowerCommand.includes('credit')) {
      setSelectedMethod(paymentMethods.find(m => m.id === 'card') || null);
      setShowCardModal(true);
      await speak('Opening card payment form');
    } else if (lowerCommand.includes('net banking') || lowerCommand.includes('bank')) {
      setSelectedMethod(paymentMethods.find(m => m.id === 'netbanking') || null);
      await handleNetBankingPayment();
    } else if (lowerCommand.includes('wallet') || lowerCommand.includes('digital wallet')) {
      setSelectedMethod(paymentMethods.find(m => m.id === 'wallet') || null);
      await handleWalletPayment();
    } else if (lowerCommand.includes('pay') || lowerCommand.includes('process')) {
      if (selectedMethod) {
        await processPayment();
      } else {
        await speak('Please select a payment method first');
      }
    } else if (lowerCommand.includes('back') || lowerCommand.includes('cancel')) {
      navigation.goBack();
    }
  };

  const handleUPIPayment = async (app: UPIApp) => {
    setShowUPIModal(false);
    setIsProcessing(true);
    
    try {
      await speak(`Initiating payment through ${app.name}`);
      
      const paymentResult = await paymentService.processUPIPayment({
        ...paymentDetails,
        upiApp: app.id,
        upiId: upiId,
      });

      if (paymentResult.success) {
        setPaymentStatus('success');
        await speak('Payment successful');
        await generateUTR(paymentResult.transactionId);
        Alert.alert('Success', 'Payment completed successfully!');
        navigation.navigate('Home');
      } else {
        setPaymentStatus('failed');
        await speak('Payment failed');
        Alert.alert('Error', 'Payment failed. Please try again.');
      }
    } catch (error) {
      setPaymentStatus('failed');
      await speak('Payment failed');
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPayment = async () => {
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
      Alert.alert('Error', 'Please fill in all card details');
      return;
    }

    setShowCardModal(false);
    setIsProcessing(true);
    
    try {
      await speak('Processing card payment');
      
      const paymentResult = await paymentService.processCardPayment({
        ...paymentDetails,
        cardDetails,
      });

      if (paymentResult.success) {
        setPaymentStatus('success');
        await speak('Payment successful');
        await generateUTR(paymentResult.transactionId);
        Alert.alert('Success', 'Payment completed successfully!');
        navigation.navigate('Home');
      } else {
        setPaymentStatus('failed');
        await speak('Payment failed');
        Alert.alert('Error', 'Payment failed. Please try again.');
      }
    } catch (error) {
      setPaymentStatus('failed');
      await speak('Payment failed');
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNetBankingPayment = async () => {
    Alert.alert(
      'Select Bank',
      'Choose your bank for net banking',
      banks.map(bank => ({
        text: bank,
        onPress: async () => {
          setIsProcessing(true);
          try {
            await speak(`Redirecting to ${bank} net banking`);
            // Simulate net banking redirect
            setTimeout(async () => {
              const paymentResult = await paymentService.processNetBankingPayment({
                ...paymentDetails,
                bank: bank,
              });
              
              if (paymentResult.success) {
                setPaymentStatus('success');
                await speak('Payment successful');
                await generateUTR(paymentResult.transactionId);
                Alert.alert('Success', 'Payment completed successfully!');
                navigation.navigate('Home');
              } else {
                setPaymentStatus('failed');
                await speak('Payment failed');
                Alert.alert('Error', 'Payment failed. Please try again.');
              }
              setIsProcessing(false);
            }, 2000);
          } catch (error) {
            setPaymentStatus('failed');
            await speak('Payment failed');
            Alert.alert('Error', 'Payment failed. Please try again.');
            setIsProcessing(false);
          }
        },
      }))
    );
  };

  const handleWalletPayment = async () => {
    Alert.alert(
      'Select Wallet',
      'Choose your digital wallet',
      [
        { text: 'Paytm', onPress: () => processWalletPayment('paytm') },
        { text: 'PhonePe', onPress: () => processWalletPayment('phonepe') },
        { text: 'Amazon Pay', onPress: () => processWalletPayment('amazonpay') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const processWalletPayment = async (wallet: string) => {
    setIsProcessing(true);
    try {
      await speak(`Processing payment through ${wallet}`);
      
      const paymentResult = await paymentService.processWalletPayment({
        ...paymentDetails,
        wallet,
      });

      if (paymentResult.success) {
        setPaymentStatus('success');
        await speak('Payment successful');
        await generateUTR(paymentResult.transactionId);
        Alert.alert('Success', 'Payment completed successfully!');
        navigation.navigate('Home');
      } else {
        setPaymentStatus('failed');
        await speak('Payment failed');
        Alert.alert('Error', 'Payment failed. Please try again.');
      }
    } catch (error) {
      setPaymentStatus('failed');
      await speak('Payment failed');
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const processPayment = async () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a payment method');
      return;
    }

    switch (selectedMethod.id) {
      case 'upi':
        setShowUPIModal(true);
        break;
      case 'card':
        setShowCardModal(true);
        break;
      case 'netbanking':
        await handleNetBankingPayment();
        break;
      case 'wallet':
        await handleWalletPayment();
        break;
      default:
        Alert.alert('Error', 'Payment method not supported');
    }
  };

  const generateUTR = async (transactionId: string) => {
    try {
      await utrService.generateUTR({
        transactionId,
        amount: paymentDetails.amount,
        serviceType: paymentDetails.serviceType,
        applicationId: paymentDetails.applicationId,
      });
    } catch (error) {
      console.error('Failed to generate UTR:', error);
    }
  };

  const renderPaymentMethod = (method: PaymentMethod) => (
    <TouchableOpacity
      key={method.id}
      style={[
        styles.methodItem,
        selectedMethod?.id === method.id && styles.selectedMethod,
        !method.enabled && styles.disabledMethod,
      ]}
      onPress={() => method.enabled && setSelectedMethod(method)}
      disabled={!method.enabled}
    >
      <Text style={styles.methodIcon}>{method.icon}</Text>
      <View style={styles.methodInfo}>
        <Text style={styles.methodName}>{method.name}</Text>
        <Text style={styles.methodDescription}>{method.description}</Text>
      </View>
      {!method.enabled && <Text style={styles.comingSoon}>Coming Soon</Text>}
    </TouchableOpacity>
  );

  const renderUPIApp = (app: UPIApp) => (
    <TouchableOpacity
      key={app.id}
      style={styles.upiAppItem}
      onPress={() => handleUPIPayment(app)}
    >
      <Text style={styles.upiAppIcon}>{app.icon}</Text>
      <Text style={styles.upiAppName}>{app.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Gateway</Text>
      
      <ScrollView style={styles.content}>
        <View style={styles.paymentSummary}>
          <Text style={styles.summaryTitle}>Payment Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount:</Text>
            <Text style={styles.summaryValue}>₹{paymentDetails.amount.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service:</Text>
            <Text style={styles.summaryValue}>{paymentDetails.serviceType}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Description:</Text>
            <Text style={styles.summaryValue}>{paymentDetails.description}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          {paymentMethods.map(renderPaymentMethod)}
        </View>

        {selectedMethod && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            <View style={styles.paymentDetails}>
              <Text style={styles.detailLabel}>Selected Method:</Text>
              <Text style={styles.detailValue}>{selectedMethod.name}</Text>
              
              <Text style={styles.detailLabel}>Amount:</Text>
              <Text style={styles.detailValue}>₹{paymentDetails.amount.toLocaleString()}</Text>
              
              <Text style={styles.detailLabel}>Service:</Text>
              <Text style={styles.detailValue}>{paymentDetails.serviceType}</Text>
            </View>
            
            <TouchableOpacity
              style={[styles.payButton, isProcessing && styles.disabledButton]}
              onPress={processPayment}
              disabled={isProcessing}
            >
              <Text style={styles.payButtonText}>
                {isProcessing ? 'Processing...' : `Pay ₹${paymentDetails.amount.toLocaleString()}`}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {paymentStatus && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Status</Text>
            <View style={[
              styles.statusContainer,
              paymentStatus === 'success' && styles.successStatus,
              paymentStatus === 'failed' && styles.failedStatus,
            ]}>
              <Text style={styles.statusText}>
                {paymentStatus === 'success' ? '✅ Payment Successful' : '❌ Payment Failed'}
              </Text>
            </View>
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

      {/* UPI Modal */}
      <Modal visible={showUPIModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>UPI Payment</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowUPIModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>UPI ID</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter UPI ID (e.g., user@upi)"
              value={upiId}
              onChangeText={setUpiId}
              autoCapitalize="none"
            />
            
            <Text style={styles.sectionTitle}>Select UPI App</Text>
            <View style={styles.upiAppsContainer}>
              {upiApps.map(renderUPIApp)}
            </View>
          </View>
        </View>
      </Modal>

      {/* Card Modal */}
      <Modal visible={showCardModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Card Payment</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCardModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              value={cardDetails.number}
              onChangeText={(text) => setCardDetails({...cardDetails, number: text})}
              keyboardType="numeric"
              maxLength={19}
            />
            
            <View style={styles.cardRow}>
              <View style={styles.cardField}>
                <Text style={styles.inputLabel}>Expiry</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChangeText={(text) => setCardDetails({...cardDetails, expiry: text})}
                  maxLength={5}
                />
              </View>
              
              <View style={styles.cardField}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChangeText={(text) => setCardDetails({...cardDetails, cvv: text})}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
            
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter cardholder name"
              value={cardDetails.name}
              onChangeText={(text) => setCardDetails({...cardDetails, name: text})}
              autoCapitalize="words"
            />
            
            <TouchableOpacity
              style={[styles.payButton, isProcessing && styles.disabledButton]}
              onPress={handleCardPayment}
              disabled={isProcessing}
            >
              <Text style={styles.payButtonText}>
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {isProcessing && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.processingText}>Processing Payment...</Text>
        </View>
      )}
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
  paymentSummary: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#1E40AF',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1E40AF',
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
    marginBottom: 15,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedMethod: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
  },
  disabledMethod: {
    opacity: 0.5,
  },
  methodIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  comingSoon: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  paymentDetails: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 15,
  },
  payButton: {
    backgroundColor: '#10B981',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  statusContainer: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  successStatus: {
    backgroundColor: '#D1FAE5',
  },
  failedStatus: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
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
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#6B7280',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
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
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardField: {
    flex: 1,
    marginRight: 10,
  },
  upiAppsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  upiAppItem: {
    width: '48%',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  upiAppIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  upiAppName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
});

export default PaymentGatewayScreen;
