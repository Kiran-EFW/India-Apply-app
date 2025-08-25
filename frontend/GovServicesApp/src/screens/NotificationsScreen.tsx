import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useVoice } from '../contexts/VoiceContext';
import { notificationService } from '../services/notificationService';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  action?: string;
  actionData?: any;
}

interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  taxReminders: boolean;
  documentExpiry: boolean;
  paymentReminders: boolean;
  appointmentReminders: boolean;
  systemUpdates: boolean;
}

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const { startListening, stopListening, isListening, transcript, speak } = useVoice();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    taxReminders: true,
    documentExpiry: true,
    paymentReminders: true,
    appointmentReminders: true,
    systemUpdates: false,
  });
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
    loadNotificationSettings();
    speak('Welcome to Notifications. You can manage your notifications and settings here.');
  }, []);

  const loadNotifications = async () => {
    try {
      const notificationData = await notificationService.getNotifications();
      setNotifications(notificationData);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const loadNotificationSettings = async () => {
    try {
      const settingsData = await notificationService.getNotificationSettings();
      setSettings(settingsData);
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    }
  };

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
    
    if (lowerCommand.includes('all notifications') || lowerCommand.includes('show all')) {
      setActiveTab('all');
      await speak('Showing all notifications');
    } else if (lowerCommand.includes('unread') || lowerCommand.includes('unread notifications')) {
      setActiveTab('unread');
      await speak('Showing unread notifications');
    } else if (lowerCommand.includes('mark all read') || lowerCommand.includes('read all')) {
      await handleMarkAllAsRead();
    } else if (lowerCommand.includes('settings') || lowerCommand.includes('notification settings')) {
      setActiveTab('settings');
      await speak('Opening notification settings');
    } else if (lowerCommand.includes('clear all') || lowerCommand.includes('delete all')) {
      await handleClearAllNotifications();
    } else if (lowerCommand.includes('back') || lowerCommand.includes('home')) {
      navigation.goBack();
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      ));
      await speak('Notification marked as read');
    } catch (error) {
      Alert.alert('Error', 'Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await speak('Marking all notifications as read');
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      await speak('All notifications marked as read');
    } catch (error) {
      Alert.alert('Error', 'Failed to mark all notifications as read');
    }
  };

  const handleClearAllNotifications = async () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await speak('Clearing all notifications');
              await notificationService.clearAllNotifications();
              setNotifications([]);
              await speak('All notifications cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear notifications');
            }
          },
        },
      ]
    );
  };

  const handleSettingToggle = async (setting: keyof NotificationSettings) => {
    try {
      const newSettings = { ...settings, [setting]: !settings[setting] };
      setSettings(newSettings);
      await notificationService.updateNotificationSettings(newSettings);
      await speak(`${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} ${newSettings[setting] ? 'enabled' : 'disabled'}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update notification settings');
    }
  };

  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.read) {
      await handleMarkAsRead(notification.id);
    }

    if (notification.action) {
      // Handle notification action (navigate to specific screen)
      switch (notification.action) {
        case 'tax_payment':
          navigation.navigate('TaxPayment');
          break;
        case 'aadhaar_appointment':
          navigation.navigate('AadhaarAppointment');
          break;
        case 'document_upload':
          navigation.navigate('DocumentVault');
          break;
        default:
          break;
      }
    }
  };

  const getFilteredNotifications = () => {
    if (activeTab === 'unread') {
      return notifications.filter(notification => !notification.read);
    }
    return notifications;
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
        return '#4F46E5';
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.read && styles.unreadNotification,
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationIcon}>
          {getNotificationIcon(item.type)}
        </Text>
        <View style={styles.notificationInfo}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </View>
      <Text style={styles.notificationMessage}>{item.message}</Text>
    </TouchableOpacity>
  );

  const renderSettingsItem = (key: keyof NotificationSettings, label: string, description: string) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={settings[key]}
        onValueChange={() => handleSettingToggle(key)}
        trackColor={{ false: '#E5E7EB', true: '#4F46E5' }}
        thumbColor={settings[key] ? '#FFFFFF' : '#FFFFFF'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All ({notifications.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'unread' && styles.activeTab]}
          onPress={() => setActiveTab('unread')}
        >
          <Text style={[styles.tabText, activeTab === 'unread' && styles.activeTabText]}>
            Unread ({notifications.filter(n => !n.read).length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'settings' ? (
          <View style={styles.settingsContainer}>
            <Text style={styles.sectionTitle}>Notification Preferences</Text>
            
            {renderSettingsItem(
              'pushNotifications',
              'Push Notifications',
              'Receive notifications on your device'
            )}
            
            {renderSettingsItem(
              'emailNotifications',
              'Email Notifications',
              'Receive notifications via email'
            )}
            
            {renderSettingsItem(
              'smsNotifications',
              'SMS Notifications',
              'Receive notifications via SMS'
            )}
            
            <Text style={styles.sectionTitle}>Reminder Types</Text>
            
            {renderSettingsItem(
              'taxReminders',
              'Tax Reminders',
              'Reminders for tax filing deadlines'
            )}
            
            {renderSettingsItem(
              'documentExpiry',
              'Document Expiry',
              'Alerts for expiring documents'
            )}
            
            {renderSettingsItem(
              'paymentReminders',
              'Payment Reminders',
              'Reminders for pending payments'
            )}
            
            {renderSettingsItem(
              'appointmentReminders',
              'Appointment Reminders',
              'Reminders for scheduled appointments'
            )}
            
            {renderSettingsItem(
              'systemUpdates',
              'System Updates',
              'Notifications about app updates and maintenance'
            )}
          </View>
        ) : (
          <View style={styles.notificationsContainer}>
            {getFilteredNotifications().length > 0 ? (
              <>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleMarkAllAsRead}
                  >
                    <Text style={styles.actionButtonText}>Mark All Read</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, styles.clearButton]}
                    onPress={handleClearAllNotifications}
                  >
                    <Text style={[styles.actionButtonText, styles.clearButtonText]}>
                      Clear All
                    </Text>
                  </TouchableOpacity>
                </View>
                
                <FlatList
                  data={getFilteredNotifications()}
                  renderItem={renderNotificationItem}
                  keyExtractor={item => item.id}
                  scrollEnabled={false}
                />
              </>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>📱</Text>
                <Text style={styles.emptyTitle}>No Notifications</Text>
                <Text style={styles.emptyText}>
                  {activeTab === 'unread' 
                    ? 'You have no unread notifications'
                    : 'You have no notifications yet'
                  }
                </Text>
              </View>
            )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4F46E5',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  settingsContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
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
    marginTop: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  notificationsContainer: {
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: '#EF4444',
  },
  clearButtonText: {
    color: 'white',
  },
  notificationItem: {
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
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
});

export default NotificationsScreen;
