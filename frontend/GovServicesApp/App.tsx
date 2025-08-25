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
import ServiceHubScreen from './src/screens/ServiceHubScreen';
import DocumentVaultScreen from './src/screens/DocumentVaultScreen';
import TrackingScreen from './src/screens/TrackingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ApplicationWorkspace from './src/screens/ApplicationWorkspace';
import TaxPaymentScreen from './src/screens/TaxPaymentScreen';
import AadhaarAppointmentScreen from './src/screens/AadhaarAppointmentScreen';
import TaxFilingScreen from './src/screens/TaxFilingScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';

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
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="ServiceHub" component={ServiceHubScreen} />
              <Stack.Screen name="DocumentVault" component={DocumentVaultScreen} />
              <Stack.Screen name="Tracking" component={TrackingScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
                             <Stack.Screen name="ApplicationWorkspace" component={ApplicationWorkspace} />
               <Stack.Screen name="TaxPayment" component={TaxPaymentScreen} />
               <Stack.Screen name="AadhaarAppointment" component={AadhaarAppointmentScreen} />
               <Stack.Screen name="TaxFiling" component={TaxFilingScreen} />
               <Stack.Screen name="Notifications" component={NotificationsScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </UTRProvider>
      </VoiceProvider>
    </AuthProvider>
  );
};

export default App;
