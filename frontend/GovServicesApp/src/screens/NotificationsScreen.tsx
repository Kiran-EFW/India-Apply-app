import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVoice } from '../contexts/VoiceContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  action?: string;
}

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const { startListening, stopListening, isListening, transcript, speak } = useVoice();
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Application Approved',
      message: 'Your passport application has been approved. You can collect it from the nearest passport office.',
      type: 'success',
      timestamp: '2024-01-15 10:30 AM',
      read: false,
      action: 'View Details',
    },
    {
      id: '2',
      title: 'Payment Successful',
      message: 'Your tax payment of ₹15,000 has been processed successfully. UTR: 123456789012345.',
      type: 'success',
      timestamp: '2024-01-14 02:15 PM',
      read: true,
      action: 'View Receipt',
    },
    {
      id: '3',
      title: 'Document Required',
      message: 'Additional documents are required for your PAN application. Please upload them within 7 days.',
      type: 'warning',
      timestamp: '2024-01-13 09:45 AM',
      read: false,
      action: 'Upload Documents',
    },
    {
      id: '4',
      title: 'Appointment Reminder',
      message: 'Your Aadhaar biometric appointment is scheduled for tomorrow at 10:00 AM.',
      type: 'info',
      timestamp: '2024-01-12 06:30 PM',
      read: true,
      action: 'View Appointment',
    },
    {
      id: '5',
      title: 'Application Rejected',
      message: 'Your driving license application has been rejected due to incomplete information.',
      type: 'error',
      timestamp: '2024-01-11 11:20 AM',
      read: false,
      action: 'Reapply',
    },
  ]);

  const handleVoiceCommand = async () => {
    if (isListening) {
      stopListening();
      await processVoiceCommand(transcript);
    } else {
      startListening();
      await speak('Listening for notification commands');
    }
  };

  const processVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('mark all read')) {
      markAllAsRead();
      await speak('All notifications marked as read');
    } else if (lowerCommand.includes('clear all')) {
      clearAllNotifications();
      await speak('All notifications cleared');
    } else if (lowerCommand.includes('unread')) {
      const unreadCount = notifications.filter(n => !n.read).length;
      await speak(`You have ${unreadCount} unread notifications`);
    } else if (lowerCommand.includes('home') || lowerCommand.includes('back')) {
      navigation.navigate('Home');
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearAllNotifications = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => setNotifications([])
        },
      ]
    );
  };

  const handleNotificationAction = (notification: Notification) => {
    markAsRead(notification.id);
    
    switch (notification.action) {
      case 'View Details':
        navigation.navigate('Tracking');
        break;
      case 'View Receipt':
        navigation.navigate('TaxPayment');
        break;
      case 'Upload Documents':
        navigation.navigate('DocumentVault');
        break;
      case 'View Appointment':
        navigation.navigate('AadhaarAppointment');
        break;
      case 'Reapply':
        navigation.navigate('ServiceHub');
        break;
      default:
        break;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#10B981';
      case 'warning':
        return '#F59E0B';
      case 'error':
        return '#EF4444';
      default:
        return '#3B82F6';
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.read && styles.unreadNotification,
      ]}
      onPress={() => handleNotificationAction(item)}
    >
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationIcon}>{getNotificationIcon(item.type)}</Text>
        <View style={styles.notificationInfo}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>{item.timestamp}</Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </View>
      
      <Text style={styles.notificationMessage}>{item.message}</Text>
      
      {item.action && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: getNotificationColor(item.type) }]}
          onPress={() => handleNotificationAction(item)}
        >
          <Text style={styles.actionButtonText}>{item.action}</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={markAllAsRead}>
            <Text style={styles.headerButtonText}>Mark All Read</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={clearAllNotifications}>
            <Text style={styles.headerButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Text style={styles.unreadText}>{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</Text>
        </View>
      )}

      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
      />

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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#4F46E5',
    borderRadius: 6,
  },
  headerButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  unreadBanner: {
    backgroundColor: '#EEF2FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 15,
  },
  unreadText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  notificationsList: {
    flex: 1,
    marginBottom: 20,
  },
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  notificationIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 10,
  },
  actionButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
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

export default NotificationsScreen;
