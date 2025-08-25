import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useVoice } from '../contexts/VoiceContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { startListening, stopListening, isListening, transcript } = useVoice();
  const [activeApplications, setActiveApplications] = useState([
    { id: '1', service: 'Passport Renewal', status: 'In Progress', date: '2023-06-15' },
    { id: '2', service: 'PAN Card Update', status: 'Approved', date: '2023-05-20' },
  ]);

  const handleVoiceCommand = () => {
    if (isListening) {
      stopListening();
      processVoiceCommand(transcript);
    } else {
      startListening();
    }
  };

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('passport')) {
      navigation.navigate('ServiceHub', { service: 'passport' });
    } else if (lowerCommand.includes('pan')) {
      navigation.navigate('ServiceHub', { service: 'pan' });
    } else if (lowerCommand.includes('aadhaar')) {
      navigation.navigate('ServiceHub', { service: 'aadhaar' });
    } else if (lowerCommand.includes('tax') || lowerCommand.includes('itr')) {
      navigation.navigate('ServiceHub', { service: 'tax' });
    } else if (lowerCommand.includes('tax payment') || lowerCommand.includes('pay tax')) {
      navigation.navigate('TaxPayment');
    } else if (lowerCommand.includes('tax filing') || lowerCommand.includes('file tax')) {
      navigation.navigate('TaxFiling');
    } else if (lowerCommand.includes('aadhaar appointment') || lowerCommand.includes('book appointment')) {
      navigation.navigate('AadhaarAppointment');
    } else if (lowerCommand.includes('document')) {
      navigation.navigate('DocumentVault');
    } else if (lowerCommand.includes('track') || lowerCommand.includes('status')) {
      navigation.navigate('Tracking');
    } else if (lowerCommand.includes('notifications') || lowerCommand.includes('alerts')) {
      navigation.navigate('Notifications');
    } else if (lowerCommand.includes('profile') || lowerCommand.includes('account')) {
      navigation.navigate('Profile');
    } else if (lowerCommand.includes('logout') || lowerCommand.includes('sign out')) {
      logout();
    }
  };

  const renderApplication = ({ item }: any) => (
    <View style={styles.applicationCard}>
      <Text style={styles.applicationService}>{item.service}</Text>
      <Text style={styles.applicationStatus}>{item.status}</Text>
      <Text style={styles.applicationDate}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
             <View style={styles.header}>
         <Text style={styles.welcome}>Welcome, {user?.name || 'User'}</Text>
         <View style={styles.headerActions}>
           <TouchableOpacity style={styles.notificationButton} onPress={() => navigation.navigate('Notifications')}>
             <Text style={styles.notificationIcon}>🔔</Text>
           </TouchableOpacity>
           <TouchableOpacity onPress={logout}>
             <Text style={styles.logout}>Logout</Text>
           </TouchableOpacity>
         </View>
       </View>
      
      <Text style={styles.sectionTitle}>Active Applications</Text>
      <FlatList
        data={activeApplications}
        renderItem={renderApplication}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.applicationsList}
      />
      
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('ServiceHub', { service: 'passport' })}
        >
          <Text style={styles.actionText}>Passport</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('ServiceHub', { service: 'pan' })}
        >
          <Text style={styles.actionText}>PAN Card</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('ServiceHub', { service: 'aadhaar' })}
        >
          <Text style={styles.actionText}>Aadhaar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('ServiceHub', { service: 'tax' })}
        >
          <Text style={styles.actionText}>Tax Filing</Text>
        </TouchableOpacity>
                 <TouchableOpacity 
           style={styles.actionButton}
           onPress={() => navigation.navigate('TaxPayment')}
         >
           <Text style={styles.actionText}>Tax Payment</Text>
         </TouchableOpacity>
         <TouchableOpacity 
           style={styles.actionButton}
           onPress={() => navigation.navigate('TaxFiling')}
         >
           <Text style={styles.actionText}>Tax Filing</Text>
         </TouchableOpacity>
         <TouchableOpacity 
           style={styles.actionButton}
           onPress={() => navigation.navigate('AadhaarAppointment')}
         >
           <Text style={styles.actionText}>Aadhaar</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
     headerActions: {
     flexDirection: 'row',
     alignItems: 'center',
   },
   notificationButton: {
     marginRight: 15,
     padding: 8,
   },
   notificationIcon: {
     fontSize: 20,
   },
   logout: {
     fontSize: 16,
     color: '#EF4444',
   },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginVertical: 15,
  },
  applicationsList: {
    paddingBottom: 10,
  },
  applicationCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    width: 200,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  applicationService: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 5,
  },
  applicationStatus: {
    fontSize: 14,
    color: '#10B981',
    marginBottom: 5,
  },
  applicationDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
     actionButton: {
     backgroundColor: '#4F46E5',
     width: '48%',
     height: 80,
     borderRadius: 10,
     justifyContent: 'center',
     alignItems: 'center',
     marginBottom: 15,
   },
  actionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  voiceButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 20,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
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

export default HomeScreen;
