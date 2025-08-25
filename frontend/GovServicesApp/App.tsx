import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/contexts/AuthContext';
import { VoiceProvider } from './src/contexts/VoiceContext';
import { UTRProvider } from './src/contexts/UTRContext';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import EnhancedHomeScreen from './src/screens/EnhancedHomeScreen';
import SimpleHomeScreen from './src/screens/SimpleHomeScreen';
import SimplePassportForm from './src/screens/SimplePassportForm';
import ServiceHubScreen from './src/screens/ServiceHubScreen';
import DocumentVaultScreen from './src/screens/DocumentVaultScreen';
import TrackingScreen from './src/screens/TrackingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ApplicationWorkspace from './src/screens/ApplicationWorkspace';
import TaxPaymentScreen from './src/screens/TaxPaymentScreen';
import AadhaarAppointmentScreen from './src/screens/AadhaarAppointmentScreen';
import TaxFilingScreen from './src/screens/TaxFilingScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import HelpScreen from './src/screens/HelpScreen';
import TicketDetailScreen from './src/screens/TicketDetailScreen';
import BiometricAuthScreen from './src/screens/BiometricAuthScreen';
import DocumentScannerScreen from './src/screens/DocumentScannerScreen';
import PaymentGatewayScreen from './src/screens/PaymentGatewayScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <VoiceProvider>
        <UTRProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Onboarding">
              <Stack.Screen 
                name="Onboarding" 
                component={OnboardingScreen} 
                options={{ headerShown: false }} 
              />
              <Stack.Screen 
                name="Auth" 
                component={AuthScreen} 
                options={{ headerShown: false }} 
              />
              <Stack.Screen name="Home" component={SimpleHomeScreen} options={{ headerShown: false }} />
              <Stack.Screen name="ServiceHub" component={ServiceHubScreen} />
              <Stack.Screen name="DocumentVault" component={DocumentVaultScreen} />
              <Stack.Screen name="Tracking" component={TrackingScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
                             <Stack.Screen name="ApplicationWorkspace" component={ApplicationWorkspace} />
               <Stack.Screen name="TaxPayment" component={TaxPaymentScreen} />
               <Stack.Screen name="AadhaarAppointment" component={AadhaarAppointmentScreen} />
               <Stack.Screen name="TaxFiling" component={TaxFilingScreen} />
               <Stack.Screen name="Notifications" component={NotificationsScreen} />
               <Stack.Screen name="Help" component={HelpScreen} />
               <Stack.Screen name="TicketDetail" component={TicketDetailScreen} />
               <Stack.Screen name="BiometricAuth" component={BiometricAuthScreen} />
               <Stack.Screen name="DocumentScanner" component={DocumentScannerScreen} />
                               <Stack.Screen name="PaymentGateway" component={PaymentGatewayScreen} />
                <Stack.Screen name="SimplePassportForm" component={SimplePassportForm} options={{ headerShown: false }} />
            </Stack.Navigator>
          </NavigationContainer>
        </UTRProvider>
      </VoiceProvider>
    </AuthProvider>
  );
};

export default App;
